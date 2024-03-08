import type { AppRouteRecordRaw } from '@/router/types'
export const TEST_ROUTE: AppRouteRecordRaw = {
  path: '/test',
  name: 'test',
  component: () => import('@/views/Test.vue'),
  meta: { title: 'Test' }
}
