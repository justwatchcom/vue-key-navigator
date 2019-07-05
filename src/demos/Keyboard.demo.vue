<template>
  <VbDemo>
    <VbCard>
      <Keyboard/>
    </VbCard>
  </VbDemo>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Keyboard from './Keyboard.vue'

@Component({
  components: { Keyboard },
})
export default class OverrideDirectionDemo extends Vue {
  created () {
    this.$keyRouter.push([
      { name: 'main' },
      { name: 'keyboard' },
      { name: 'key', params: { keyboardKey: 'A' } },
    ])
  }
}
</script>

<style lang="scss" scoped>

</style>
