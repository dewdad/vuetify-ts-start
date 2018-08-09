<template>
  <v-container fluid v-show="productTypeId!==0">
    <v-alert v-show="groups.length===0"
             :value="true"
             color="info"
             icon="priority_high"
             outline>
      该产品类型下无基本属性
    </v-alert>
    <template v-for="item in groups">
      <!-- select -->

      <v-select :key="item.id"
                v-if="item.type === 'select'"
                :items="item.values.data"
                :label="item.name"
                item-text="value"
                item-value="id"
                :disabled="disabled"
                :readonly="readonly"
                v-model="item.value"
                v-validate="item.required ? 'required':''"
                :error-messages="errors.collect(item.name)"
                :name="item.name"
                :required="item.required"></v-select>

      <!-- text -->

      <v-text-field :key="item.id"
                    v-if="item.type === 'text'"
                    :label="item.name"
                    :disabled="disabled"
                    :readonly="readonly"
                    v-model="item.value"
                    v-validate="item.required ? 'required':''"
                    :error-messages="errors.collect(item.name)"
                    :name="item.name"
                    :required="item.required"></v-text-field>

      <div v-if="item.type === 'checkbox_group'"
           :key="item.id">

        <v-subheader>
          {{item.name}}
          <v-spacer></v-spacer>
          <div v-if="item.variant"
               class="caption font-weight-thin">销售属性</div>
        </v-subheader>
        <v-divider></v-divider>
        <v-layout row
                  wrap>
          <v-flex xs6
                  sm3
                  md3
                  v-for="attribute in item.values.data"
                  :key="attribute.id">
            <v-checkbox v-model="item.value"
                        :disabled="disabled"
                        :readonly="readonly"
                        :label="attribute.value"
                        :value="attribute"
                        v-validate="item.required ? 'required':''"
                        :error-messages="errors.collect(item.name)"
                        :name="item.name"
                        :required="item.required">

            </v-checkbox>

          </v-flex>
        </v-layout>
      </div>

      <!-- textarea -->

      <v-textarea v-if="item.type === 'textarea'"
                  :key="item.id"
                  :label="item.name"
                  hint="Hint text"
                  :disabled="disabled"
                  :readonly="readonly"
                  v-model="item.value"
                  v-validate="item.required ? 'required':''"
                  :error-messages="errors.collect(item.name)"
                  :name="item.name"
                  :required="item.required"></v-textarea>

      <!-- radio_group -->

      <div v-if="item.type === 'radio_group'"
           :key="item.id">

        <v-subheader>
          {{item.name}}
          <v-spacer></v-spacer>
          <div v-if="item.variant"
               class="caption font-weight-thin">销售属性</div>
        </v-subheader>
        <v-divider></v-divider>

            <v-radio-group
                     :mandatory="false"
                     :disabled="disabled"
                     :readonly="readonly"
                     v-model="item.value"
                     v-validate="item.required ? 'required':''"
                     :error-messages="errors.collect(item.name)"
                     :name="item.name"
                     :required="item.required">
              <v-radio v-for="attribute in item.values.data"
                      :key="attribute.id"
                      :label="attribute.value"
                      :value="attribute"></v-radio>
            </v-radio-group>

      </div>

      <!-- toggle -->

      <v-switch v-if="item.type === 'toggle'"
                :key="item.id"
                :label="item.name"
                :disabled="disabled"
                :readonly="readonly"
                v-model="item.value"
                v-validate="item.required ? 'required':''"
                :error-messages="errors.collect(item.name)"
                :name="item.name"
                :required="item.required"></v-switch>

    </template>
    <sku-table v-show="skuTableSchema.length>0" v-model="skuTableSchema"></sku-table>
  </v-container>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator'
import { ProductType } from '@/store/modules/productType'

type Groups = Array<ApiResponse.AttributeGroupData & {value?:any}>

@Component({
  components:{
  'sku-table':()=>import('@/components/table/SkuTable.vue')
  }
  })
export default class ProductAttributes extends Vue {
  @Model('input', {type: Array, default: []}) value!:any[]

  @Prop({type: Boolean, default: false})
  disabled!:boolean

  @Prop({type: Boolean, default: false})
  readonly!:boolean

  // 产品类型id
  @Prop({type: Number, required: true}) productTypeId!:number

  // 产品类型所有属性数据源
  productType = {} as ApiResponse.ProductType

  groups:Groups = []

  // 为groups每一项元素添加value属性
  addValueField (groups:Groups) {
    return groups.map(group => {
      let value
      if (this.isComment(group)) {
        value = ''
      } else if (group.type === 'radio_group') {
        value = []
      } else {
        value = []
      }
      return Object.assign({}, group, {value})
    })
  }

  isComment (item:ApiResponse.AttributeGroupData) {
    return item.type === 'text' || item.type==='textarea' || item.type==='toggle'
  }

  // 实现v-model双向绑定，把需要提交表单的数据传给外部组件
  @Watch('attributes')
  onAttributesChange (val:any) {
    this.$emit('input', val)
  }

  // 监听产品类型变化改变
  @Watch('productTypeId')
  async onProductTypeIdChange (id:number) {
    if (id === 0) {
      this.productType = {} as ApiResponse.ProductType
      this.groups = []
      return
    }
    this.productType = await ProductType.getInstance.with(['attributeGroups.values']).show({id})
    const groups = this.productType.data.attributeGroups
    this.groups = groups ? this.addValueField(groups.data.sort((a, b) => +a.variant - +b.variant)) : []
  }

  get attributes () {
    const paserValue = (value:string|boolean|ApiResponse.AttributeData[]) => _.isString(value) || _.isBoolean(value) ? {comment: value} : {attribute_id: (Array.prototype.concat.apply([], [value])).map((attr:ApiResponse.AttributeData) => attr.id)}
    return this.groups.map(item => (
      {
        'attribute_group_id': item.id,
        ...paserValue(item.value)
      }
    ))
  }

  // 计算变体属性
  get cartesian () {
    const flatten = (arr:any) => [].concat.apply([], arr)
    const formData = this.groups.filter(group => group.variant)
    if (formData.length === 0 || formData.some(item => item.value.length===0)) return []
    // [...element, {group_name: attr.item.name, group_id: attr.item.id, value_id: value.id, value_name: value.value}]
    return formData.reduce((acc, set) =>
      flatten(acc.map((x:any) => set.value.map((y:ApiResponse.AttributeData) => [ ...x,
        {group_name: set.name, group_id: set.id, value_id: y.id, value_name: y.value}
      ]))), [[]])
  }

  get skuTableSchema () {
    const base = {sku: '', price: 0}
    return this.cartesian.map((item:any) => ({attributes: item, ...base, key: (item.map((attr:any) => attr.value_name)).join('')}))
  }
}
</script>
