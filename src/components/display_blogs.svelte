<script>
  import BlogEntry from './blog_entry.svelte';
  import { store } from './store';
  console.log($store)
</script>

<ul>
  {#if $store.length == 0}
    <p>No Blogs</p>
  {/if}
	{#each $store as { href, title, excerpt, date, published, tags }, i}
    {#if published}
      <BlogEntry {href} {title} {excerpt} {date} {tags} />
    {/if}
  {/each}
</ul>
