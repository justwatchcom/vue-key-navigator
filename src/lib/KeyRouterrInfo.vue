<template>
  <div class="KeyRouterInfo">
    <p>Registered local key navigators: {{ registeredComponentKeyRouters }}</p>

    <div>
      Node path:
      <pre>{{this.$keyRouter.nodePath}}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class KeyRouterInfo extends Vue {
  get registeredComponentKeyRouters (): number {
    return this.$keyRouter.componentKeyRouters.length
  }
}
</script>

<style lang="scss">
.KeyRouterInfo {

}
</style>
