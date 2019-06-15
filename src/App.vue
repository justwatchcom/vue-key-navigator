<template>
  <div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createRoute, VueBookComponents } from 'vue-book'
import Router from 'vue-router'

Vue.use(Router)
Vue.use(VueBookComponents)

@Component({
  router: new Router({
    routes: [
      createRoute({
        requireContext: require.context('./..', true, /.demo.vue$/),
        path: '/demo',
      }),
      {
        path: '*',
        redirect: '/demo',
      },
    ],
  }),
})
export default class App extends Vue {

}
</script>

<style lang="scss">

</style>
