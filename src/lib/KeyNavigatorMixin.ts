import Vue from 'vue'
import { Mixin } from 'vue-mixin-decorator'
import { LocalKeyNavigator } from './LocalKeyNavigator'
import { CurrentKeyRoute } from './KeyNavigator'

@Mixin
export class KeyNavigatorMixin extends Vue {
  $keyNavigatorLocal!: LocalKeyNavigator

  created () {
    if (!this.$keyNavigatorGlobal) {
      throw new Error('vue-key-navigator plugin is not installed')
    }

    this.$keyNavigatorLocal = this.$keyNavigatorGlobal.register(this)
  }

  beforeDestroy (): void {
    this.$keyNavigatorGlobal.unregister(this.$keyNavigatorLocal)
  }

  onKeyFocus (): void {
    console.log('onKeyFocus')
  }

  // TODO Should be done in a way so that component has to define this only once.
  checkRoute (currentKeyRoutes: CurrentKeyRoute[], currentKeyRoute: CurrentKeyRoute): boolean {
    throw new Error('Please define checkRoute method for current key navigatable component.')
  }
  // TODO Should be done in a way so that component has to define this only once.
  selectRoute (currentKeyRoutes: CurrentKeyRoute[], currentKeyRoute: CurrentKeyRoute): CurrentKeyRoute[] {
    throw new Error('Please define selectRoute method for current key navigatable component.')
  }
}
