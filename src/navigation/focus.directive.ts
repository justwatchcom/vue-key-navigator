import { NavigationService } from './navigation.service'
import { Payload } from './tree'
import { VNode } from 'vue'

interface VNodeFocusListener {
  focus: boolean;
  blur: boolean;
  click: boolean;
  escape: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface FocusEvent {
  event: Event;
  element: Element;
}

export let navigationService: NavigationService

export class FocusElement implements Payload {
  private _$el: any
  _listeners: VNodeFocusListener = {
    focus: false,
    blur: false,
    click: false,
    escape: false,
  }

  id: string
  isFocus = false
  private isSelected = false
  getIsDefault: () => boolean = (): boolean => false
  vnode: VNode
  value: number
  mutationObserver: MutationObserver

  constructor (vnode: VNode, params?: { order?: number; isDefault?: () => boolean }) {
    if (!vnode || !vnode.elm) {
      throw 'vnode or elm not defined'
    }

    this.vnode = vnode
    let elm = <any>vnode.elm

    if (!elm.id) {
      elm.id =
        'focus-el-' +
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 10)
    }

    this.id = elm.id
    const def = elm.dataset.default
    this.getIsDefault = (): boolean => def === '' || def === 'true'

    // do not cache the listener logic to prevent memory leaks
    // instead cache the existance of a specific listener in the directive
    if (vnode.componentOptions && vnode.componentOptions.listeners) {
      let listeners = <any>vnode.componentOptions.listeners
      this._listeners = {
        focus: !!listeners.focus,
        blur: !!listeners.blur,
        click: !!listeners.click,
        escape: false,
      }
      listeners = undefined
    }

    if (vnode.data && vnode.data.on && vnode.data.on.escape) {
      this._listeners.escape = true
    }

    elm = undefined

    if (params) {
      if (params.order) {
        this.value = params.order
      }

      if (params.isDefault) {
        this.getIsDefault = params.isDefault
      }
    }

    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        console.log(mutation)
      })
    })
    // this.mutationObserver.observe(this.$el, {
    // 	attributes: true,
    // 	attributeOldValue: true,
    // });
  }

  isParentOf (p: FocusElement): boolean {
    return (this.vnode.elm as any).contains(p.$el)
  }

  stringify (): string {
    return `${this.id.padEnd(20)} default: ${this.isDefault}; focus: ${this.isFocus}; selected: ${this.isSelected}`
  }

  destroy () {
    this.mutationObserver.disconnect()
    this.isFocus = false
    this._$el = undefined
    this._listeners = {
      focus: false,
      blur: false,
      click: false,
      escape: false,
    }
  }

  get isDefault (): boolean {
    return this.getIsDefault()
  }

  get $el () {
    if (this._$el) {
      return this._$el
    }

    return (this._$el = document.getElementById(this.id))
  }

  get selected (): boolean {
    return this.isSelected
  }

  set selected (b: boolean) {
    this.removeClass('focus')

    this.isFocus = false
    this.isSelected = b
    if (this.isSelected) {
      this.addClass('selected')
    } else {
      this.removeClass('selected')
    }
  }

  escape (): any {
    if (!this._listeners.escape || !this.vnode.data || !this.vnode.data.on || !this.vnode.data.on.escape) {
      return
    }

    return (this.vnode.data.on.escape as any).fns(this.$el)
  }

  focus (
    b: boolean,
    event: KeyboardEvent | Event | undefined,
    skipChildren?: boolean,
    forceFocus?: boolean,
  ): FocusElement | undefined {
    this.removeClass('selected')
    this.isSelected = false
    this.isFocus = b
    if (!this.isFocus) {
      if (this.$el) {
        this.$el.blur()
      }
      this.removeClass('focus')
      return undefined
    }

    this.addClass('focus')

    let retVal: FocusElement | undefined = this
    if (!skipChildren) {
      let children = navigationService.tree.getChildren(this)
      let found = children.find((child: FocusElement): boolean => child.isFocus)
      if (found) {
        retVal = found.focus(true, event)
      } else {
        found = children.find((child: FocusElement): boolean => child.selected)
        if (found) {
          retVal = found.focus(true, event)
        } else {
          found = children.find((child: FocusElement): boolean => child.isDefault)
          if (found) {
            retVal = found.focus(true, event)
          }
        }
      }
    }

    if (navigationService.isNavigating && !forceFocus) {
      return retVal
    }

    if (this.$el && this._listeners.focus) {
      try {
        this.$el.__vue__.$vnode.componentOptions.listeners.focus({
          event,
          element: this.$el,
        })
      } catch (e) {
      }
    }
    // set 'native' browser focus on input elements and focusable elements.
    if (
      this.$el &&
      (this.$el.tabIndex !== -1 || this.$el.nodeName === 'INPUT' || this.$el.nodeName === 'TEXTAREA')
    ) {
      this.$el.focus({ event, element: this.$el })
    } else if (
      this.vnode.data &&
      this.vnode.data.on &&
      this.vnode.data.on &&
      this.vnode.data.on.focus &&
      (this.vnode.data.on.focus as any).fns
    ) {
      (this.vnode.data.on.focus as any).fns({ event, element: this.$el })
    }

    return retVal
  }

  enter (event: KeyboardEvent) {
    if (this._listeners.click) {
      try {
        this.$el.__vue__.$vnode.componentOptions.listeners.click({
          event,
          element: this.$el,
        })
      } catch (e) {
      }
    } else if (this.vnode.data && this.vnode.data.on && this.vnode.data.on.click) {
      (this.vnode.data.on.click as any)(event)
    }
  }

  clean (): void {
    // console.log('cleaning: %s %s %s', this.id, this.isFocus, this.selected);
    if (this.isFocus) {
      this.addClass('focus')
    } else {
      this.removeClass('focus')
    }

    if (this.selected) {
      this.addClass('selected')
    } else {
      this.removeClass('selected')
    }
  }

  addClass (c: string): void {
    let regex = new RegExp(`(^|\\s)${c}($|\\s)`, '')
    if (this.$el && !this.$el.className.match(regex)) {
      this.$el.className += ' ' + c
      // console.log('adding class %s to %s => %s', c, this.id, this.$el.className, this.$el);
    }
  }

  removeClass (c: string): void {
    if (this.$el) {
      let regex = new RegExp(`(^|\\s)${c}($|\\s)`, '')
      this.$el.className = this.$el.className.replace(regex, '$1$2').trim()
    }
  }

  getCSSPath (): string {
    var path = []
    let el = this.$el
    while (el.nodeType === Node.ELEMENT_NODE) {
      var selector = el.nodeName.toLowerCase()
      var sib = el,
        nth = 1
      while ((sib = sib.previousElementSibling)) {
        if (sib.nodeName.toLowerCase() == selector) {
          nth++
        }
      }
      if (nth != 1) {
        selector += ':nth-of-type(' + nth + ')'
      }
      path.unshift(selector)
      el = el.parentNode
    }

    return path.join(' > ')
  }

  getPosition (): Position {
    const el = this.$el
    let rect = el.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
}

export default {
  install: function <NavigationServiceOptions> (Vue: any, options?: NavigationServiceOptions) {
    //@ts-ignore
    window.navigationService = navigationService = new NavigationService(options)

    if (!IS_FIRETV) {
      Vue.directive('focus', {})
      return
    }

    Vue.directive('focus', {
      inserted: (el: any, { value }: any, vnode: VNode) => {
        navigationService.registerFocusElement(new FocusElement(vnode, value))
      },
      update: (el: any, { value }: any, vnode: VNode) => {
        if (vnode && vnode.elm) {
          const elm = vnode.elm as any
          if (elm.id) {
            const ancestors = navigationService.tree.search((p: FocusElement): boolean => p.id === elm.id)
            if (ancestors.length > 0) {
              ancestors[0].clean()
            }
          }
        }
        navigationService.cleanTree()
      },
      unbind: (el: any, binding: any, vnode: VNode) => {
        if (!vnode.elm) {
          return
        }

        navigationService.deRegisterFocusElement((<HTMLScriptElement>vnode.elm).id)
      },
    })
  },
}
