<script setup lang="ts">
import { reactive, ref } from 'vue'
import ComponentA from '@/components/ComponentA.vue'
import ComponentB from '@/components/ComponentB.vue'
const list = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const key = ref('a')
const c = {
  a: ComponentA,
  b: ComponentB
}
</script>

<template>
  <div id="test">
    <TransitionGroup name="fade" tag="ul">
      <li v-for="(item, index) in list" :key="item">
        {{ item }}
      </li>
    </TransitionGroup>
    <button @click="list.splice(1, 0, 99)">pop</button>
    <KeepAlive exclude="ComponentA">
      <component :is="c[key]"></component>
    </KeepAlive>
    <Teleport to="#app">
      <div class="modal">123</div>
    </Teleport>
    <button @click="key === 'a' ? (key = 'b') : (key = 'a')">toggle</button>
  </div>
</template>

<style lang="scss" scoped>
.fade-move,
.fade-enter-active,
.face-leave-active {
  transition: all 0.8s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
