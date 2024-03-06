import type { App } from 'vue'
export default {
  install(app: App, option: any) {
    app.config.globalProperties.$myT = (key: string) => {
      const str: any = {}
      return key.split('.').reduce((pre, cur) => pre[cur], option)
    }
  }
}
