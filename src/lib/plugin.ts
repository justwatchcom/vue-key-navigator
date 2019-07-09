import { PluginObject } from 'vue'
import { Vue as _Vue } from 'vue/types/vue'
import { KeyRouter, NodePathItem } from './KeyRouter'
import KeyRouterLink from '../demos/KeyRouterLink.vue'

export interface KeyRouterPluginOptions {
  disabled?: boolean,
  nodePath?: NodePathItem[]
}

export const VueKeyNavigatorPlugin: PluginObject<KeyRouterPluginOptions> = {
  install: (Vue: typeof _Vue, options: KeyRouterPluginOptions = {}): void => {
    Vue.prototype.$keyRouter = new KeyRouter(options)

    // Make object reactive
    new Vue({ data: () => ({ keyNavigator: Vue.prototype.$keyRouter }) })

    Vue.component('KeyRouterLink', KeyRouterLink)
  },
}
