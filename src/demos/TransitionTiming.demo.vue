<template>
  <VbDemo>
    <VbCard title="titles -> popular -> title id" width="700px">
      <button @click="$keyRouter.transitionTimeout = 0">0</button>
      <button @click="$keyRouter.transitionTimeout = 200">200</button>
      <button @click="$keyRouter.transitionTimeout = 500">500</button>
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
  count = 6

  created () {
    this.$keyRouter.push([
      { name: 'titles' },
      { name: 'popular' },
      { name: 'title', params: { id: 1 } },
    ])
  }

  beforeDestroy () {
    this.$keyRouter.transitionTimeout = 200
  }
}
</script>

<style lang="scss" scoped>

</style>
