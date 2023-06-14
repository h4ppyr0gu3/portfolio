<script>
  import json from '../../blogs.json';

  let blogs = json.blogs;
</script>

<h1>Blogs</h1>
<div class="group p-5 m-5 rounded border">
  <button class="group-hover:bg-sky-400 rounded-lg p-2 m-2 border">test</button>
</div>

<ul>
	{#each blogs as { href, title, excerpt, date }, i}
		<li class="w-full">
      <a href="{href}">
      <div class="p-4 m-4 m-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100">
        <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{title}</h5>
        <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">{excerpt}</p>
        <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
          <div class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
            {date}
          </div>
          <div class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
              Hello
          </div>
        </div>
      </div>
      </a>
    </li>
  {/each}
</ul>
