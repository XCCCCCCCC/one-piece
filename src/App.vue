<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { defineAsyncComponent, ref } from 'vue'
import LoadingC from '@/components/Loading.vue'
import useMy from '@/hooks/web/useMouse'
const showName = ref(false)
const { x, y } = useMy()
const toggle = ref(false)
const nameKey = ref(1)
const NewComp = defineAsyncComponent({
  loader: () => import('@/components/HelloWorld.vue'),
  loadingComponent: LoadingC,
  delay: 2000
})
const vFocus = {
  mounted(e, binding) {
    e.focus()
    console.log(binding)
    e.style.color = binding.value
  }
}
</script>

<template>
  <header>
    <!-- <Transition name="fade">
      <div>{{ $myT('cn.person.name') }}</div>
    </Transition> -->
    <Transition name="b">
      <div v-show="showName">{{ $myT('cn.person.name') }}</div>
    </Transition>
    <input type="text" v-focus:foo="`red`" />
    <!-- <div class="mouse">{{ x }} , {{ y }}</div> -->
    <div class="wrapper">
      <NewComp msg="123" />
      <!-- <LoadingC /> -->
      <button @click="toggle = !toggle">go</button>
      <button @click="showName = !showName">toggle</button>
      <button @click="nameKey++">addkey</button>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  transform: translateX(-20px);
  visibility: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.b-enter-active {
  animation: fangda 5s;
}

.b-leave-active {
  animation: fangda 2s reverse;
}

@keyframes fangda {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
