<template>
  <KeyRouterLink
    class="NavigatableListItem"
    :class="{'NavigatableListItem--focus': focused}"
    :route="keyRouteProp"
    :focused.sync="focused"
  >
    Focus: {{focused}}
  </KeyRouterLink>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NodePathItem } from '../lib/KeyRouter'
import KeyRouterLink from './KeyRouterLink.vue'

@Component({
  components: { KeyRouterLink },
})
export default class NavigatableListItem extends Vue {
  @Prop() keyRouteProp!: NodePathItem[]
  focused: boolean = false
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
