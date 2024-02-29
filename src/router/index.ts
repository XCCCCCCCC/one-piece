import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const router = createRouter({
  // 创建一个hash历史记录。
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ],
  // 是否应该禁止尾部斜杠
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})
export const setupRouter = (app: App) => {
  app.use(router)
}
