import { PluginObject, VNode } from 'vue'
import { Vue as _Vue } from 'vue/types/vue'
import { KeyNavigator } from './KeyNavigator'

export interface KeyRoute {
  name: string,
  children: KeyRoute[]
}

export interface VueKeyNavigatorPluginOptions {
  disabled?: boolean,
  keyRoutes?: KeyRoute[],
}

export const VueKeyNavigatorPlugin: PluginObject<VueKeyNavigatorPluginOptions> = {
  install: (Vue: typeof _Vue, options: VueKeyNavigatorPluginOptions = {}): void => {
    // TODO https://github.com/justwatchcom/vue-key-navigator/issues/5
    if (options.disabled) {
      return
    }

    Vue.prototype.$keyNavigatorGlobal = new KeyNavigator(options)
  },
}
