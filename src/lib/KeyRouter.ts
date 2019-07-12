import { ComponentKeyRouter } from './ComponentKeyRouter'
import { KeyRouterMixin } from './KeyRouterMixin'
import { isSameRoot } from './key-router-helpers'
import {
  isStraightInDirection,
  getDistance,
  isInDirection,
} from './container-classes/container-helpers'
import { NodePathItem, KeyRouterOptions } from './interfaces'

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export enum NavigationServiceDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  Enter = 'enter',
  Back = 'back',
}

export class KeyRouter {
  public disabled: boolean = false
  private isInTransition = false
  componentKeyRouters: ComponentKeyRouter[] = []
  keyCodes: { [key: number]: string } = {}
  nodePath: NodePathItem[] = []
  transitionTimeout: number = 100

  constructor (options: KeyRouterOptions) {
    if (options.disabled) {
      this.disabled = options.disabled
    }
    if (options.nodePath) {
      this.nodePath = options.nodePath
    }
    if (options.transitionTimeout !== undefined) {
      this.transitionTimeout = options.transitionTimeout
    }

    const keys: { [name: string]: number[] } = {
      up: [38],
      down: [40],
      left: [37],
      right: [39],
      enter: [13, 179, 85],
      back: [27],
    }

    for (let keyName in NavigationServiceDirection) {
      keys[NavigationServiceDirection[keyName]].forEach((code: number) => (this.keyCodes[code] = keyName))
    }

    this.registerGlobalKeyEvents()
  }

  push (nodePath: NodePathItem[]): void {
    this.nodePath = nodePath
  }

  register (component: KeyRouterMixin): ComponentKeyRouter {
    const componentKeyRouter = new ComponentKeyRouter(this, component)
    this.componentKeyRouters.push(componentKeyRouter)
    return componentKeyRouter
  }

  unregister (localKeyNavigator: ComponentKeyRouter): void {
    this.componentKeyRouters = this.componentKeyRouters.filter(registeredComponentKeyRouter => registeredComponentKeyRouter !== localKeyNavigator)
  }

  registerGlobalKeyEvents () {

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.disabled) {
        return
      }

      const keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which
      let keyName = this.keyCodes[keyCode]
      if (!keyName || !(keyName in NavigationServiceDirection || keyName in Direction)) {
        return
      }

      let lowerCaseAction = <NavigationServiceDirection | Direction>keyName.toLowerCase()

      if (lowerCaseAction === NavigationServiceDirection.Enter) {
        this.focusedComponentKeyRouter.triggerSelect()
        e.preventDefault()
        return
      }

      if (lowerCaseAction === NavigationServiceDirection.Back) {
        // this.back(e)
        return
      }

      this.onDirectionTriggered(lowerCaseAction as Direction)
      e.preventDefault()
    })
  }

  onDirectionTriggered (direction: Direction): void {
    if (this.isInTransition) {
      return
    }

    // We can register overrides for specific direction in component.
    // When that's the case KeyRouter doesn't perform any actions.
    const directionOverride = this.focusedComponentKeyRouter.getOverrideForDirection(direction)
    if (directionOverride) {
      directionOverride()
      return
    }

    const componentKeyRouter = this.findClosest(this.focusedComponentKeyRouter, direction)
    if (componentKeyRouter) {
      componentKeyRouter.selectRoute()
      this.onInTransition()
    }
  }

  // The idea here is to disable directional navigation for time span of transition.
  onInTransition (): void {
    if (this.transitionTimeout) {
      this.isInTransition = true
      setTimeout(() => {
        this.isInTransition = false
      }, this.transitionTimeout)
    }
  }

  findClosest (
    currentComponentKeyRouter: ComponentKeyRouter,
    direction: Direction,
  ): ComponentKeyRouter | null {
    const currentElementClientRect: ClientRect = currentComponentKeyRouter.getClientRect()

    let closestComponentisStraightInDirection = false
    let closestComponentKeyRouter: ComponentKeyRouter | null = null
    let closestDistance = Infinity

    this.componentKeyRouters.forEach(componentKeyRouter => {
      // Ignore current component.
      if (currentComponentKeyRouter === componentKeyRouter) {
        return
      }
      // Ignore disabled components.
      if (componentKeyRouter.component.disabled) {
        return
      }
      // Ignore components from different roots.
      if (!isSameRoot(currentComponentKeyRouter.nodePath, componentKeyRouter.nodePath)) {
        return
      }

      const componentClientRect = componentKeyRouter.getClientRect()

      // Ignore components in other directions.
      if (!isInDirection(currentElementClientRect, componentClientRect, direction)) {
        return
      }

      const componentIsStraightInDirection = isStraightInDirection(currentElementClientRect, componentClientRect, direction)
      if (componentIsStraightInDirection) {
        // First component is straight in direction
        if (!closestComponentisStraightInDirection) {
          closestComponentisStraightInDirection = true
          closestComponentKeyRouter = componentKeyRouter
          closestDistance = getDistance(currentElementClientRect, componentClientRect)
          return
        }
        // Second straight in direction component
        const distance = getDistance(currentElementClientRect, componentClientRect)
        if (closestDistance > distance) {
          closestDistance = distance
          closestComponentKeyRouter = componentKeyRouter
        }
        return
      } else if (closestComponentisStraightInDirection) {
        return
      }

      const distance = getDistance(currentElementClientRect, componentClientRect)
      if (closestDistance > distance) {
        closestDistance = distance
        closestComponentKeyRouter = componentKeyRouter
      }
    })
    return closestComponentKeyRouter
  }

  get focusedComponentKeyRouter (): ComponentKeyRouter {
    const focusedLocalKeyNavigator = this.componentKeyRouters.find(componentKeyRouter => componentKeyRouter.isCurrentRoute())
    if (!focusedLocalKeyNavigator) {
      throw new Error('No focused key navigator found')
    }
    return focusedLocalKeyNavigator
  }
}
