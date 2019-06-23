<template>
  <VbDemo>
    <VbCard title="Single level navigation" width="520px">
      <div>
        <button @click="count--" v-if="count">-</button>
        <button @click="count++">+</button>
      </div>
      <template v-for="n in count">
        <NavigatableListItem
          v-if="[2,6,8,12].includes(n)"
          :key="n"
          :id="n"
        />
        <div
          v-else
          :key="n"
          class="NavigatableListItem" style="background-color: white !important;"
        >dfj</div>
      </template>
    </VbCard>
    <VbCard title="Key navigator info">
      <KeyNavigatorInfo/>
    </VbCard>
  </VbDemo>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavigatableListItem from './NavigatableListItem.vue'
import KeyNavigatorInfo from '../lib/KeyNavigatorInfo.vue'

@Component({
  components: { KeyNavigatorInfo, NavigatableListItem },
})
export default class NavigationDemo extends Vue {
  count = 25
}
</script>

<style lang="scss" scoped>

</style>
