<template>
  <v-app>
    <v-content>
      <app-main></app-main>
  </v-content>
  <!-- <snackbar></snackbar> -->
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppMain } from '@/components/layout'

@Component({
  components: {
  'app-main': AppMain,
  },
  })
export default class DefaultLayout extends Vue {

}
</script>
