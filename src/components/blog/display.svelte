<script>
  import BlogEntry from './entry.svelte';
  import { store } from '../store';

  $store.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

  function parseDate(string) {
    var parts = string.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // months are zero-based (0-11)
    var year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }

</script>

<ul class="text-center">
  {#if $store.length == 0}
    <p>No Blogs</p>
  {/if}
	{#each $store as { href, title, excerpt, date, published, tags }, i}
    {#if published}
      {#if i === 0 || parseDate(date).getFullYear() !== parseDate($store[i-1].date).getFullYear()}
        <li class="text-xl font-bold text-sky-400 flex justify-center content-center">{parseDate(date).getFullYear()}</li>
      {/if}
      <BlogEntry {href} {title} {excerpt} {date} {tags} />
    {/if}
  {/each}
</ul>
