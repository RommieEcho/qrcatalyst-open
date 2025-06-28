<script lang="ts">
  import { goto } from '$app/navigation';
  import { decrypt } from './XORCipher.js';

  let { urlParams } = $props();

  let password = $state('');
  let isLoading = $state(false);
  let decryptedLinks = $state<string[]>([]);

  const handleDecryptLink = async () => {
    try {
      isLoading = true;
      
      // Split the linkData into individual encrypted entries
      const encryptedEntries = urlParams.linkData.split('-');
      console.log('encryptedEntries', encryptedEntries);
      
      // Decrypt all entries in parallel
      const decryptionPromises = encryptedEntries.map((entry: string) => 
        decrypt(password, entry)
      );
      
      const results = await Promise.all(decryptionPromises);
      
      // Verify all decryptions were successful
      if (results.some(result => result === null)) {
        throw new Error('Invalid password or corrupted data');
      }
      
      // Remove control characters (U+0000-U+001F)
      decryptedLinks = results.map((link: string) => link.replace(/[\x00-\x1F]/g, ''));
    } catch (err: any) {
      decryptedLinks = [];
    } finally {
      isLoading = false;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  function reset() {
    goto(location.pathname, { replaceState: false });
  };
</script>

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
    class="w-full bg-green-600 hover:bg-green-700 cursor-pointer disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
  >
    {isLoading ? 'Decrypting...' : 'Decrypt Link'}
  </button>

  {#if decryptedLinks.length > 0}
    <div>
      <h3 class="text-sm mb-1.5 font-medium text-green-600">
        {#if decryptedLinks.length === 1}
          Decrypted Link:
        {:else}
          Decrypted {decryptedLinks.length} Links:
        {/if}
      </h3>
      
      <div class="flex flex-col gap-y-2">
        {#each decryptedLinks as link, index (index)}
        {@const isLink = link.startsWith('http://') || link.startsWith('https://')}
        <div class="flex gap-x-2">
          <input type="text" value={link} readonly class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"/>
            {#if isLink}
              <a href={link} target="_blank" rel="noopener noreferrer" class="px-4 py-2 inline-block transition-[scale_colors] active:scale-95 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                View Link
              </a>
            {:else}
              <button onclick={() => copyToClipboard(link)} class="px-3 py-2 cursor-pointer transition-[scale_colors] active:scale-95 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                Copy
              </button>
            {/if}
        </div>  
        {/each}
      </div>
    </div>
  {/if}

  <div class="mt-6 pt-4 border-t border-gray-200">
    <div class="flex justify-between items-center">
      <button
        onclick={reset}
        class="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
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