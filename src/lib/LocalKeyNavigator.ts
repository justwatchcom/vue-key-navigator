import { KeyNavigator, Position } from './KeyNavigator'
import { KeyNavigatorMixin } from './KeyNavigatorMixin'

export class LocalKeyNavigator {
  globalKeyNavigator: KeyNavigator
  component: KeyNavigatorMixin

  // TODO Parent/children are not supported.
  parent: LocalKeyNavigator | null = null
  children: LocalKeyNavigator[] = []

  constructor (keyNavigator: KeyNavigator, component: KeyNavigatorMixin) {
    this.globalKeyNavigator = keyNavigator
    this.component = component
  }

  get isFocused (): boolean {
    return this.globalKeyNavigator.isFocused(this)
  }

  get position (): Position {
    const el = this.component.$el
    let rect = el.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
}
