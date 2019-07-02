<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Mixins } from 'vue-mixin-decorator'
import { KeyRouterMixin } from '../lib/KeyRouterMixin'
import { NodePathItem } from '../lib/KeyRouter'

@Component({})
export default class KeyRouterLink extends Mixins<KeyRouterMixin>(KeyRouterMixin) {
  render () {
    if (!(this && this.$scopedSlots && this.$scopedSlots.default)) {
      throw new Error('key-router-link is meant to be used with a slot. So please add one.')
    }

    return this.$scopedSlots.default({
      disabled: this.disabled,
      isFocused: this.isFocused,
    })
  }

  @Prop() route!: NodePathItem[]
  nodePath: NodePathItem[] = this.route

  @Prop({type: Boolean, default: false}) disabled!: boolean

  @Watch('isFocused', { immediate: true })
  onFocused (isFocused: boolean): void {
    // This is used for 2 way data binding to style component etc.
    this.$emit('update:focused', isFocused)

    // Means watcher doesn't trigger on created.
    if (this.$el && isFocused) {
      // This is meant to be used as event. F.e. for scrolls.
      this.$emit('focus', isFocused)
    }
  }

  get isFocused (): boolean {
    return this.$componentKeyRouter.isCurrentRoute()
  }
}
</script>
