<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12>
      <v-form ref="vform"
              @keyup.native.enter="submit"
              @submit.prevent="submit">
        <form-body-card title="创建产品">
          <v-card-text>
            <base-form-item v-model="formSchema"
                            ref="form">
              <attribute-form  :productTypeId="productTypeId" v-model="attributes"  sku></attribute-form>
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
// import AttributeForm from './components/AttributeForm.vue';
interface Groups{
  variantAttributes:ApiResponse.AttributeGroupData[];
  baseAttributes:ApiResponse.AttributeGroupData[];
}
@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard,
  'attribute-form':()=>import('./components/AttributeForm.vue')
  }
  })
export default class ProductCreate extends mixins(Base, FormMixin) {
  public $refs!: {
    form:BaseFormItem,
    vform:any
  };

  @Provide() parentValidator = this.$validator

  include = ['attributeGroups']

  productType = {} as ApiResponse.ProductType

  paserMapping = {
    'group_ids': {handle: (item:ApiResponse.AttributeGroupData[]) => item.map(group => group.id)}
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'type_id',
      label: '产品类型',
      value: 0,
      items: [],
      itemText: 'name',
      itemValue: 'id',
      fieldType: 'search',
      rule: 'required',
      requeired: true,
      clearable: true,
      itemEvent: {change: this.onProductSearchChange}
    }
  ]

  // 获取当前产品类型ID
  get productTypeId () {
    return _.get(this, 'formSchema.0.value', 0)
  }

  attributes:any[] = []

  // 产品类型搜索框变化回调处理
  async onProductSearchChange (val:string) {
    await this.searchProductType(val)
  }

  async searchProductType (name:string) {
    const queryBuild = {search: name, search_fields: 'name:like', filter: 'id;name'}
    let {data} = await ProductType.getInstance.index(queryBuild)
    this.formSchema[0].items = data
  }

  clear () {
    this.$refs.vform.reset()
  }

  onFileComponentClear (e:MouseEvent, item:FormInterface.Field) {
    item.value = []
  }

  async submit () {
    console.log(await this.$validator.validateAll())
    // if (await this.$refs.form.submit()) {
    //   await this.create()
    // }
  }

  async create () {
    this.$loading({show: true, text: '提交中'})
    let res = await ProductType.getInstance.with(this.include).create(this.paserFormData())
    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: res.data.data.id}})
      this.$success({text: 'create success!'})
    } else {
      this.$refs.form.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  async created () {

  }
}
</script>
