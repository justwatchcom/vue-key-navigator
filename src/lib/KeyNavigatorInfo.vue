<template>
  <div class="KeyNavigatorInfo">
    <p>Registered local key navigators: {{ registeredLocalKeyNavigators }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class KeyNavigatorInfo extends Vue {
  get registeredLocalKeyNavigators (): number {
    return this.$keyNavigatorGlobal.registeredLocalKeyNavigators.length
  }
}
</script>

<style lang="scss">
.KeyNavigatorInfo {

}
</style>
