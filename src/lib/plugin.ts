import { PluginObject } from 'vue'
import { Vue as _Vue } from 'vue/types/vue'
import { KeyRouter, KeyRouterOptions } from './KeyRouter'
import KeyRouterLink from '../demos/KeyRouterLink.vue'

export const VueKeyNavigatorPlugin: PluginObject<KeyRouterOptions> = {
  install: (Vue: typeof _Vue, options: KeyRouterOptions = {}): void => {
    Vue.prototype.$keyRouter = new KeyRouter(options)

    // Make object reactive
    new Vue({ data: () => ({ keyNavigator: Vue.prototype.$keyRouter }) })

    Vue.component('KeyRouterLink', KeyRouterLink)
  },
}
