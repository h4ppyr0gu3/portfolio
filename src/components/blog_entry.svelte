<script>
  export let href, title, excerpt, date, tags;
</script>

<li class="flex justify-center content-center">
  <h5 class="group relative text-2xl text-gray-900 dark:text-white p w-fit">
    <a href="{href}"><span class="hover:underline font-semibold">{title}</span></a>
    <div class="absolute content-center transform -translate-x-1/2 left-1/2 top-10 group-hover:block z-10 dark:bg-neutral-600 bg-gray-200 p-2 rounded-lg hidden text-base no-underline w-96">{excerpt}</div>
    <div data-popper-arrow></div>
  </h5>
</li>
