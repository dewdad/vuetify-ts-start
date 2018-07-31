<template>
  <v-content>
      <app-main></app-main>
      <snackbar></snackbar>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppMain } from '@/components/layout'

@Component({
  components: {
  'app-main': AppMain,
  'snackbar':()=>import('@/components/feedbackMessage/SnackBar.vue')
  },
  })
export default class DefaultLayout extends Vue {

}
</script>
