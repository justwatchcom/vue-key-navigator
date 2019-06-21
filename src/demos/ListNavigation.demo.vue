<template>
  <VbDemo>
    <VbCard title="Single level navigation">
      <NavigatableListItem/>
      <NavigatableListItem/>
      <NavigatableListItem/>
      <NavigatableListItem/>
      <NavigatableListItem/>
    </VbCard>
  </VbDemo>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavigatableListItem from './NavigatableListItem.vue'

@Component({
  components: { NavigatableListItem },
})
export default class NavigationDemo extends Vue {

}
</script>

<style lang="scss" scoped>
.item {
  padding: 5px;
  &.focus {
    background-color: #c7eeff;
  }
}
</style>
