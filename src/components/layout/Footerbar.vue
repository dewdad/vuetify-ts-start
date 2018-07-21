<template>
  <v-footer height="20"  inset fixed app>
    <!-- <span class="caption">isocked.com Design &copy; {{ new Date().getFullYear() }}</span> -->
    <breadcrumb></breadcrumb>
    <v-spacer></v-spacer>
    <span class="caption mr-1"> &copy; 2018 zhouchang </span> <v-icon color="pink" small>favorite</v-icon>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Breadcrumb from './Breadcrumb.vue'

@Component({
  components: {
  breadcrumb: Breadcrumb,
  },
  })
export default class FooterBar extends Vue {
    public fixed: boolean = true;
}
</script>
