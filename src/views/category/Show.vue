<template>
<v-layout fill-height  justify-center>

  <v-flex xs8>
    <v-expansion-panel>
      <v-expansion-panel-content v-if="loaded && item">
        <div slot="header">
          分类详情
        </div>
        <v-card class="mb-3">
          <v-card-text v-if="loaded">
            <v-list slot="after-card-text" two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon color="indigo">title</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{item.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>分类名称</v-list-tile-sub-title>
                </v-list-tile-content>

              </v-list-tile>

              <v-divider inset v-if="item.parent_name"></v-divider>

              <v-list-tile v-if="item.parent_name">
                <v-list-tile-action>
                  <v-icon color="indigo">text_fields</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{item.parent_name}}</v-list-tile-title>
                  <v-list-tile-sub-title>父分类</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-divider inset v-if="item.description"></v-divider>

              <v-list-tile v-if="item.description">
                <v-list-tile-action>
                  <v-icon color="indigo">description</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{item.description}}</v-list-tile-title>
                  <v-list-tile-sub-title>分类描述</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content v-if="loaded && item.products">
        <div slot="header">产品</div>
        <product-list-card :products="item.products" :relationed="productIds" @attach="attach" @detach="detach"></product-list-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>

  <v-flex md4 lg4 xl4 v-show="!$vuetify.breakpoint.xs">
    <v-card tile class="mb-3">
      <v-progress-linear
          :value="50"
          class="my-0"
          height="3"
        ></v-progress-linear>
      <v-card-text class="font-weight-light text-md-center text-xs-center">
        点击这里可以为
        <span class="body-2">{{categoryName}}</span>
        分类添加关联产品
      </v-card-text>
      <v-card-actions>
        <v-btn block color="info" @click="openDialog">添加/更新关联产品</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
  <v-fab-transition>
    <v-btn
      v-show="$vuetify.breakpoint.xs"
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
import Form from '@/components/form/BaseForm.vue'
import { Category } from '@/store/modules/category'
import RelationProduct from './RelationProduct.vue'

@Component({
  components:{
  'base-form':Form,
  'relation-product':RelationProduct,
  'product-list-card':()=>import('@/components/card/ProductListCard.vue')
  }
  })
export default class CategoryShow extends mixins(Base) {
  public $refs!: {
    form: Form,
    relationProduct:RelationProduct
  }
  formSchema:any[]|null = null
  orginFormData:any|null = null
  loaded = false
  createItem:any = null
  item = {} as ApiResponse.CategoryData

  categoryName:string = '加载中'

  include = ['products.brand', 'products.type']

  openDialog () {
    this.$refs.relationProduct.dialog = true
  }

  toProductShow (product:ApiResponse.ProductData) {
    this.$router.push({name: 'product.show', params: {id: String(product.id)}})
  }

  async viewInit () {
    const { data } = await this.showApi({id: this.$route.params.id})
    this.item = data
    this.categoryName = this.item.name
    this.orginFormData = Category.filterData(data)
  }

  async attach (product:ApiResponse.ProductData) {
    await Category.products({id: +this.$route.params.id, product}, false)
  }

  async detach (product:ApiResponse.ProductData) {
    await Category.products({id: +this.$route.params.id, product}, true)
  }

  async relationProduct (product:ApiResponse.ProductData, cancel:boolean) {
    await Category.products({id: +this.$route.params.id, product}, cancel)
  }

  get productIds () {
    return Category.productIds(+this.$route.params.id)
  }

  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit()])
      this.loaded = true
    })
  }
}
</script>
