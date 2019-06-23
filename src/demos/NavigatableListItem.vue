<template>
  <div
    class="NavigatableListItem"
    :class="{'NavigatableListItem--focus': keyNavigatorFocused}"
  >
    Focus: {{keyNavigatorFocused}}
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { KeyNavigatorMixin } from '../lib/KeyNavigatorMixin'
import { Mixins } from 'vue-mixin-decorator'
import { CurrentKeyRoute } from '../lib/KeyNavigator'

@Component({})
export default class NavigatableListItem extends Mixins<KeyNavigatorMixin>(KeyNavigatorMixin) {
  @Prop(Number) id!: number

  get keyNavigatorFocused (): boolean {
    return this.$keyNavigatorLocal.isFocused
  }

  // TODO Following 2 methods should be replaced with one declaration.
  checkRoute (currentKeyRoutes: CurrentKeyRoute[], currentKeyRoute: CurrentKeyRoute): boolean {
    return currentKeyRoute.name === 'title' && currentKeyRoute.params.id === this.id
  }

  selectRoute (currentKeyRoutes: CurrentKeyRoute[], currentKeyRoute: CurrentKeyRoute): CurrentKeyRoute[] {
    return [
      { name: 'title', params: { id: this.id } },
    ]
  }
}
</script>

<style lang="scss">
.NavigatableListItem {
  display: inline-block;
  margin: 2px;
  height: 100px;
  width: 100px;
  background-color: #FF7F50;
  color: white;

  &--focus {
    /*color: #9EE749;*/
    background-color: #3C72A6;
  }
}
</style>
