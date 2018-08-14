<template>
  <v-card>
    <v-card-text>
      <v-list two-line>
        <template v-for="(product,index) in products.data">
          <product-list-item :product="product" :key="index" :relationed="relationed" v-on="$listeners"></product-list-item>
          <v-divider v-if="index!==products.data.length-1"
                     :key="product.code"></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import ProductListItem from '@/components/card/ProductListItem.vue'
@Component({
  components:{
  'product-list-item':ProductListItem
  }
  })
export default class ProductListCard extends Vue {
  @Prop({type: Object, default: () => {}}) products!:ApiResponse.Products

  @Prop({type: Array, default: () => []}) relationed!:number[]
}
</script>
