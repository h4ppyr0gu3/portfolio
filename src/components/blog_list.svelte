<script>
  let blogs = [
    { href: '/blog/test', title: 'Astro', excerpt: 'A framework for your next project', date: '2022-01-01' },
  ]
</script>

<div>search block</div>
<h1>Blogs</h1>
<div class="group p-5 m-5 rounded border">
  <button class="group-hover:bg-sky-400 rounded-lg p-2 m-2 border">test</button>
</div>

<ul>
	{#each blogs as { href, title, excerpt, date }, i}
		<li>
      <a href="{href}">
        {date}: {title}
      </a>
      <p>{excerpt}</p>
    </li>
	{/each}
</ul>
