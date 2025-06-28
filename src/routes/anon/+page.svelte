<script lang="ts">
  import DeniableEncryption from './DeniableEncryption.svelte';
  const donationBTC = 'bc1qmapa5jw80c9u2kvhlywug9m3j9yfpwq4ddkz3q';
</script>

<svelte:head>
  <title>Create Deniable Encrypted Link | QR Catalyst</title>
  <meta name="description" content="Create encrypted links with plausible deniability. Multiple decoy layers, client-side encryption, and zero server storage for maximum privacy and security." />
  <meta name="keywords" content="deniable encryption, encrypted links, secure sharing, plausible deniability, privacy tool, client-side encryption, zero knowledge encryption, secure messaging" />  
</svelte:head>

<div class="py-10 mx-auto w-11/12 max-w-3xl lg:w-10/12 lg:max-w-screen-2xl">
  <div class="flex flex-col items-center">
    <h1 class="text-4xl font-bold text-center">Create Anonymous Deniable Encrypted Links</h1>
    <p class="text-lg my-2 text-slate-600 text-center">Share links or text with password protection, no account or information required (v2)</p>
  </div>
  <div class="max-w-2xl mx-auto pt-4">
    <DeniableEncryption />
    <div class="mt-4 py-4 px-2 bg-blue-50 rounded-lg flex flex-col gap-y-4">
      <!-- Security Tips -->
      <section>
        <h3 class="text-sm font-semibold text-blue-900 mb-1">🔒 Tips & Security</h3>
        <ul class="ml-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>All encryption/decryption happens locally in your browser</li>
          <li>No data is stored on any server, all processing is done on your browser</li>
          <li>Remove `https://` from URLs for added security and shorter links</li>
          <li>Use a strong 12+ character password for maximum protection (1 billion+ years to crack)</li>
          <li>Add multiple decoys for plausible deniability - each appears as valid content</li>
          <li>Share the URL and password separately for maximum security</li>
          <li>Full strength encryption prioritizes security over link length</li>
          <li>Support me with bitcoin: {donationBTC}</li>
        </ul>
      </section>
      <!-- Technical Details -->
      <section>
        <h3 class="text-sm font-semibold text-blue-900 mb-1">⚙️ Detailed Technical Info</h3>
        <ul class="ml-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
        <li>Uses XOR cipher with HMAC-SHA256 key derivation and chaining</li>
        <li>96-bit random IV prevents pattern analysis and ensures semantic security</li>
        <li>Password-based encryption with cryptographically secure key expansion</li>
        <li>Implements Deniable Encryption - decoys are separate cipher nodes with unique keys</li>
        <li>Each decoy adds exponential security layers, making forced decryption useless</li>
        <li>Decoys presented in random order, impossible to distinguish real from fake content</li>
        <li>Base62 encoding and hyphen-separated cipher blocks for URL compatibility</li>
        <li>Brute force resistance scales exponentially with password length and complexity</li>
        </ul>
      </section>
      <!-- Legacy Support -->
      <section>
        <h3 class="text-sm font-semibold text-blue-900 mb-1">🔗 Previous Tool Version</h3>
        <ul class="ml-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            <a href="/anon/v1" class="underline">Anonymous Link Sharing & Compression V1</a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</div>