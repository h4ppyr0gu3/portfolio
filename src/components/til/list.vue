<template>
  <ul>
    <li v-if="til.length > 0" v-for="item in til" onclick="{{}}" class="flex justify-center content-center">

      <h5 class="group text-2xl text-gray-900 dark:text-white p w-fit">
        <a :href="item.href"><span class="hover:underline font-semibold">{{item.title}}</span></a>
      </h5>
    </li>
  </ul>
  <div v-if="til.length == 0">Nothing Learnt today</div>
</template>

<script>
export default {
  name: 'List',
  props: ['til']
}
</script>
