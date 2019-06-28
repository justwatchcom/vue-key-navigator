import Vue from 'vue'
import App from '../App.vue'
import { VueKeyNavigatorPlugin } from '../lib/plugin'

Vue.config.productionTip = false

Vue.use(VueKeyNavigatorPlugin, {
  keyRouterNodes: [
    {
      name: 'titles',
      children: [
        {
          name: 'popular',
          children: [
            { name: 'title' },
          ],
        },
        {
          name: 'new',
          children: [
            { name: 'title' },
          ],
        },
      ],
    },
  ],
  nodePath: [
    { name: 'titles' },
    { name: 'popular' },
    { name: 'title', params: { id: 2 } },
  ],
})

new Vue({
  render: h => h(App),
}).$mount('#app')
