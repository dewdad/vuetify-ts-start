<template>
  <v-breadcrumbs divider="/" class="breadcrumbs">
      <v-breadcrumbs-item
        v-for="(item,index) in levelList"
        :key="item.path"
        :disabled="routerDisabled(item,index)"
        :to="item.redirect||item.path"
        :class="{'no-redirect':routerDisabled(item,index)}"
      >
        {{ item.meta.title }}
      </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord } from 'vue-router'

@Component
export default class Breadcrumb extends Vue {
    public levelList: RouteRecord[] = [];

    public getBreadcrumb () {
      let matched: any = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== '/') {
        matched = [{ path: '/', meta: { title: 'home' } }].concat(matched)
      }
      this.levelList = matched
    }

    public routerDisabled (item: RouteRecord, index: number) {
      return item.redirect === 'noredirect' || index === this.levelList.length - 1
    }

    public created () {
      this.getBreadcrumb()
    }

    @Watch('$route')
    public onRouteChange () {
      this.getBreadcrumb()
    }
}
</script>
