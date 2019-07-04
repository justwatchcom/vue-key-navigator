import Vue from 'vue'
import { Mixin } from 'vue-mixin-decorator'
import { Prop } from 'vue-property-decorator'

import { ComponentKeyRouter } from './ComponentKeyRouter'
import { NodePathItem } from './KeyRouter'

export type DirectionOverride = (() => void) | null

// NOTE We probably don't need this mixin and instead should use component.
// The reason being component doesn't pollute dom (no wrapper).
// Upside of using mixin is that it provides an interface between component and service,
// so they're not bound too tight.

@Mixin
export class KeyRouterMixin extends Vue {
  $componentKeyRouter!: ComponentKeyRouter

  @Prop({required: true, type: Array}) nodePath!: NodePathItem[]
  @Prop({type: Boolean, default: false}) disabled!: boolean

  @Prop({type: Function}) overrideLeft!: DirectionOverride
  @Prop({type: Function}) overrideRight!: DirectionOverride
  @Prop({type: Function}) overrideUp!: DirectionOverride
  @Prop({type: Function}) overrideDown!: DirectionOverride

  beforeCreate () {
    if (!this.$keyRouter) {
      throw new Error('vue-key-navigator plugin is not installed')
    }

    this.$componentKeyRouter = this.$keyRouter.register(this)
  }

  created () {
    if (!this.nodePath) {
      throw new Error('nodePath is not defined')
    }
  }

  beforeDestroy (): void {
    this.$keyRouter.unregister(this.$componentKeyRouter)
  }

  onKeyFocus (): void {
    console.log('onKeyFocus')
  }
}
