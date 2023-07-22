<template>
  <div>
    <input
      type="text"
      v-model="searchText"
      @input="handleSearch"
      placeholder="Search..."
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Search',
  setup() {
    const searchText = ref('');

    const handleSearch = () => {
      // Emit the 'search' event with the current search text
      if (searchText.value.trim()) {
        const trimmedText = searchText.value.trim();
        // Emit the 'search' event with the trimmed search text
        emit('search', trimmedText);
      }
    };

    return { searchText, handleSearch };
  },
});
</script>
