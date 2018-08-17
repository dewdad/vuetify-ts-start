<template>
  <v-layout align-center justify-center>
    <v-flex xs12>
      <v-card class="elevation-12">
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Home</v-toolbar-title>
          <v-spacer></v-spacer>

        </v-toolbar>
        <v-card-text>
          Welcome back!
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/utils/request'
@Component({
  layout: 'app',
  middleware:'auth'
  })
export default class Home extends Vue {
  async mounted () {
  }
}
</script>
