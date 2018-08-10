<template>
  <!-- <v-container fluid v-show="productTypeId!==0"> -->
  <div v-show="productTypeId!==0">
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
    <sku-table class="mt-3" v-show="skuTableSchema.length>0" v-model="skuTableSchema"></sku-table>
    </div>
  <!-- </v-container> -->
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Model, Mixins } from 'vue-property-decorator'
import { ProductType } from '@/store/modules/productType'
import { SkuTableSchemaChangeParams, SkuTableItem } from '@/components/table/SkuTable.vue'
import { Validator } from 'vee-validate'
import InjectValidator from '@/components/form/mixins/InjectValidator'

type Groups = Array<ApiResponse.AttributeGroupData & {value?:any}>
export interface CreateProductAttributeParams{
  attributes:Array<AttributesParams>;
  variants:Array<VariantsParams>;
}

interface AttributesParams{
  'attribute_group_id':number;
  comment?:string;
  'attribute_id'?:Array<number>
}

interface VariantsParams{
  sku:string;
  price:number;
  stock?:number;
  attributes:Array<number>;
  info?:InfoParams;
}

interface InfoParams{
  'length_value':number;
  'length_unit':'MM';
  'height_value':number;
  'height_unit':'MM';
  'width_value':number;
  'width_unit':'MM';
  'weight_value':number;
  'weight_unit':'GR';
  'package_length_value':number;
  'package_length_unit':'MM'
  'package_height_value':number;
  'package_height_unit':'MM';
  'package_width_value':number;
  'package_width_unit':'MM';
  'package_weight_value':number;
  'package_weight_unit':'GR';
}

interface CacheItem{
  value:AttributesParams;
  productType:ApiResponse.ProductType;
  groups:Groups;
}

@Component({
  components:{
  'sku-table':()=>import('@/components/table/SkuTable.vue')
  }
  })
export default class ProductAttributes extends Mixins(InjectValidator) {
  @Model('input', {type: Array, default: () => []}) value!:AttributesParams[]

  @Prop({type: Boolean, default: false})
  disabled!:boolean

  @Prop({type: Boolean, default: false})
  readonly!:boolean

  // 产品类型id
  @Prop({type: Number, required: true}) productTypeId!:number

  // 产品类型所有属性数据源
  productType = {} as ApiResponse.ProductType

  // 属性组
  groups:Groups = []

  // 缓存用户对应产品分类下的数据
  cacheProductTypeOption:Map<string, CacheItem> = new Map()

  alreadyed = false
  // 设置缓存
  setCache (key:string, payload:CacheItem) {
    this.cacheProductTypeOption.set(key, payload)
  }

  // 获取缓存
  getCache (key:string) {
    return this.cacheProductTypeOption.has(key) ? this.cacheProductTypeOption.get(key) : false
  }
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

  setAttributeData (attributes:any) {
    const groups = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.alreadyed) {
          return resolve(this.groups)
        }
      }, 300)
    })
    groups.then((res:any) => {
      const groupBy = attributes.data.reduce((rrs:any, item:any) => {
        if (!rrs[item.attribute_group_id]) {
          rrs[item.attribute_group_id] = []
        }
        const value = item.comment || item.value.data
        rrs[item.attribute_group_id].push(value)
        return rrs
      }, {})
      this.groups = res.map((attr:any) => {
        if (groupBy[attr.id]) {
          const val = _.isString(_.head(groupBy[attr.id])) ?groupBy[attr.id][0] : groupBy[attr.id]
          attr.value = val
        }
        return attr
      })
    })
  }

  isComment (item:ApiResponse.AttributeGroupData) {
    return item.type === 'text' || item.type==='textarea' || item.type==='toggle'
  }

  // 实现v-model双向绑定，把需要提交表单的数据传给外部组件
  @Watch('attributes')
  onAttributesChange (attributes:AttributesParams) {
    this.$emit('input', attributes)
    this.setCache(String(this.productTypeId), {value: attributes, productType: this.productType, groups: this.groups})
  }

  // 监听产品类型变化改变
  @Watch('productTypeId')
  async onProductTypeIdChange (id:number) {
    if (id === 0 && !_.isNumber(id)) {
      this.productType = {} as ApiResponse.ProductType
      this.groups = []
      return
    }
    const cache = this.getCache(String(id))
    if (!cache) {
      this.productType = await ProductType.getInstance.with(['attributeGroups.values']).show({id})
      const groups = this.productType.data.attributeGroups
      this.groups = groups ? this.addValueField(groups.data.sort((a, b) => +a.variant - +b.variant)) : []
      this.alreadyed = true
    }
    if (cache) {
      this.productType = cache.productType
      this.groups = cache.groups
      this.$emit('input', cache.value)
    }
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

  set skuTableSchema ({value, item, index, field}:SkuTableSchemaChangeParams) {
    (this.skuTableSchema as any)[index][field] = value
  }

  get variants () {
    // const sku = <any>this.skuTableSchema
    // return sku.map((item:any) => {
    //     let {price, sku, attributes} = item

    //     attributes = attributes.map((attr:any) => attr.value_id)

    //     return {price, sku, attributes}
    //   })
  }
}
</script>
