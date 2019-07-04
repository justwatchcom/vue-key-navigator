<template>
  <div
    class="NavigatableListItem"
    :class="{'NavigatableListItem--focus': focused}"
    :disabled="disabled"
  >
    Focused: {{ focused }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import KeyRouterLink from './KeyRouterLink.vue'

@Component({
  components: { KeyRouterLink },
})
export default class NavigatableListItem extends Vue {
  @Prop() focused!: boolean
  @Prop() disabled!: boolean
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

  border: 2px solid transparent;
  &[disabled] {
    border: 2px dashed #9f7a77;
  }
}
</style>
