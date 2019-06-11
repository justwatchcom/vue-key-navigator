<template>
  <router-view/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createRoute } from 'vue-book'
import { Router } from 'vue-router'

Vue.use(Router)

@Component({})
export default class App extends Vue {
  router = new Router({
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
  })
}
</script>

<style lang="scss">

</style>
