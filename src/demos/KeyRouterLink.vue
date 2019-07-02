<template>
  <div class="KeyRouterLink" :disabled="disabled">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Mixins } from 'vue-mixin-decorator'
import { KeyRouterMixin } from '../lib/KeyRouterMixin'
import { NodePathItem } from '../lib/KeyRouter'

@Component({})
export default class KeyRouterLink extends Mixins<KeyRouterMixin>(KeyRouterMixin) {
  @Prop() route!: NodePathItem[]
  nodePath: NodePathItem[] = this.route

  @Watch('isFocused', { immediate: true })
  onFocused (isFocused: boolean): void {
    // This is used for 2 way data binding to style component etc.
    this.$emit('update:focused', isFocused)

    // Means watcher didn't trigger on created.
    if (this.$el) {
      // This is meant to be used as event. F.i. for scrolls.
      this.$emit('focus', isFocused)
    }
  }



  get isFocused (): boolean {
    return this.$componentKeyRouter.isCurrentRoute()
  }
}
</script>
