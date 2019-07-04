<template>
  <VbDemo>
    <VbCard>
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

function getRandomNumber (min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getNavigationItemCoordinates (index: number) {
  return {
    id: index,
    width: getRandomNumber(50, 100) + 'px',
    height: getRandomNumber(50, 100) + 'px',
    left: getRandomNumber(0, 400) + 'px',
    top: getRandomNumber(0, 400) + 'px',
  }
}

function runTimes<T> (closure: (count: number) => T, times: number): T[] {
  return Array.from(Array(times)).map((x, i) => closure(i))
}

@Component({
  components: { KeyNavigatorInfo, NavigatableListItem },
})
export default class RandomNavigationDemo extends Vue {
  navigationItemCoordinateList = runTimes(getNavigationItemCoordinates, 10)

  created () {
    this.$keyRouter.push([
      { name: 'items' },
      { name: 'item', params: { id: 1 } },
    ])
  }

  refresh() {
    this.navigationItemCoordinateList = runTimes(getNavigationItemCoordinates, 10)
  }
}
</script>

<style lang="scss" scoped>

</style>
