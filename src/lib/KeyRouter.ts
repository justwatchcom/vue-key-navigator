import { KeyRouterPluginOptions, KeyRouterNode } from './plugin'
import { ComponentKeyRouter } from './ComponentKeyRouter'
import { KeyRouterMixin } from './KeyRouterMixin'
import { isSameRoot } from './key-router-helpers'

export enum NavigationServiceDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  Enter = 'enter',
  Back = 'back',
}

export interface NodePathItem {
  name: string
  params?: { [key: string]: any }
}

export interface Position {
  x: number
  y: number
}

export class KeyRouter {
  disabled: boolean = false
  keyRoutes?: KeyRouterNode[]
  componentKeyRouters: ComponentKeyRouter[] = []
  keyCodes: { [key: number]: string } = {}
  nodePath: NodePathItem[] = []

  constructor (options: KeyRouterPluginOptions) {
    if (options.disabled) {
      this.disabled = options.disabled
    }
    if (!Array.isArray(options.keyRouterNodes)) {
      throw new Error('Please provide some key routes.')
    }
    this.keyRoutes = options.keyRouterNodes

    if (options.nodePath) {
      this.nodePath = options.nodePath
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

  register (component: KeyRouterMixin): ComponentKeyRouter {
    const componentKeyRouter = new ComponentKeyRouter(this, component)
    this.componentKeyRouters.push(componentKeyRouter)
    return componentKeyRouter
  }

  unregister (localKeyNavigator: ComponentKeyRouter): void {
    this.componentKeyRouters = this.componentKeyRouters.filter(registeredComponentKeyRouter => registeredComponentKeyRouter !== localKeyNavigator)
  }

  registerGlobalKeyEvents () {
    if (this.disabled) {
      return
    }
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      const keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which
      let keyName = this.keyCodes[keyCode]
      if (!keyName || !(keyName in NavigationServiceDirection)) {
        return
      }

      let lowerCaseAction = <NavigationServiceDirection>keyName.toLowerCase()

      switch (lowerCaseAction) {
        case NavigationServiceDirection.Enter:
          this.focusedComponentKeyRouter.component.$emit('select')
          e.preventDefault()
          break
        case NavigationServiceDirection.Back:
          // this.back(e)
          break
        default:
          const componentKeyRouter = this.findClosest(this.focusedComponentKeyRouter, lowerCaseAction)
          if (componentKeyRouter) {
            componentKeyRouter.selectRoute()
          }

          // this.findClosest(this.currentElement, lowerCaseAction, e)
          e.preventDefault()
          break
      }
    })
    document.addEventListener('backbutton', (e: Event) => {
      // this.back(e)
    })
  }

  findClosest (
    currentComponentKeyRouter: ComponentKeyRouter,
    navigationServiceDirection: NavigationServiceDirection,
  ): ComponentKeyRouter | null {
    let currentElementPosition = currentComponentKeyRouter.position

    let closestLocalKeyNavigator: ComponentKeyRouter | null = null
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
      // Ignore components in other directions.
      const position = componentKeyRouter.position
      if (!this.isInDirection(currentElementPosition, position, navigationServiceDirection)) {
        return
      }
      // Find the closest one
      const distance = this.getDistance(currentElementPosition, position)
      if (distance < closestDistance) {
        closestLocalKeyNavigator = componentKeyRouter
        closestDistance = distance
      }
    })
    return closestLocalKeyNavigator
  }

  private isInDirection (base: Position, satellite: Position, direction: NavigationServiceDirection): boolean {
    let abs = { x: satellite.x - base.x, y: satellite.y - base.y }
    if (direction === NavigationServiceDirection.Left) {
      return abs.x < 0
    }
    if (direction === NavigationServiceDirection.Right) {
      return abs.x > 0
    }
    if (direction === NavigationServiceDirection.Up) {
      return abs.y < 0
    }
    if (direction === NavigationServiceDirection.Down) {
      return abs.y > 0
    }
    return false
  }

  private getDistance (base: Position, satellite: Position): number {
    let abs = { x: satellite.x - base.x, y: satellite.y - base.y }
    return Math.sqrt(abs.x * abs.x + abs.y * abs.y)
  }

  get focusedComponentKeyRouter (): ComponentKeyRouter {
    const focusedLocalKeyNavigator = this.componentKeyRouters.find(componentKeyRouter => componentKeyRouter.isCurrentRoute())
    if (!focusedLocalKeyNavigator) {
      throw new Error('No focused key navigator found')
    }
    return focusedLocalKeyNavigator
  }
}
