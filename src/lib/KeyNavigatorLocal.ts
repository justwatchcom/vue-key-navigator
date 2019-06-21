import { Vue } from 'vue/types/vue'
import { KeyNavigator } from './KeyNavigator'

export class KeyNavigatorLocal {
  keyNavigator: KeyNavigator
  component: Vue

  constructor (keyNavigator: KeyNavigator, component: Vue) {
    this.keyNavigator = keyNavigator
    this.component = component
  }
}
