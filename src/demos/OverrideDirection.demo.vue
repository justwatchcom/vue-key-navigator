<template>
  <VbDemo>
    <VbCard title="Directions are overriden" width="220px">
      <KeyRouterLink
        :nodePath="[{ name: 'titles' }, { name: 'title', params: { id: 1 }}]"
        v-slot="{ isFocused }"
        :overrideLeft="() => navigateTo(2)"
        :overrideUp="() => navigateTo(3)"
      >
        <NavigatableListItem :focused="isFocused"/>
      </KeyRouterLink>
      <KeyRouterLink
        :nodePath="[{ name: 'titles' }, { name: 'title', params: { id: 2 }}]"
        v-slot="{ isFocused }"
        :overrideRight="() => navigateTo(1)"
        :overrideUp="() => navigateTo(4)"
      >
        <NavigatableListItem :focused="isFocused"/>
      </KeyRouterLink>
      <KeyRouterLink
        :nodePath="[{ name: 'titles' }, { name: 'title', params: { id: 3 }}]"
        v-slot="{ isFocused }"
        :overrideLeft="() => navigateTo(4)"
        :overrideDown="() => navigateTo(1)"
      >
        <NavigatableListItem :focused="isFocused"/>
      </KeyRouterLink>
      <KeyRouterLink
        :nodePath="[{ name: 'titles' }, { name: 'title', params: { id: 4 }}]"
        v-slot="{ isFocused }"
        :overrideRight="() => navigateTo(3)"
        :overrideDown="() => navigateTo(2)"
      >
        <NavigatableListItem :focused="isFocused"/>
      </KeyRouterLink>
    </VbCard>
  </VbDemo>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavigatableListItem from './NavigatableListItem.vue'
import KeyNavigatorInfo from '../lib/KeyRouterrInfo.vue'

@Component({
  components: { KeyNavigatorInfo, NavigatableListItem },
})
export default class OverrideDirectionDemo extends Vue {
  created () {
    this.$keyRouter.push([{ name: 'titles' }, {
      name: 'title',
      params: { id: 1 },
    }])
  }

  navigateTo (id: number): void {
    this.$keyRouter.push([{ name: 'titles' }, {
      name: 'title',
      params: { id },
    }])
  }
}
</script>

<style lang="scss" scoped>

</style>
