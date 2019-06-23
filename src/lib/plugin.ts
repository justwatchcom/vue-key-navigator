import { PluginObject } from 'vue'
import { Vue as _Vue } from 'vue/types/vue'
import { KeyNavigator, CurrentKeyRoute } from './KeyNavigator'

export interface KeyRoute {
  name: string,
  children: KeyRoute[]
}

export interface VueKeyNavigatorPluginOptions {
  disabled?: boolean,
  keyRoutes?: KeyRoute[],
  currentKeyRoutes?: CurrentKeyRoute[]
}

export const VueKeyNavigatorPlugin: PluginObject<VueKeyNavigatorPluginOptions> = {
  install: (Vue: typeof _Vue, options: VueKeyNavigatorPluginOptions = {}): void => {
    // TODO https://github.com/justwatchcom/vue-key-navigator/issues/5
    if (options.disabled) {
      return
    }

    const keyNavigator = new KeyNavigator(options)

    Vue.prototype.$keyNavigatorGlobal = keyNavigator

    // Make object reactive
    new Vue({ data: () => ({ keyNavigator }) })
  },
}
