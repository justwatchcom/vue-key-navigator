// 1. Make sure to import 'vue' before declaring augmented types
import { KeyRouter } from './KeyRouter'

declare module 'vue/types/vue' {
  interface Vue {
    $keyRouter: KeyRouter
  }
}

// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//     subs?: {[key: string]: (...args: any[]) => void}
//   }
// }

export { VueKeyNavigatorPlugin } from './plugin'

export { default as KeyRouterLink } from '../demos/KeyRouterLink.vue'
