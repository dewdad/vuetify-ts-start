<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
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
import {User} from '@/store/modules/user'
@Component({
  layout: 'default',
  })
export default class Home extends Vue {
}
</script>
