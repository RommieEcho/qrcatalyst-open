<script lang="ts">
  import { page } from '$app/state';
  import { encrypt } from './XORCipher.js';

  let isLoading = $state(false);
  let error = $state('');
  let encryptedURL = $state('');

  type LinkCreateData = {
    text: string;
    password: string;
  };

  let linkCreateStack: LinkCreateData[] = $state([{
    text: '',
    password: '',
  }]);

  // Link Input Functions
  function addDecoyField(text: string, password: string) {
    linkCreateStack = [...linkCreateStack, { text, password }];
  }

  function addRandomDecoyField() {
    // Generate a random length between 20 and 200 characters
    const textLength = Math.floor(Math.random() * (200 - 20 + 1)) + 20;
    const passwordLength = Math.floor(Math.random() * (32 - 16 + 1)) + 16;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.:/?=&';
    let text = '';
    for (let i = 0; i < textLength; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = chars + specialChars;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    addDecoyField(text, password);
  }

  function removeDecoyField(index: number) {
    linkCreateStack = linkCreateStack.filter((_, i) => i !== index);
  }

  function randomizeStack(stack: LinkCreateData[]) {
    return [...stack].sort(() => Math.random() - 0.5);    
  }

  function handleCreateLink() {
    const emptyFields = linkCreateStack.filter((field) => field.text === '' || field.password === '');
    if (emptyFields.length > 0) {
      error = 'Please fill in all fields before creating a link.';
      setTimeout(() => {
        error = '';
      }, 5000);
      return;
    } else {
      error = '';
    }

    processLink();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Link Processing
  async function processLink() {
    isLoading = true;
    const randomizedStack = randomizeStack(linkCreateStack);
    const encryptedStack = [];
    for (const entry of randomizedStack) {
      const seed = entry.password;
      const text = entry.text;
      const encryptedText = await encrypt(seed, text);
      encryptedStack.push(encryptedText);
    }
    const baseUrl = `${page.url.origin}${page.url.pathname}`;
    encryptedURL = `${baseUrl}?q=${encryptedStack.join('-')}&v=2`;
    isLoading = false;
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold text-gray-900">
      Create Encrypted Link
    </h2>
    <a 
      href="https://github.com/RommieEcho/qrcatalyst-open"
      target="_blank"
      rel="noopener noreferrer"
      class="text-gray-600 hover:text-gray-900 transition-colors"
      title="View source on GitHub"
    >
      <img src="/github.svg" alt="GitHub" class="w-5 h-5"/>
    </a>
  </div>
  
  <div>
    <label for="originalLink" class="block text-sm font-medium text-gray-700 mb-2">
      Link or Text to Share
    </label>
    <input
      id="originalLink"
      type="text"
      bind:value={linkCreateStack[0].text}
      minlength={2}
      placeholder="text/URL"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      style="font-family: 'Verdana', sans-serif;"
      />
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
      Password or Pin <span class="text-xs text-gray-500">(passphrase recommended)</span>
    </label>
    <input
      id="password"
      type="password"
      bind:value={linkCreateStack[0].password}
      placeholder="Enter a strong password"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      style="font-family: 'Verdana', sans-serif;"
    />
  </div>

  <!-- Add Decoy Section -->
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-2 relative">
      <button type="button" onclick={() => addDecoyField('', '')} class="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors">
        Add Decoy Field
      </button>
      <button type="button" onclick={addRandomDecoyField} class="absolute hover:scale-110 right-2 rounded-xl flex-0 text-2xl cursor-pointer transition-[scale] active:scale-95">
        🎲
      </button>
    </div>

    {#each linkCreateStack.slice(1) as decoy, index (index)}
      <div class="border-l-4 border-blue-200 pl-4 space-y-4" class:hidden={linkCreateStack.length === 1}>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for={`decoy-data-${index + 1}`} class="block text-sm font-medium text-gray-700">
              Decoy Data {index + 1}
            </label>
            <button onclick={() => removeDecoyField(index + 1)} class="text-xs cursor-pointer font-bold px-1 pt-[1px] pb-0.5 bg-gray-100 hover:bg-gray-200 hover:text-red-700 rounded-full transition-colors duration-300" title="Remove decoy" type="button">
              —
            </button>
          </div>
          <input
            id={`decoy-data-${index + 1}`}
            type="text"
            bind:value={decoy.text}
            placeholder="Decoy text/URL"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style="font-family: 'Verdana', sans-serif;"
            />
        </div>
        <div>
          <input
            type="password"
            bind:value={decoy.password}
            placeholder="Decoy password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style="font-family: 'Verdana', sans-serif;"
            />
        </div>
      </div>
    {/each}
  </div>

  {#if error}
    <p class="text-red-700 text-sm mb-4">{error}</p>
  {/if}
  <button
    onclick={handleCreateLink}
    disabled={isLoading}
    class="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 plausible-event-name--elink active:scale-[0.98] transition-[colors_transform] duration-300 text-white font-medium py-2 px-4 rounded-md"
  >
    {isLoading ? 'Encrypting...' : 'Create Encrypted Link'}
  </button>

  {#if encryptedURL}
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-medium text-gray-900 mb-2">
        Your Encrypted URL:
      </h3>
      <div class="flex gap-2">
        <input
          type="text"
          value={encryptedURL}
          readonly
          class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
        />
        <button onclick={() => copyToClipboard(encryptedURL)} class="px-3 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm rounded active:scale-[0.98] transition-[colors_transform]">
          Copy
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        Share this URL with the password separately for security.
      </p>
    </div>
  {/if}
</div>