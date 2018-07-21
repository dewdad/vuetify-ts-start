<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    app
  >
  <div class="pa-3 text-xs-center">
    <div class="display-2 py-4">
      BESTKIT

    </div>
    <P>erp system</P>
  </div>
  <v-divider></v-divider>
      <list-item :routes="routes"></list-item>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ListItem from './ListItem.vue'
@Component({
  components: {
  'list-item': ListItem,
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
