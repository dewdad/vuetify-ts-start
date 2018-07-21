<template>
  <v-app>
    <drawer></drawer>
    <toolbar></toolbar>
    <v-content>
      <app-main></app-main>
      <footerbar></footerbar>
    </v-content>
    <!-- <snackbar></snackbar> -->
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppMain, Footerbar, Drawer, Toolbar } from '@/components/layout'

@Component({
  components: {
  'drawer': Drawer,
  'toolbar': Toolbar,
  'app-main': AppMain,
  'footerbar': Footerbar,
  },
  })
export default class AppLayout extends Vue {

}
</script>
