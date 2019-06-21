import { VueKeyNavigatorPluginOptions } from './plugin'

import { Vue } from 'vue/types/vue'

export enum NavigationServiceDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  Enter = 'enter',
  Back = 'back',
}

export class KeyNavigator {
  options: VueKeyNavigatorPluginOptions
  registeredComponents: Vue[] = []
  keyCodes: { [key: number]: string } = {}

  constructor (options: VueKeyNavigatorPluginOptions) {
    if (!Array.isArray(options.keyRoutes)) {
      throw new Error('Please provide some key routes.')
    }
    this.options = options

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

  register (component: Vue): void {
    this.registeredComponents.push(component)
  }

  unregister (component: Vue): void {
    this.registeredComponents.filter(registeredComponent => registeredComponent === component)
  }

  registerGlobalKeyEvents () {
    if (this.options.disabled) {
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

          // this.findClosest(this.currentElement, lowerCaseAction, e)
          e.preventDefault()
          break
      }
    })
    document.addEventListener('backbutton', (e: Event) => {
      // this.back(e)
    })
  }
}
