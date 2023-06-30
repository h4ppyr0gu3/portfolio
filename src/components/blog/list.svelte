<script>
  import DisplayBlogs from './display.svelte';
  import json from '../../../blogs.json';
  import Fuse from 'fuse.js';
  import { store } from '../store';

  const blogs = json.blog;
  $store = blogs;

  let sth;

  function handleSearch(e) {
    const options = {
      keys: ['title', 'excerpt']
    }

    const search = document.getElementById('blogSearch').value;
    if (search === '') {
      $store = blogs
      return
    }
    console.log(search);
    const fuse = new Fuse(blogs, options);

    $store = fuse.search(search).map(obj => obj.item);
  }
</script>

<form on:submit|preventDefault={handleSearch} class="mx-4 flex justify-center items-center mb-2">
  <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
  <div class="relative w-96 justify-center">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
    <input type="search" name="search" id="blogSearch" class="block p-4 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-full" placeholder="Search for a Blog...">
    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-sky-500 hover:bg-sky-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 ">Search</button>
  </div>
</form>
