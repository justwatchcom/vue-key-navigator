import { KeyRouterPluginOptions, KeyRouterNode } from './plugin'
import { ComponentKeyRouter } from './ComponentKeyRouter'
import { KeyRouterMixin } from './KeyRouterMixin'
import { isSameRoot } from './key-router-helpers'
import { findClosestCorner } from './container-classes/container-helpers'
import PositionedRectangle from './container-classes/PositionedRectangle'
import Point from './container-classes/Point'

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
          this.focusedComponentKeyRouter.triggerSelect()
          e.preventDefault()
          break
        case NavigationServiceDirection.Back:
          // this.back(e)
          break
        default:
          // We can register overrides for specific direction in component.
          // When that's the case KeyRouter doesn't perform any actions.
          const directionOverride = this.focusedComponentKeyRouter.getOverrideForDirection(lowerCaseAction)
          if (directionOverride) {
            directionOverride()
            e.preventDefault()
            break
          }

          const componentKeyRouter = this.findClosest(this.focusedComponentKeyRouter, lowerCaseAction)
          if (componentKeyRouter) {
            componentKeyRouter.selectRoute()
          }

          e.preventDefault()
          break
      }
    })
  }

  findClosest (
    currentComponentKeyRouter: ComponentKeyRouter,
    direction: Direction,
  ): ComponentKeyRouter | null {
    const currentElementClientRect: ClientRect = currentComponentKeyRouter.getClientRect()
    const currentElementCenterPoint: Point = PositionedRectangle.createFromDomRectangle(currentElementClientRect).getCenter()

    let closestComponentKeyRouter: ComponentKeyRouter | null = null
    let closestDistanceInMainDirection = Infinity
    let closestDistanceInSecondaryDirection = Infinity

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
      // TODO Might make sense to filter out definitely wrong options to save some CPU cycles.
      // const position = componentKeyRouter.position
      // if (!this.isInDirection(currentElementClientRect, position, navigationServiceDirection)) {
      //   return
      // }

      // Find distance to closest corner
      // TODO Extract to function and do some test coverage.
      const closestCorner = findClosestCorner(currentElementClientRect, componentKeyRouter.getClientRect())

      const distanceX = closestCorner.x - currentElementCenterPoint.x
      const distanceY = closestCorner.y - currentElementCenterPoint.y
      const isHorizontal = [Direction.Left, Direction.Right].includes(direction)
      const isPositive = [Direction.Right, Direction.Down].includes(direction)

      let result = [distanceX, distanceY]
      if (!isHorizontal) {
        result = result.reverse()
      }
      if (!isPositive) {
        result = result.map(a => -a)
      }
      let [distanceInMainDirection, distanceInSecondaryDirection] = result


      // We don't care if secondary direction is positive or negative
      distanceInSecondaryDirection = Math.abs(distanceInSecondaryDirection)

      if (distanceInMainDirection <= 0 ) {
        return
      }

      // console.log('[distanceInMainDirection, distanceInSecondaryDirection]', [Math.round(distanceInMainDirection), Math.round(distanceInSecondaryDirection)])

      if (distanceInSecondaryDirection < closestDistanceInSecondaryDirection) {
        closestDistanceInSecondaryDirection = distanceInSecondaryDirection
        closestComponentKeyRouter = componentKeyRouter
        return
      }
      if (distanceInSecondaryDirection === closestDistanceInSecondaryDirection) {
        if (distanceInMainDirection < closestDistanceInMainDirection) {
          closestDistanceInMainDirection = distanceInMainDirection
          closestComponentKeyRouter = componentKeyRouter
          return
        }
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
