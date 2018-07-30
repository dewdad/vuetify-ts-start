<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm12 md8 lg8 xl8>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <div slot="header">
          分类详情
        </div>
        <v-card class="mb-3">
          <v-card-text v-if="loaded">
            <base-form ref="form" :schema="formSchema" :orginFormData="orginFormData" :disabled="true"></base-form>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">产品</div>
        <v-card class="mb-3">
          <v-card-text v-if="loaded">
            <v-list two-line>
              <template v-for="(product,index) in item.products.data">

                <v-list-tile
                  :key="product.id"
                  avatar
                  @click.stop.native="toProductShow(product)"
                >
                  <v-list-tile-avatar
                    color="indigo"
                    class="headline font-weight-light white--text"
                  >
                    {{ product.name.charAt(0) }}
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{product.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                    <v-layout row
                              wrap>
                      <v-flex>
                        <v-chip outline
                                small
                                color="primary">{{product.type.data.name}}</v-chip>

                        <v-chip color="secondary" text-color="white"
                                small
                                >{{product.brand.data.name}}</v-chip>
                        {{product.name_en}}
                      </v-flex>

                    </v-layout>
                  </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-layout row wrap>
                          <v-flex>
                            <v-tooltip bottom>
                              <v-btn @click.stop.native="relationProduct(product,true)" icon slot="activator" ripple>
                              <v-icon  color="red lighten-1">cancel</v-icon>
                              </v-btn>
                              <span>从分类中移除</span>
                            </v-tooltip>
                          </v-flex>
                        </v-layout>
                  </v-list-tile-action>

                </v-list-tile>
                <v-divider v-if="index!==orginFormData.products.length-1" :key="product.code"></v-divider>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
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
  'relation-product':RelationProduct
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
    const { data } = await Category.getInstance.with(this.include).show({id: this.$route.params.id})
    this.item = data
    this.categoryName = this.item.name
    this.orginFormData = Category.getInstance.filterData(data)
  }

  async relationProduct (product:ApiResponse.ProductData, cancel:boolean) {
    await Category.getInstance.products({id: +this.$route.params.id, product}, cancel)
  }

  async loadFormStructure () {
    this.$loading({ show: true, text: '正在加载。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit(), this.loadFormStructure()])
      this.loaded = true
    })
  }
}
</script>
