<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    overflow
    app
    style="max-height: calc(100%);"
  >
  <div class="pa-3 text-xs-center">
    <div class="display-2 py-4 font-weight-medium">
      BESTKIT

    </div>
    <P class="font-weight-thin">erp system 🚀v1.0</P>
  </div>
  <v-divider></v-divider>
      <!-- <v-list>
        <list-item :routes="routes"></list-item>
      </v-list> -->
      <list-item></list-item>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import ListItem from './ListItem.vue'
@Component({
  components: {
  // 'list-item': ListItem,
  'list-item':()=>import('./ListEle.vue')
  },
  })
export default class Drawer extends Vue {
  get routes () {
    return this.$store.getters.drawers
  }

  get drawer () {
    return this.$store.getters.drawer
  }

  set drawer (val) {
    this.$store.dispatch('app/changeDrawer', val)
  }
}
</script>
