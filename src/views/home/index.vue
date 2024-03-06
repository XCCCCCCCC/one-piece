<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  // ;(<any>load)('192.168.68.63')
})
</script>

<template>
  <div id="home" class="home">
    <div id="player"></div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 500px;
  height: 500px;
  #player {
    height: 100%;
  }
}
</style>
