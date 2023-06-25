<script>
  import DisplayBlogs from './display_blogs.svelte';
  import json from '../../blogs.json';
  import Fuse from 'fuse.js';
  import { store } from './store';

  const blogs = json.blog;
  $store = blogs;

  let sth;

  function handleSearch(e) {
    const options = {
      keys: ['tags', 'title']
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

<h1 class="text-xl font-bold m-4">Blogs</h1>

<form on:submit|preventDefault={handleSearch} class="mx-4">   
  <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
    <input type="search" name="search" id="blogSearch" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos...">
    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
  </div>
</form>

<div class="group p-5 m-5 rounded border">
  <button class="group-hover:bg-sky-400 rounded-lg p-2 m-2 border">test</button>
</div>
