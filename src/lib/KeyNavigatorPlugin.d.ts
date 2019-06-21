// 1. Make sure to import 'vue' before declaring augmented types
import { KeyNavigator } from './KeyNavigator'

declare module 'vue/types/vue' {
  interface Vue {
    $keyNavigatorGlobal: KeyNavigator
  }
}

// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//     subs?: {[key: string]: (...args: any[]) => void}
//   }
// }
