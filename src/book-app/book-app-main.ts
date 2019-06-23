import Vue from 'vue'
import App from '../App.vue'
import { VueKeyNavigatorPlugin } from '../lib/plugin'

Vue.config.productionTip = false

Vue.use(VueKeyNavigatorPlugin, {
  keyRoutes: [
    {
      name: 'titles',
      children: [
        { name: 'title' },
      ],
    },
  ],
  currentKeyRoutes: [
    {name: 'title', params: {id: 2}},
  ],
})

new Vue({
  render: h => h(App),
}).$mount('#app')
