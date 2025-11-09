<script setup lang="ts">
import TreeTable from '@/components/TreeTable.vue'
import { items } from '@/data/tree-items'
</script>

<template>
  <main>
    <TreeTable :items />
  </main>
</template>

<style scoped>
main {
  max-width: 1200px;
  margin: auto;
  padding: 2rem 0;
}
</style>
