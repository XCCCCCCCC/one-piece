import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupI18n } from '@/locales'

import App from './App.vue'
import { setupRouter } from '@/router'

const app = createApp(App)

app.use(createPinia())

// Multilingual configuration
// 多语言配置
setupI18n(app)

// Configure routing
// 配置路由
setupRouter(app)

app.mount('#app')
