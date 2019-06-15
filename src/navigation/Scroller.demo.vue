<template>
  <VbDemo>
    <VbCard title="Vertical only">
      <div style="width: 200px; height: 200px; overflow: scroll; display: flex; scroll-behavior: smooth;" ref="vertical-container">
        <div
          v-for="n in 10"
          :key="n"
          ref="vertical-item"
          style="width: 100px; min-width: 100px; height: 100px; background-color: peachpuff; margin: 10px;"
        >{{ n }}
        </div>
      </div>
      <button
        v-for="n in 10"
        :key="n"
        @click="scrollers['vertical'].scroll($refs['vertical-item'][n - 1])"
      >
        {{ n }}
      </button>
    </VbCard>
    <VbCard title="Horizontal only">
      <div style="width: 200px; height: 200px; overflow: scroll; scroll-behavior: smooth;" ref="horizontal-container">
        <div
          v-for="n in 10"
          :key="n"
          ref="horizontal-item"
          style="width: 100px; height: 100px; background-color: peachpuff; margin: 10px"
        >{{ n }}
        </div>
      </div>
      <button
        v-for="n in 10"
        :key="n"
        @click="scrollers['horizontal'].scroll($refs['horizontal-item'][n - 1])"
      >
        {{ n }}
      </button>
    </VbCard>
    <VbCard title="Both directions">
      NOTE: Goes only in one direction at a time
      <div
        style="width: 200px; height: 200px; overflow: scroll; scroll-behavior: smooth;"
        ref="both-directions-container"
      >
        <div
          v-for="n in 10"
          :key="n + 10"
          ref="both-directions-item"
          style="width: 100px; height: 100px; background-color: peachpuff; margin: 10px;"
        >
          {{ n + 10 }}
        </div>
        <div style="display: flex;">
          <div
            v-for="n in 10"
            :key="n"
            ref="both-directions-item"
            style="width: 100px; min-width: 100px; height: 100px; background-color: peachpuff; margin: 10px"
          >
            {{ n }}
          </div>
        </div>
      </div>
      <button
        v-for="n in 20"
        :key="n"
        @click="scrollers['both-directions'].scroll($refs['both-directions-item'][n - 1])"
      >
        {{ n }}
      </button>
    </VbCard>
  </VbDemo>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Scroller, { Point } from './scroller.service'

@Component({
  async mounted () {
    this.scrollers = {
      'vertical': new Scroller(this.$refs['vertical-container'], true, false, new Point(0, 0)),
      'horizontal': new Scroller(this.$refs['horizontal-container'], false, true, new Point(0, 0)),
      'both-directions': new Scroller(this.$refs['both-directions-container'], true, true, new Point(0, 0)),
    }
  },
})
export default class Demo extends Vue {
  itemsNumber: number = 10
  scrollers: { [key: string]: Scroller }
}
</script>
