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
import Product from '@/models/Product'
import {Product as ProductVuex} from '@/store/modules/product'
import http from '@/utils/request'
@Component({
  layout: 'app',
  middleware:'auth'
  })
export default class Home extends Vue {
  async mounted () {
    let products = await http.get('/products?include=brand,type,categories')
    console.log(products.data)
    Product.create({
      data: products.data.data
    })
  }
}
</script>
