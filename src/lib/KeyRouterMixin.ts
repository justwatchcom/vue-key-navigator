import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { Mixin } from 'vue-mixin-decorator'
import { ComponentKeyRouter } from './ComponentKeyRouter'
import { NodePathItem } from './KeyRouter'

@Mixin
export class KeyRouterMixin extends Vue {
  $componentKeyRouter!: ComponentKeyRouter
  nodePath!: NodePathItem[]

  @Prop({type: Boolean, default: false}) disabled!: boolean

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
