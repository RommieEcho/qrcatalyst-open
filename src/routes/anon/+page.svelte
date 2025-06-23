<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { encodeToBase62, decodeFromBase62 } from './compression.js';
  import { smaz_compress, smaz_decompress } from './smaz.js';
  
  let { data } = $props();
  const donationBTC = 'bc1qmapa5jw80c9u2kvhlywug9m3j9yfpwq4ddkz3q';
  const { url } = page;

  // Compression chain functions
  function compressAndEncode(text: string): string {
    try {
      // Step 1: SMAZ compress the text
      const compressed = smaz_compress(text);
      if (!compressed) {
        throw new Error('Compression failed');
      }
      
      // Step 2: Encode to Base62
      const encoded = encodeToBase62(compressed);
      return encoded;
    } catch (err) {
      throw new Error('Failed to compress and encode text');
    }
  }

  function decodeAndDecompress(encodedText: string): string {
    try {
      // Step 1: Decode from Base62
      const decoded = decodeFromBase62(encodedText);
      
      // Step 2: SMAZ decompress
      const decompressed = smaz_decompress(decoded);
      return decompressed;
    } catch (err) {
      throw new Error('Failed to decode and decompress text');
    }
  }

  // State management
  let mode: 'create' | 'decrypt' = $state('create');
  let originalLink = $state('');
  let password = $state('');
  let encryptedData = $state('');
  let decryptedLink = $state('');
  let generatedUrl = $state('');
  let isLoading = $state(false);
  let error = $state('');
  let success = $state('');

  // Compression state
  let inputText = $state('');
  let encodedText = $state('');
  let decodedText = $state('');
  let encoderError = $state('');

  // let testUrl = 'https://www.seek.com.au/jobs/2025-06-23T11_06_10.284Z/?advertiserid=62928812';
  // let testUrlCompressed = smaz_compress(testUrl);
  // let testUrlEncoded = encodeToBase62(testUrlCompressed!);
  // let testUrlDecoded = decodeFromBase62(testUrlEncoded);
  // let testUrlDecompressed = smaz_decompress(testUrlDecoded);
  // console.log(testUrl, testUrlCompressed, testUrlEncoded, testUrlDecoded, testUrlDecompressed);

  // Check if we're in decrypt mode based on URL params
  $effect(() => {
    if (browser) {
      const urlParams = new URLSearchParams(url.search);
      const linkData = urlParams.get('q');
      if (linkData) {
        mode = 'decrypt';
        encryptedData = decodeURIComponent(linkData);
      }
    }
  });

  // Update encoded text when input changes
  $effect(() => {
    if (inputText.trim()) {
      try {
        encodedText = compressAndEncode(inputText);
        encoderError = '';
      } catch (err) {
        encoderError = 'Failed to encode text';
      }
    } else {
      encodedText = '';
      decodedText = '';
    }
  });

  // Update decoded text when encoded text changes
  $effect(() => {
    if (encodedText.trim() && encodedText !== compressAndEncode(inputText || '')) {
      try {
        decodedText = decodeAndDecompress(encodedText);
        encoderError = '';
      } catch (err) {
        encoderError = 'Invalid encoded text format';
      }
    } else if (!encodedText.trim()) {
      decodedText = '';
    }
  });

  // Crypto utilities - simplified without PBKDF2 for shorter output
  async function getKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(password);
    
    // Use SHA-256 to create a consistent key from password
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
    
    return await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptLink(link: string, password: string): Promise<string> {
    try {
      // Step 1: SMAZ compress to get binary data (keeps it small)
      const compressed = smaz_compress(link);
      if (!compressed) {
        throw new Error('Compression failed');
      }
      
      // Step 2: Use a shorter IV (8 bytes instead of 12 for compactness)
      const iv = crypto.getRandomValues(new Uint8Array(8));
      
      const key = await getKey(password);
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        compressed
      );
      
      // Step 3: Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      // Step 4: Use Base62 encoding
      return encodeToBase62(combined);
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async function decryptLink(encryptedData: string, password: string): Promise<string> {
    try {
      // Step 1: Base62 decode
      const combined = decodeFromBase62(encryptedData);
      
      // Step 2: Extract components (8-byte IV + encrypted data)
      const iv = combined.slice(0, 8);
      const encrypted = combined.slice(8);
      
      // Step 3: Decrypt to get binary compressed data
      const key = await getKey(password);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );
      
      // Step 4: SMAZ decompress the binary data directly
      const originalLink = smaz_decompress(new Uint8Array(decrypted));
      return originalLink;
    } catch (error) {
      throw new Error(`Decryption failed: Wrong password`);
    }
  }

  // Event handlers
  async function handleCreateLink() {
    if (!originalLink || !password) {
      error = 'Please enter both a link and password';
      return;
    }

    // Validate URL
    try {
      new URL(originalLink);
    } catch {
      error = 'Please enter a valid URL';
      return;
    }

    if (password.length < 4) {
      error = 'Password must be at least 4 characters';
      return;
    }

    isLoading = true;
    error = '';
    
    try {
      const encrypted = await encryptLink(originalLink, password);
      const baseUrl = `${url.origin}${url.pathname}`;
      generatedUrl = `${baseUrl}?q=${encrypted}`;
      success = 'Encrypted link created successfully!';
    } catch (err) {
      error = 'Failed to encrypt link';
    } finally {
      isLoading = false;
    }
  }

  async function handleDecryptLink() {
    if (!password) {
      error = 'Please enter the password';
      return;
    }

    isLoading = true;
    error = '';
    
    try {
      decryptedLink = await decryptLink(encryptedData, password);
      success = 'Link decrypted successfully!';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to decrypt link';
    } finally {
      isLoading = false;
    }
  }

  function copyToClipboard(text: string) {
    if (browser && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        success = 'Copied to clipboard!';
        setTimeout(() => success = '', 2000);
      });
    }
  }

  function reset() {
    originalLink = '';
    password = '';
    encryptedData = '';
    decryptedLink = '';
    generatedUrl = '';
    error = '';
    success = '';
    mode = 'create';
    
    // Clear URL params
    if (browser) {
      window.history.replaceState({}, '', url.pathname);
    }
  }
</script>

<svelte:head>
  <title>Anonymous Link Sharing | QR Catalyst</title>
  <meta name="description" content="Share links anonymously with password protection and encode/decode text with compression. Fully client-side." />
</svelte:head>

<div class="max-w-2xl mx-auto p-6">
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      Anonymous Link Sharing & Compression
    </h1>
    <p class="text-gray-600">
      Share links securely with password protection, no account or information required.
    </p>
  </div>

  <!-- Error/Success Messages -->
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
      {success}
    </div>
  {/if}

  <div class="bg-white rounded-lg shadow-lg p-6">
    {#if mode === 'create'}
      <!-- Create Mode -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">
          Create Encrypted Link
        </h2>
        
        <div>
          <label for="originalLink" class="block text-sm font-medium text-gray-700 mb-2">
            Link to Share
          </label>
          <input
            id="originalLink"
            type="url"
            bind:value={originalLink}
            placeholder="https://example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password or Pin <span class="text-xs text-gray-500">(passphrase recommended)</span>
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="Enter a strong password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style="font-family: 'Verdana', sans-serif;"
          />
        </div>

        <button
          onclick={handleCreateLink}
          disabled={isLoading}
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Encrypting...' : 'Create Encrypted Link'}
        </button>

        {#if generatedUrl}
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-900 mb-2">
              Your Encrypted URL:
            </h3>
            <div class="flex gap-2">
              <input
                type="text"
                value={generatedUrl}
                readonly
                class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
              />
              <button
                onclick={() => copyToClipboard(generatedUrl)}
                class="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Share this URL with the password separately for security.
            </p>
          </div>
        {/if}
      </div>

    {:else}
      <!-- Decrypt Mode -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">
          Decrypt Link
        </h2>
        
        <p class="text-gray-600">
          This link is password protected. Enter the password to reveal the original URL.
        </p>

        <div>
          <label for="decryptPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="decryptPassword"
            type="password"
            bind:value={password}
            placeholder="Enter the password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onkeydown={(e) => e.key === 'Enter' && handleDecryptLink()}
          />
        </div>

        <button
          onclick={handleDecryptLink}
          disabled={isLoading}
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Decrypting...' : 'Decrypt Link'}
        </button>

        {#if decryptedLink}
          <div class="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-900 mb-2">
              Decrypted Link:
            </h3>
            <div class="flex gap-2 mb-3">
              <input
                type="text"
                value={decryptedLink}
                readonly
                class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
              />
              <button
                onclick={() => copyToClipboard(decryptedLink)}
                class="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <a
              href={decryptedLink}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Open Link →
            </a>
          </div>
        {/if}

        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <button
              onclick={reset}
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Create a new encrypted link
            </button>
            <a
              href="https://swiftbase.to/contact"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 hover:text-gray-700 text-xs font-medium"
            >
              Report
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Security Info -->
  <div class="mt-8 p-4 bg-blue-50 rounded-lg">
    <h3 class="text-sm font-semibold text-blue-900 mb-2">
      🔒 Security & Encoding Features
    </h3>
    <ul class="text-sm text-blue-800 space-y-1">
      <li>• All encryption/decryption happens locally in your browser</li>
      <li>• Uses AES-256-GCM encryption with SHA-256 key derivation</li>
      <li>• 64-bit IV provides excellent protection against collision attacks</li>
      <li>• Compression uses SMAZ algorithm and Base62 for URL encoding</li>
      <li>• No data is stored on any server, all processing is done on your browser</li>
      <li>• Optimized for shorter URLs while maintaining strong security</li>
      <li>• Encryption is balanced with shorter link length - use strong passphrase for best protection</li>
      <li>• Share the URL and password separately for maximum security</li>
      <li>• Support me, donate BTC: {donationBTC}</li>
    </ul>
  </div>
</div>