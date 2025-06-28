<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import CreateLink from './CreateLink.svelte';
  import DecryptLink from './DecryptLink.svelte';

  const getUrlParams = new URLSearchParams(page.url.search);
  let urlParams = $state({
    linkData: getUrlParams.get('q'),
    version: getUrlParams.get('v'),
    string: page.url.search,
  });
  let mode = $state(urlParams.linkData ? 'decrypt' : 'create');

  // Update the urlParams when the page changes
  afterNavigate(() => {
    const newUrlSearch = page.url.search;
    if (urlParams.string !== newUrlSearch) {
      const newUrlParams = new URLSearchParams(newUrlSearch);
      urlParams.linkData = newUrlParams.get('q');
      urlParams.version = newUrlParams.get('v');
      urlParams.string = newUrlSearch;
      // Change mode
      mode = urlParams.string ? 'decrypt' : 'create';
    }
  });
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
  {#if mode === 'create'}
    <CreateLink/>
  {:else if mode === 'decrypt'}
    <DecryptLink urlParams={urlParams} />
  {:else}
    <div class="flex justify-center items-center h-[250px]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  {/if}
</div>