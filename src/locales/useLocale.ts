import type { LocaleType } from '@/types/locale'
import { i18n } from '@/locales'
export const useLocale = () => {
  const setI18nLang = (locale: LocaleType) => {
    i18n.global.locale = locale
  }
  return {
    setI18nLang
  }
}
