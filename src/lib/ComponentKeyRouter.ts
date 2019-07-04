import {
  KeyRouter,
  Position,
  NodePathItem,
  NavigationServiceDirection,
} from './KeyRouter'
import { KeyRouterMixin, DirectionOverride } from './KeyRouterMixin'
import { isCurrentRoute } from './key-router-helpers'

export class ComponentKeyRouter {
  globalKeyNavigator: KeyRouter
  component: KeyRouterMixin

  constructor (keyNavigator: KeyRouter, component: KeyRouterMixin) {
    this.globalKeyNavigator = keyNavigator
    this.component = component
  }

  get position (): Position {
    const el = this.component.$el
    let rect = el.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }

  isCurrentRoute (): boolean {
    return isCurrentRoute(this.globalKeyNavigator.nodePath, this.component.nodePath)
  }

  selectRoute (): void {
    // TODO Probably would make more sense to clone routes as well.
    // Or maybe not, given we do not really expect them to change.
    this.globalKeyNavigator.nodePath = [...this.component.nodePath]
  }

  getOverrideForDirection (direction: NavigationServiceDirection): DirectionOverride {
    if (direction === NavigationServiceDirection.Left) {
      return this.component.overrideLeft
    }
    if (direction === NavigationServiceDirection.Right) {
      return this.component.overrideRight
    }
    if (direction === NavigationServiceDirection.Up) {
      return this.component.overrideUp
    }
    if (direction === NavigationServiceDirection.Down) {
      return this.component.overrideDown
    }
    throw new Error(`Unknown direction: ${direction}`)
  }

  triggerSelect (): void {
    this.component.$emit('select')
  }

  get nodePath (): NodePathItem[] {
    return this.component.nodePath
  }
}
