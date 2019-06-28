<template>
  <div class="KeyRouterLink">
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
    this.$emit('update:focused', isFocused)
  }

  get isFocused (): boolean {
    return this.$componentKeyRouter.isCurrentRoute()
  }
}
</script>

<style lang="scss">
.KeyRouterLink {

}
</style>
