import Vue from 'vue'
import { KeyNavigatorLocal } from './KeyNavigatorLocal'

export const KeyNavigatorMixin = Vue.extend({
  data () {
    return {
      $keyNavigatorLocal: new KeyNavigatorLocal(this.$keyNavigatorGlobal, this),
    }
  },
  created () {
    this.$keyNavigatorGlobal.register(this)
  },
  beforeDestroy (): void {
    this.$keyNavigatorGlobal.unregister(this)
  },
})
