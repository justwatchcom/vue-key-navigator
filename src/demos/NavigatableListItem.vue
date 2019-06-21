<template>
  <div class="NavigatableListItem"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { KeyNavigatorMixin } from '../lib/KeyNavigatorMixin'

@Component({
  mixins: [KeyNavigatorMixin],
})
export default class NavigatableListItem extends Vue implements KeyNavigatorMixin {

}
</script>

<style lang="scss">
.NavigatableListItem {
  display: inline-block;
  margin: 2px;
  height: 50px;
  width: 50px;
  background-color: coral;

  &--focus {
    background-color: #6bffd3;
  }
}
</style>
