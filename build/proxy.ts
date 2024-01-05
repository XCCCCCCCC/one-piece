import type { ProxyOptions } from 'vite'
type ProxyItem = [string, string]
type ProxyList = ProxyItem[]
type ProxyTargetList = Record<string, ProxyOptions>

export const returnProxy = (list: ProxyList): ProxyTargetList => {
  const proxy: ProxyTargetList = {}
  const httpsReg = /^https\/\//
  for (const [prefix, target] of list) {
    const isHttps = httpsReg.test(target)
    proxy[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
      secure: isHttps
    }
  }
  return proxy
}
export const parseEnv = (envConfig: any) => {
  const { VITE_APP_PROXY } = envConfig
  return {
    proxyConfig: JSON.parse(VITE_APP_PROXY)
  }
}
