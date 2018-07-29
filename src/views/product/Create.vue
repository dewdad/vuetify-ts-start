<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>创建产品</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <type-form name="选择类型">
        <search-type @change="change" label="选择或搜索" lableName="产品类型" :searchAction="searchAction"></search-type>
      </type-form>
      <base-form v-if="loadType" ref="form" :schema="formSchema"></base-form>
      <attribute-form name="产品基本属性" v-if="loadType">
        <product-attributes :items="baseAttributes" ref="baseAttr"></product-attributes>
      </attribute-form>
      <attribute-form name="产品销售属性"  v-if="loadType">
        <product-attributes @change="skuChange" ref="sku" :items="variantAttributes" sku></product-attributes>
      </attribute-form>
      <attribute-form name="产品变体组合"  v-if="tableSchema.length>0">
        <sku-table  :items="tableSchema"></sku-table>
      </attribute-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="reset">重置</v-btn>
      <v-btn flat color="info" @click.native="submit">提交</v-btn>
    </v-card-actions>
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
export default class ProductCreate extends mixins(Base) {
  public $refs!: {
    'baseAttr':ProductAttributes,
    'sku':ProductAttributes,
    'form':Form
  };
  formSchema:any[]|null = null

  loaded = false

  createItem:any = null

  productType = {} as ProductTypeS

  baseAttributes:AttributeGroupItem[] = []

  variantAttributes:AttributeGroupItem[] = []

  loadType = false

  skuSet:any = []

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
    if (!id) {
      this.pageInit()
      return
    }
    await this.loadProductType(id)
  }

  pageInit () {
    this.loadType = false
    this.productType = {} as ProductTypeS
    this.variantAttributes = []
    this.baseAttributes = []
    this.skuSet = []
  }

  async loadProductType (id:number) {
    this.loadType = false
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
    return this.skuSet.map((item:any) => ({attributes: item, ...base, key: (item.map((attr:any) => attr.value_name)).join('')}))
  }
  reset () {

  }

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      const variants= this.tableSchema.map((item:any) => {
        let {price, sku, attributes} = item
        attributes = attributes.map((attr:any) => attr.value_id)
        return {price, sku, attributes}
      })

      const formData = {...res, type_id: this.productType.id, attributes: [...this.$refs.baseAttr.attributes, ...this.$refs.sku.attributes], variants}
      // // this.createItem = res
      await Product.getInstance.create(formData)
      this.$success({text: '创建成功', position: 9})
      this.$router.replace({name: this.routeName.index})
    }
  }

  async created () {
    await this.loadFormStructure()
    this.loaded = true
  }
}
</script>
