import type { AppRouteRecordRaw } from '@/router/types'
export const HOME_ROUTE: AppRouteRecordRaw = {
  path: '/',
  name: 'home',
  meta: { title: 'Root' }
}
export const LOGIN_ROUTE: AppRouteRecordRaw = {
  path: '/login',
  name: 'login',
  component: () => '',
  meta: {}
}
export const ONBOARD_ROUTE: AppRouteRecordRaw = {
  path: '/onboard',
  name: 'onboard',
  component: () => '',
  meta: {}
}
