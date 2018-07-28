<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm12 md12 lg8 xl8>
    <v-expansion-panel
      v-model="panel"

    >

      <v-expansion-panel-content>
        <div slot="header">
          供应商详情</div>
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
            <!-- <v-card tile v-for="variant in products" :key="variant.sku">
                <v-card-title>
                      {{variant.name+' '+getAttribute(variant.attributes)}}
                </v-card-title>
                <v-card-text>
                  <div class="text-xs-right grey--text">￥{{variant.price}}</div>
                  <div class="text-xs-right grey--text">最后报价日期{{variant.pivot.updated_at}}</div>
                </v-card-text>
            </v-card> -->
            <v-list two-line>
              <template v-for="variant in products">

                <v-list-tile
                  :key="variant.sku"
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
                            报价: {{variant.price}}
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

  <v-flex xs12 sm12 md12 lg4 xl8>
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
        <v-btn block color="info" @click="openDialog">添加产品</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
  <relation-product ref="relationProduct"></relation-product>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import Form from '@/components/form/BaseForm.vue'
import { ProductProvider } from '@/store/modules/productProvider'
import RelationProduct from './RelationProduct.vue'
@Component({
  components:{
  'base-form':Form,
  'relation-product':RelationProduct
  }
  })
export default class ProductProviderShow extends mixins(Base) {
  public $refs!: {
    form: Form,
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
    const { data } = await ProductProvider.getInstance.with(this.include).show({id: this.$route.params.id})
    this.item = data
    this.orginFormData = ProductProvider.getInstance.filterData(data)
    this.orginFormData.addresses = this.orginFormData.addresses[0]
  }

  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  getAttribute (attributes:any) {
    return (attributes.data.map((item:any) => item.attributeValue.data.value)).join('-')
  }

  get products () {
    return ProductProvider.getInstance.getProducts(this.$route.params.id)
  }

  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit(), this.loadFormStructure()])
      this.loaded = true
    })
  }
}
</script>
