<template>
  <ul>
    <li v-if="til.length > 0" v-for="(item, index) in til" onclick="{{}}" class="flex justify-center content-center grid cols-1">

      <p v-if="index == 0 || til[index].topics != til[index-1].topics" class="text-xl font-bold text-sky-400 flex justify-center content-center">{{til[index].topics}}</p>
      <h5 class="group text-2xl text-gray-900 dark:text-white p w-fit">
        <a :href="item.href" :title="item.excerpt"><span class="hover:underline font-semibold">{{item.title}}</span></a>
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
