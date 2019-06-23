import { VueKeyNavigatorPluginOptions, KeyRoute } from './plugin'
import { LocalKeyNavigator } from './LocalKeyNavigator'
import { KeyNavigatorMixin } from './KeyNavigatorMixin'

export enum NavigationServiceDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  Enter = 'enter',
  Back = 'back',
}

export interface CurrentKeyRoute {
  name: string
  params: { [key: string]: any }
}

interface RelativePosition {
  direction: NavigationServiceDirection
  distance: number
}

export interface Position {
  x: number
  y: number
}

export class KeyNavigator {
  disabled: boolean = false
  keyRoutes?: KeyRoute[]
  registeredLocalKeyNavigators: LocalKeyNavigator[] = []
  keyCodes: { [key: number]: string } = {}
  currentKeyRoutes: CurrentKeyRoute[] = []

  constructor (options: VueKeyNavigatorPluginOptions) {
    if (options.disabled) {
      this.disabled = options.disabled
    }

    if (!Array.isArray(options.keyRoutes)) {
      throw new Error('Please provide some key routes.')
    }
    this.keyRoutes = options.keyRoutes

    if (options.currentKeyRoutes) {
      this.currentKeyRoutes = options.currentKeyRoutes
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

  register (component: KeyNavigatorMixin): LocalKeyNavigator {
    const localKeyNavigator = new LocalKeyNavigator(this, component)
    this.registeredLocalKeyNavigators.push(localKeyNavigator)
    return localKeyNavigator
  }

  unregister (localKeyNavigator: LocalKeyNavigator): void {
    this.registeredLocalKeyNavigators = this.registeredLocalKeyNavigators.filter(registeredLocalKeyNavigator => registeredLocalKeyNavigator !== localKeyNavigator)
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
          // let el = this.currentElement
          // if (el) {
          //   this.onSelect()
          // el.enter(e)
          // }
          e.preventDefault()
          break
        case NavigationServiceDirection.Back:
          // this.back(e)
          break
        default:
          // if (this.preventNavigation(e, lowerCaseAction)) {
          //   return
          // }
          const localKeyNavigator = this.findClosest(this.focusedLocalKeyNavigator, lowerCaseAction)
          if (localKeyNavigator) {
            this.focusOnLocalKeyNavigator(localKeyNavigator)
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

  focusOnLocalKeyNavigator (localKeyNavigator: LocalKeyNavigator) {
    this.currentKeyRoutes = localKeyNavigator.component.selectRoute(this.currentKeyRoutes, this.currentKeyRoutes[this.currentKeyRoutes.length - 1])
  }

  findClosest (
    currentLocalKeyNavigator: LocalKeyNavigator,
    navigationServiceDirection: NavigationServiceDirection,
  ): LocalKeyNavigator | null {
    let currentElementPosition = currentLocalKeyNavigator.position

    let closestLocalKeyNavigator: LocalKeyNavigator | null = null
    let closestDistance = Infinity
    this.registeredLocalKeyNavigators.forEach(localKeyNavigator => {
      if (currentLocalKeyNavigator === localKeyNavigator) {
        return
      }
      const position = localKeyNavigator.position
      if (!this.isInDirection(currentElementPosition, position, navigationServiceDirection)) {
        return
      }
      const distance = this.getDistance(currentElementPosition, position)
      if (distance < closestDistance) {
        closestLocalKeyNavigator = localKeyNavigator
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

  private getRelativePosition (base: Position, satellite: Position): RelativePosition {
    let abs = { x: satellite.x - base.x, y: satellite.y - base.y }
    let horizontal = Math.abs(abs.x) - Math.abs(abs.y) >= 0
    let direction: NavigationServiceDirection
    if (horizontal) {
      if (abs.x < 0) {
        direction = NavigationServiceDirection.Left
      } else {
        direction = NavigationServiceDirection.Right
      }
    } else {
      if (abs.y < 0) {
        direction = NavigationServiceDirection.Up
      } else {
        direction = NavigationServiceDirection.Down
      }
    }

    return { direction, distance: Math.sqrt(abs.x * abs.x + abs.y * abs.y) }
  }

  get focusedLocalKeyNavigator (): LocalKeyNavigator {
    const focusedLocalKeyNavigator = this.registeredLocalKeyNavigators.find(this.isFocused.bind(this))
    if (!focusedLocalKeyNavigator) {
      throw new Error('No focused key navigator found')
    }
    return focusedLocalKeyNavigator
  }

  isFocused (localKeyNavigator: LocalKeyNavigator): boolean {
    return localKeyNavigator.component.checkRoute(this.currentKeyRoutes, this.currentKeyRoutes[this.currentKeyRoutes.length - 1])
  }
}
