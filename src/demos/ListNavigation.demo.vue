<template>
  <VbDemo>
    <VbCard title="titles -> popular -> title id" width="210px">
      <button style="flex: 1 0 100%;" @click="$keyRouter.nodePath = [{ name: 'titles' },{ name: 'popular' },{ name: 'title', params: { id: 1 }}]">Switch to title</button>
      <div>
        <NavigatableListItem
          v-for="n in count"
          :key="n"
          :keyRouteProp="[{ name: 'titles' },{ name: 'popular' },{ name: 'title', params: { id: n }}]"
        />
      </div>
    </VbCard>
    <VbCard title="titles -> new -> title id" width="210px">
      <NavigatableListItem
        v-for="n in count"
        :key="n"
        :keyRouteProp="[{ name: 'titles' },{ name: 'new' },{ name: 'title', params: { id: n }}]"
        disabled
      />
    </VbCard>
    <VbCard title="menu -> item id" width="210px">
      <button @click="$keyRouter.nodePath = [{ name: 'menu' }, { name: 'item', params: { id: 1 }}]">Switch to menu</button>
      <div>
        <NavigatableListItem
          v-for="n in count"
          :key="n"
          :keyRouteProp="[{ name: 'menu' }, { name: 'item', params: { id: n }}]"
        />
      </div>
    </VbCard>
    <VbCard title="Key navigator info">
      <p>Item count:
        <button @click="count--" v-if="count">-</button>
        <button @click="count++">+</button>
      </p>
      <KeyNavigatorInfo/>
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
}
</script>

<style lang="scss" scoped>

</style>
