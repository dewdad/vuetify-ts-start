<template>
  <v-tabs
      dark
      slider-color="yellow"
      color="transparent"
      show-arrows
    >
      <transition-group name="page" mode="out-in">
        <v-chip @click="click(view)"  outline text-color="white"  label :selected="isActive(view)"  v-for="view in visitedViews"
        :key="view.path" @input="closeSelectedTag(view)" close>
          <v-avatar v-show="isActive(view)">
            <v-icon>check_circle</v-icon>
          </v-avatar>
          {{ view.title }}
        </v-chip>
      </transition-group>
    </v-tabs>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteConfigEx } from '@/store/modules/tagsView'
@Component
export default class Tabs extends Vue {
    public selectedTag = {};
    public chips: any = {};

    activeTag:string = ''

    get visitedViews () {
      return this.$store.state.tagsView.visitedViews
    }

    public generateRoute () {
      if (this.$route.name) {
        return this.$route
      }
      return false
    }

    public addViewTags () {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      // this.$set(this.chips, (route.name as string), true)
      this.$store.dispatch('tagsView/addVisitedViews', route)
    }

    @Watch('$route')
    public onRouteChange (val: string, oldVal: string) {
      this.addViewTags()
    }

    public click (route: RouteConfigEx) {
      this.$router.push(route.fullPath)
    }

    public closeSelectedTag (route: RouteConfigEx) {
      this.$store.dispatch('tagsView/delVisitedViews', route).then((routes) => {
        if (this.isActive(route)) {
          const latestView = routes.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    }

    public isActive (route: RouteConfigEx) {
      return route.path === this.$route.path
    }
}
</script>
