import { PluginObject } from 'vue'
import { Vue as _Vue } from 'vue/types/vue'
import { KeyRouter} from './KeyRouter'
import KeyRouterLink from '../demos/KeyRouterLink.vue'
import { KeyRouterOptions } from './interfaces'

export const VueKeyNavigatorPlugin: PluginObject<KeyRouterOptions> = {
  install: (Vue: typeof _Vue, options: KeyRouterOptions = {}): void => {
    Vue.prototype.$keyRouter = new KeyRouter(options)

    // Make object reactive
    new Vue({ data: () => ({ keyNavigator: Vue.prototype.$keyRouter }) })
    Vue.component('KeyRouterLink', KeyRouterLink)
  },
}
