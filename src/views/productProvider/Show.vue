<template>
<v-layout fill-height  justify-center>
  <v-flex xs8>
    <v-expansion-panel
      v-model="panel"
    >
      <v-expansion-panel-content>
        <div slot="header">
          供应商详情</div>
        <detail-list v-if="loaded" :item="item"></detail-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">产品</div>
        <v-card class="mb-3">
          <v-card-text v-if="loaded">
            <v-list two-line>
              <template v-for="variant in products">

                <v-list-tile
                  :key="variant.id"
                  avatar
                  :to="{name:'product.show',params:{id:variant.product_id}}"
                >
                  <v-list-tile-avatar
                    color="indigo"
                    class="headline font-weight-light white--text"
                  >
                    {{ variant.name.charAt(0) }}
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{variant.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{getAttribute(variant.attributes)}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-layout row wrap>
                          <v-flex>
                            <v-tooltip bottom>
                              <v-icon slot="activator" color="grey lighten-1">info</v-icon>
                              <span>{{variant.pivot.updated_at}}</span>
                            </v-tooltip>
                            报价: {{variant.pivot.price}}
                          </v-flex>
                        </v-layout>
                  </v-list-tile-action>

                </v-list-tile>
                <v-divider :key="variant.sku"></v-divider>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>

  <v-flex md4 lg4 xl4 v-show="!showBtn">
    <v-card tile class="mb-3">
      <v-progress-linear
          :value="50"
          class="my-0"
          height="3"
        ></v-progress-linear>
      <v-card-text class="font-weight-light text-md-center text-xs-center">
        点击这里可以为产品供应商添加关联产品
      </v-card-text>
      <v-card-actions>
        <v-btn block color="info" @click="openDialog">添加/更新关联产品</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
    <v-fab-transition>
      <v-btn
        v-show="showBtn"
        color="primary"
        dark
        fixed
        bottom
        right
        fab
        @click="openDialog"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  <relation-product ref="relationProduct"></relation-product>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import { ProductProvider } from '@/store/modules/productProvider'
import RelationProduct from './RelationProduct.vue'
@Component({
  components:{
  'relation-product':RelationProduct,
  'detail-list':()=>import('@/views/productProvider/components/DetailList.vue')
  }
  })
export default class ProductProviderShow extends mixins(Base) {
  public $refs!: {
    relationProduct:RelationProduct
  }
  formSchema:any[]|null = null
  orginFormData:any|null = null
  loaded = false
  createItem:any = null
  item:any|null = null

  panel:boolean[] = [true]

  include = ['info', 'payment.balance', 'payment.payment', 'addresses', 'products.name', 'products.attributes.attributeValue']

  openDialog () {
    this.$refs.relationProduct.dialog = true
  }

  async viewInit () {
    const { data } = await this.showApi({id: this.$route.params.id})
    this.item = data
  }

  getAttribute (attributes:any) {
    return (attributes.data.map((item:any) => item.attributeValue.data.value)).join('-')
  }

  get products () {
    return ProductProvider.getProducts(+this.$route.params.id)
  }

  get showBtn () {
    return this.$vuetify.breakpoint.xs
  }

  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit()])
      this.loaded = true
    })
  }
}
</script>
