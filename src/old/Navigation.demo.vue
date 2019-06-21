<template>
  <VbDemo>
    <VbCard v-focus data-default>
      <div
        v-for="n in 3"
        :key="n"
        v-focus
        :data-default="n === 1"
        style="display: flex"
      >
        <div
          :data-default="n === focusedItemNumber"
          v-for="n in 4"
          :key="n"
          v-focus class="item"
          @click="focusedItemNumber = n"
        >
          {{n}}
        </div>
      </div>
    </VbCard>
  </VbDemo>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class NavigationDemo extends Vue {
  focusedItemNumber = 1
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
