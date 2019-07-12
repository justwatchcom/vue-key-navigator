<template>
  <VbDemo>
    <VbCard title="titles -> popular -> title id" width="220px">
      <button style="flex: 1 0 100%;" @click="$keyRouter.disabled = !$keyRouter.disabled">{{ $keyRouter.disabled ? 'Enable' : 'Disable' }}</button>
      <div>
        <KeyRouterLink
          v-for="n in count"
          :key="n"
          :nodePath="[{ name: 'titles' }, { name: 'popular' }, { name: 'title', params: { id: n }}]"
          v-slot="{ isFocused }"
        >
          <NavigatableListItem :focused="isFocused"/>
        </KeyRouterLink>
      </div>
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
export default class NavigationDemo extends Vue {
  count = 4

  created () {
    this.$keyRouter.push([
      { name: 'titles' },
      { name: 'popular' },
      { name: 'title', params: { id: 1 } },
    ])
  }

  beforeDestroy () {
    this.$keyRouter.disabled = false
  }
}
</script>

<style lang="scss" scoped>

</style>
