<script setup lang="ts">
import { useLocale } from '@/locales/useLocale'
const { setI18nLang } = useLocale()
defineProps<{
  msg: string
}>()
const handleButtonClick = () => {
  setI18nLang('en_US')
}
</script>

<template>
  <div class="greetings">
    <!-- <h1 class="green">{{ msg }}</h1> -->
    <h3>
      <!-- {{ $t('test') }} -->
    </h3>
    <button @click="handleButtonClick">切换</button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
