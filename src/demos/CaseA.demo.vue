<template>
  <VbDemo>
    <VbCard title="Should not select bottom item with right/left keys">
      <button @click="refresh()">Refresh</button>
      <div style="width: 500px; height: 500px; position: relative;">
        <KeyRouterLink
          v-for="item in navigationItemCoordinateList"
          :key="item.id"
          :nodePath="[{ name: 'items' }, { name: 'item', params: { id: item.id }}]"
          v-slot="{ isFocused }"
        >
          <NavigatableListItem
            :style="{
              position: 'absolute',
              width: item.width,
              height: item.height,
              left: item.left,
              top: item.top,
              opacity: 0.5,
              borderRadius: '100px',
            }"
            :focused="isFocused"
          />
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
export default class СaseADemo extends Vue {
  created () {
    this.$keyRouter.push([
      { name: 'items' },
      { name: 'item', params: { id: 1 } },
    ])
  }

  navigationItemCoordinateList = [
    {
      id: 1,
      width: '100px',
      height: '100px',
      left: '100px',
      top: '100px',
    },
    {
      id: 2,
      width: '100px',
      height: '100px',
      left: '200px',
      top: '200px',
    },
    {
      id: 3,
      width: '100px',
      height: '100px',
      left: '400px',
      top: '100px',
    },
  ]
}
</script>

<style lang="scss" scoped>

</style>
