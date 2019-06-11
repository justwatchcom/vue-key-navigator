import { FocusElement, Position, navigationService } from './focus.directive'
import { Tree } from './tree'

export enum NavigationServiceDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  Enter = 'enter',
  Back = 'back',
}

interface RelativePosition {
  direction: NavigationServiceDirection;
  distance: number;
  focusElement?: FocusElement;
}

export interface NavigationServiceOptions {
  backHandler?: (e: Event) => boolean;
}

interface FullTree {
  tree: Tree<FocusElement>;
  focusElement: FocusElement | undefined;
}

export class NavigationService {
  keyCodes: { [key: number]: string } = {}
  trees: FullTree[] = []
  moveSound: HTMLAudioElement
  clickSound: HTMLAudioElement
  private enable: boolean = true
  isNavigating: boolean = true

  backHandler?: (e: Event) => boolean

  constructor (options?: NavigationServiceOptions) {
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

    this.moveSound = new Audio('/sound/move.wav')
    this.clickSound = new Audio('/sound/click.wav')

    if (options) {
      this.backHandler = options.backHandler
    }

    this.push()
    this.setupKeyBoardEvents()
  }

  set navigating (b: boolean) {
    this.isNavigating = b
  }

  push () {
    this.tree = new Tree<FocusElement>()
  }

  pop () {
    this.trees.pop()
  }

  set tree (t: Tree<FocusElement>) {
    this.trees.push({ tree: t, focusElement: undefined })
  }

  get tree (): Tree<FocusElement> {
    return this.trees[this.trees.length - 1].tree
  }

  set currentElement (e: FocusElement | undefined) {
    this.trees[this.trees.length - 1].focusElement = e
  }

  get currentElement () {
    return this.trees[this.trees.length - 1].focusElement
  }

  moveFocus (id: string) {
    const n = this.tree.search((p: FocusElement): boolean => p.id === id)
    if (n.length === 0 || n[0] === this.currentElement) {
      return
    }

    if (this.currentElement) {
      this.tree.ascendParents(
        this.currentElement,
        (p: FocusElement): boolean => {
          p.focus(false, undefined)
          return false
        },
      )
    }

    this.tree.ascendParents(
      n[0],
      (p: FocusElement): boolean => {
        p.focus(true, undefined)
        return false
      },
    )
  }

  registerFocusElement (focusElement: FocusElement) {
    if (this.tree.add(focusElement)) {
      this.currentElement = focusElement
    }
    this.cleanTree()
  }

  getSelection (): string | undefined {
    if (!this.currentElement) {
      return undefined
    }

    return this.currentElement.getCSSPath()
  }

  restorePosition (s: string) {
    const originalSelectedElement = document.querySelector(s)
    if (!originalSelectedElement) {
      return
    }

    const elements = this.tree.search((el: FocusElement): boolean => el.$el.id === originalSelectedElement.id)

    if (elements.length === 0) {
      return
    }

    if (this.currentElement === elements[0]) {
      elements[0].focus(true, undefined)
      return
    }

    const curr = this.currentElement
    if (curr) {
      this.tree
        .search((el: FocusElement): boolean => el.id === curr.id)
        .forEach((el: FocusElement) => el.focus(false, undefined))
    }

    this.currentElement = elements[0]
    this.tree
      .search((el: FocusElement): boolean => el.id === elements[0].id)
      .forEach((el: FocusElement) => {
        this.tree.getSiblings(el).forEach((sibling: FocusElement) => {
          sibling.selected = false
          sibling.focus(false, undefined)
        })
        el.selected = true
        el.focus(true, undefined, true, true)
      })
  }

  deRegisterFocusElement (id: string) {
    this.tree.removeElement(
      (el: FocusElement): boolean => {
        if (el.id === id) {
          el.destroy()
          return false
        }
        return true
      },
    )
  }

  cleanTree () {
    if (!this.isNavigating && this.currentElement && this.currentElement.$el) {
      return
    }

    this.tree.all<boolean>(
      (children: FocusElement[], index: number, hasChildren: boolean, param: boolean): boolean => {
        const p = children[index]

        if (p.isDefault) {
          if (param) {
            if (
              children.filter((child: FocusElement, i: number): boolean => child.isFocus && i !== index)
                .length === 0
            ) {
              if (!p.isFocus) {
                p.focus(true, undefined)
                p.clean()
              }
              if (!hasChildren) {
                this.currentElement = p
              }
            }
          } else {
            if (
              children.filter(
                (child: FocusElement, i: number): boolean =>
                  (child.selected || child.isDefault) && i !== index,
              ).length === 0
            ) {
              p.selected = true
            }
          }
        }

        p.clean()

        return p.isDefault && param
      },
      true,
    )
  }

  toggleNavigation (enable: boolean): void {
    this.enable = enable
  }

  setupKeyBoardEvents () {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.enable) {
        return
      }

      const keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which
      let keyName = this.keyCodes[keyCode]
      if (!keyName || !(keyName in NavigationServiceDirection)) {
        return
      }

      let lowerCaseAction = <NavigationServiceDirection>keyName.toLowerCase()
      if (!this.currentElement) {
        console.warn('no current element')
        return
      }

      switch (lowerCaseAction) {
        case NavigationServiceDirection.Enter:
          let el = this.currentElement
          if (el) {
            this.clickSound.play()
            el.enter(e)
          }
          e.preventDefault()
          break
        case NavigationServiceDirection.Back:
          this.back(e)
          break
        default:
          if (!this.enable) {
            return true
          }
          if (this.preventNavigation(e, lowerCaseAction)) {
            return
          }

          navigationService.navigating = false

          if (!this.currentElement.$el) {
            this.cleanTree() // in case the current element gets destroyed
          }

          this.moveSound.play()
          console.log(this.findClosest(this.currentElement, lowerCaseAction, e))
          e.preventDefault()
      }
    })
    document.addEventListener('backbutton', (e: Event) => {
      if (!this.enable) {
        return
      }

      this.back(e)
    }) // if you write `this.back` instead of `(e: Event) => this.back(e)`, `this` will not be navigationService, but document
  }

  back (event: Event): void {
    if (this.currentElement) {
      const element = this.tree.ascendParents(
        this.currentElement,
        (e: FocusElement): boolean => e._listeners.escape,
      )
      if (element && element.escape()) {
        return
      }
    }

    if (this.backHandler && this.backHandler(event)) {
      return
    }

    if (!this.currentElement) {
      return
    }

    this.clickSound.play()
    this.goBack(this.currentElement, event)
    event.preventDefault()
  }

  private preventNavigation (e: KeyboardEvent, action: string): boolean {
    const target = e.target as any
    if (!target || !target.nodeName || target.nodeName !== 'INPUT' || target.type !== 'text') {
      return false
    }

    if (this.currentElement && e.target !== this.currentElement.$el) {
      return false
    }

    return (
      (action === NavigationServiceDirection.Left && target.selectionStart > 0) ||
      (action === NavigationServiceDirection.Right && target.selectionEnd < target.value.length)
    )
  }

  private goBack (from: FocusElement, e: Event): boolean {
    if (!from.value) {
      let parent = this.tree.getParent(from)
      if (!parent) {
        return false
      }

      let found = this.goBack(parent, e)
      if (found) {
        from.selected = true
      }
      return found
    }

    let siblings = this.tree.getSiblings(from)
    siblings = siblings.filter((s: FocusElement) => s.value && s.value < from.value)
    if (siblings.length === 0) {
      return false
    }

    siblings.sort((a: FocusElement, b: FocusElement) => b.value - a.value)

    from.focus(false, undefined)
    this.currentElement = siblings[0].focus(true, e)
    return true
  }

  private findClosest (currentElement: FocusElement, action: string, e: KeyboardEvent): FocusElement | undefined {
    let currentElementPosition = currentElement.getPosition()
    let closest: RelativePosition | undefined

    this.tree.getSiblings(currentElement).forEach((el: FocusElement) => {
      let pos = el.getPosition()
      let relPos = this.getRelativePosition(currentElementPosition, pos)
      if (relPos.direction !== action || relPos.distance === 0) {
        return
      }

      if (!closest || closest.distance > relPos.distance) {
        relPos.focusElement = el
        closest = relPos
      }
    })

    if (closest && closest.focusElement) {
      currentElement.focus(false, undefined)

      this.currentElement = closest.focusElement.focus(true, e)
      return this.currentElement
    }

    let parent = this.tree.getParent(currentElement)
    if (parent) {
      let found = this.findClosest(parent, action, e)
      if (found) {
        currentElement.selected = true
      }
      return found
    }
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
}
