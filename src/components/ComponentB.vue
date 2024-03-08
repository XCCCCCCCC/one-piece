<script setup lang="ts">
import { ref, onDeactivated } from 'vue'
onDeactivated(() => {
  console.log(`我被缓存了`)
})
const text = ref('')
</script>

<template>
  <div id="C-A">
    <input type="text" v-model="text" />
  </div>
</template>

<style lang="scss" scoped></style>
