<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>产品修改/更新</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">

      <type-form name="产品类型">
        <search-type @change="change" readonly :defaultType="orginFormData.type_id" label="选择或搜索" lableName="产品类型" :searchAction="searchAction"></search-type>
      </type-form>
      <base-form v-if="loadType" ref="form" readonly :schema="formSchema" :orginFormData="orginFormData"></base-form>
      <attribute-form name="产品基本属性" v-if="loadType">
        <product-attributes :items="baseAttributes" readonly ref="baseAttr" :orginFormData="orginAttribute"></product-attributes>
      </attribute-form>
      <attribute-form name="产品销售属性"  v-if="loadType">
        <product-attributes @change="skuChange" ref="sku" readonly :items="variantAttributes" :orginFormData="orginVariant" sku></product-attributes>
      </attribute-form>
      <attribute-form name="产品变体组合"  v-if="tableSchema.length>0">
        <sku-table  :items="tableSchema" readonly></sku-table>
      </attribute-form>

    </v-card-text>

  </v-card>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'

import Form from '@/components/form/BaseForm.vue'

import { Product } from '@/store/modules/product'

import FormItemCard from '@/components/card/FormItemCard.vue'

import AutoComplete from '@/components/form/AutoComplete.vue'

import {ProductType, ProductTypeItem} from '@/store/modules/productType'

import ProductAttributes from '@/components/form/ProductAttributes.vue'

import { AttributeGroupItem } from '@/store/modules/attributeGroup'

import SkuTable from '@/components/table/SkuTable.vue'

interface ProductTypeS extends ProductTypeItem{
  attributeGroups:AttributeGroupItem[]
}

@Component({
  components:{
  'type-form':FormItemCard,
  'base-form':Form,
  'attribute-form':FormItemCard,
  'search-type':AutoComplete,
  'product-attributes':ProductAttributes,
  'sku-table':SkuTable
  }
  })
export default class ProductUpdate extends mixins(Base) {
  public $refs!: {
    'baseAttr':ProductAttributes,
    'sku':ProductAttributes,
    'form':Form
  }
  formSchema:any[]|null = null

  loaded = false

  orginFormData: any = null

  orginAttribute:any = null

  orginVariant:any = null

  createItem:any = null

  item:any|null = null

  productType = {} as ProductTypeS

  baseAttributes:AttributeGroupItem[] = []

  variantAttributes:AttributeGroupItem[] = []

  loadType = false

  skuSet:any = []

  orginTableSchemaData:Map<string, {price:number, sku:string}> = new Map()

  include = ['brand', 'type', 'attributes.group', 'attributes.value', 'variants.attributes.group', 'variants.attributes.value']

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      // await Product.getInstance.update({ formData: {...res, attributes: this.$refs.attributeForm.getAttributes}, id: this.item.id })
      // this.$success({text: '更新成功', position: 9})
      // this.$router.replace({name: this.routeName.index})
    }
  }

  async viewInit () {
    const { data } = await Product.getInstance.with(this.include).show({id: this.$route.params.id})
    this.item = data
    this.orginFormData = Product.getInstance.filterData(data)
    this.setOrginAttribute()
    this.setOrginVariant()
    this.setOrginTableSchema()
  }

  // orginSeparation (arg:any[]){
  //   arg.reduce
  // }

  setOrginAttribute () {
    this.orginAttribute = this.orginFormData.attributes.filter((item:any) => !item.variant)
  }

  setOrginVariant () {
    this.orginVariant = this.orginFormData.attributes.filter((item:any) => item.variant)
  }

  setOrginTableSchema () {
    this.orginFormData.variants.forEach((variant:any) => {
      const key = (variant.attributes.map((item:any) => item.value.value)).join('')
      const {price, sku} = variant
      this.orginTableSchemaData.set(key, {price, sku})
    })
  }

  reset () {
    this.$refs.form.clear()
  }

  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  searchAction () {
    return ProductType.getInstance.index()
  }
  // 产品类型选择改变事件
  async change (id:number|null) {
    if (_.isNull(id)) {
      return
    }
    await this.loadProductType(id)
  }

  async loadProductType (id:number) {
    let {data: attributes} = await ProductType.getInstance.with(['attributeGroups.values']).show({id})
    this.productType = ProductType.getInstance.filterData(attributes)
    this.variantAttributes = []
    this.baseAttributes = []
    this.productType.attributeGroups.forEach(item => {
      item.variant ? this.variantAttributes.push(item) : this.baseAttributes.push(item)
    })

    this.loadType = true
  }

  skuChange (set:any) {
    this.skuSet = set
  }

  get tableSchema () {
    const base = {sku: '', price: 0}
    return this.skuSet.map((item:any) => {
      const key = (item.map((attr:any) => attr.value_name)).join('')
      return {attributes: item, ...this.orginTableSchemaData.get(key), key}
    })
  }

  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit(), this.loadFormStructure()])
      this.loaded = true
    })
  }
}
</script>
