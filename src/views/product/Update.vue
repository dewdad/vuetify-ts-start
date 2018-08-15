<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12>
      <v-form ref="vform"
              @keyup.native.enter="submit"
              @submit.prevent="submit">
        <form-body-card title="更新/编辑产品">
          <v-card-text>
            <base-form-item v-model="formSchema"
                            ref="form">
              <attribute-form  :productTypeId="productTypeId" v-model="attributes"  ref="attributeForm"></attribute-form>
            </base-form-item>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="clear"
                   flat>清空</v-btn>
            <v-btn color="primary"
                   type="submit">提交</v-btn>
            <!-- <submit-button color="primary" block="true" label="Login"></submit-button> -->
          </v-card-actions>
        </form-body-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
import FormBodyCard from '@/components/card/FormBodyCard.vue'
import { ProductType } from '@/store/modules/productType'
import Base from './mixins/Base'
import FormMixin from '@/components/form/mixins/Form'
import { Brand } from '@/store/modules/brand'
import { CreateProductAttributeParams } from '@/views/product/components/AttributeForm.vue'
import AttributeForm from './components/AttributeForm.vue'
import { Product } from '@/store/modules/product'
interface Groups{
  variantAttributes:ApiResponse.AttributeGroupData[];
  baseAttributes:ApiResponse.AttributeGroupData[];
}
@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard,
  'attribute-form':AttributeForm
  }
  })
export default class ProductCreate extends mixins(Base, FormMixin) {
  public $refs!: {
    form:BaseFormItem,
    vform:any,
    attributeForm:AttributeForm
  };

  @Provide() parentValidator = this.$validator

  item = {} as ApiResponse.ProductData

  brands:any = []

  productTypes:any = []

  paserMapping = {
  }

  mapping = {
    avatars: {key: 'avatars', handle: (item:ApiResponse.Images) => this.getAvatars(item)}
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '产品名称',
      value: '',
      fieldType: 'text',
      rule: 'required|max:60',
      required: true,
      clearable: true
    },
    {
      field: 'name_cn',
      label: '产品中文名称',
      value: '',
      fieldType: 'text',
      rule: 'max:60',
      clearable: true
    },
    {
      field: 'name_en',
      label: '产品英文名称',
      value: '',
      fieldType: 'text',
      rule: 'max:60',
      clearable: true,
      hint: '填写此名称适用于amazon listing'
    },
    {
      field: 'brand_id',
      label: '品牌',
      value: null,
      fieldType: 'search',
      items: [],
      itemText: 'name',
      itemValue: 'id',
      noDataText: '系统中暂无品牌，可以进入到品牌管理页面添加'
    },
    {
      field: 'code',
      label: '商品编号',
      value: '',
      fieldType: 'text',
      rule: 'required|max:60',
      clearable: true
    },
    {
      field: 'enabled',
      label: '是否可售',
      value: true,
      fieldType: 'toggle'
    },
    {
      field: 'avatars',
      label: '产品图集',
      fieldType: 'file',
      value: [],
      itemEvent: {'clear': () => this.onFileComponentClear()}
    },
    {
      field: 'body',
      label: '产品描述',
      value: '',
      fieldType: 'textarea',
      counter: true
    },
    {
      field: 'type_id',
      label: '产品类型',
      value: 0,
      hideNoData: true,
      solo: true,
      items: [],
      itemText: 'name',
      itemValue: 'id',
      fieldType: 'search',
      rule: {required: true, is_not: 0},
      required: true
      // itemEvent: {change: this.onProductSearchChange}
    }
  ]

  // 获取当前产品类型ID
  get productTypeId () {
    const typeField = this.formSchema.find(item => item.field === 'type_id')
    if (typeField) {
      return typeField.value
    }
    return 0
  }

  attributes = [] as CreateProductAttributeParams['attributes']

  @Watch('productTypeId', {immediate:true})
  onProductTypeIdChange (type:any) {
    // this.$router.push({path: this.$route.path, query: {type}})
  }
  // 产品类型搜索框变化回调处理
  onProductSearchChange () {
    const productTypeField = this.formSchema.find(item => item.field === 'type_id')
    if (productTypeField) {
      const type = productTypeField.values
      type > 0 && this.$router.push({path: this.$route.path, query: {type}})
    }
  }

  clear () {
    this.$refs.vform.reset()
  }

  onFileComponentClear () {

  }

  getFormData () {
    const base = this.paserFormData()
    const attributes = this.attributes
    const variants = this.$refs.attributeForm.variants
    return {...base, attributes, variants}
  }

  async submit () {
    if (await this.$validator.validateAll()) {
      await this.update()
    }
  }

  async update () {
    this.$loading({show: true, text: '提交中'})
    let res = await this.updateApi({id: this.item.id, ...this.getFormData()})
    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: res.data.data.id}})
      this.$success({text: 'create success!'})
    } else {
      this.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  async loadBrands () {
    const {data} = await Brand.index({filter: 'id;name', per_page: 999})
    this.brands = data
    const brandField = this.formSchema.find(item => item.field === 'brand_id')
    if (brandField) {
      brandField.items = this.brands
    }
  }

  async loadProductTypes () {
    let {data} = await ProductType.index({per_page: 999, filter: 'id;name'})
    this.productTypes = data
    const productTypeField = this.formSchema.find(item => item.field === 'type_id')
    if (productTypeField) {
      productTypeField.items = this.productTypes
    }
  }

  async viewInit () {
    const {data} = await this.showApi({id: +this.$route.params.id})
    this.item = data
    this.assignmentFormSchema(this.item)
  }

  async created () {
    await Promise.all([
      this.loadBrands(),
      this.loadProductTypes(),
      this.viewInit()
    ])
  }
}
</script>
