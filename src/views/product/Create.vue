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
      <attribute-form name="产品属性" v-if="loadType">
        <product-attributes :items="attributes.attributeGroups"></product-attributes>
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
import { Product } from '@/store/modules/product'
import FormItemCard from '@/components/card/FormItemCard.vue'
import AutoComplete from '@/components/form/AutoComplete.vue'
import {ProductType} from '@/store/modules/productType'
import ProductAttributes from '@/components/form/ProductAttributes.vue'
@Component({
  components:{
  'type-form':FormItemCard,
  'attribute-form':FormItemCard,
  'search-type':AutoComplete,
  'product-attributes':ProductAttributes
  }
  })
export default class ProductCreate extends mixins(Base) {
  public $refs!: {

  };
  formSchema:any[]|null = null
  loaded = false
  createItem:any = null

  attributes:any = null

  loadType = false

  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
    // this.formSchema = await this.createSchema()
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
    this.attributes = ProductType.getInstance.filterData(attributes)
    this.loadType = true
  }

  reset () {

  }

  async submit () {
    // const res = await this.$refs.form.submit()
    // if (res) {
    //   this.createItem = res
    //   await Product.getInstance.create({...res, attributes: this.$refs.attributeForm.getAttributes})
    //   this.$success({text: '创建成功', position: 9})
    //   this.$router.replace({name: this.routeName.index})
    // }
  }

  async created () {
    await this.loadFormStructure()
    this.loaded = true
  }
}
</script>
