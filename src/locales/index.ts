import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import zh_CN from '@/locales/lang/zh_CN'
import en_US from '@/locales/lang/en_US'
const locale = sessionStorage.lang || 'zh_CN'
export let i18n: ReturnType<typeof createI18n>
export const setupI18n = (app: App) => {
  i18n = createI18n({
    locale,
    messages: {
      zh_CN,
      en_US
    }
  })
  app.use(i18n)
}
