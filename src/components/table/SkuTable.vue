<template>

    <v-data-table
      :headers="headers"
      :items="value"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="{item,index}">

        <td class="text-xs-left" v-for="attribute in item.attributes" :key="attribute.group_name+ '' +attribute.value_name">{{ attribute.value_name }}</td>
        <td v-if="readonly || disabled">{{ item.sku }}</td>
        <td v-else>
            <v-text-field
              :readonly="readonly"
              :disabled="disabled"
              v-validate="{required:true,skuUnique:value,max:60}"
              :error-messages="errors.collect(item.key+'sku')"
              :name="item.key+'sku'"
              :value="item.sku"
              placeholder="请输入商品sku码"
              label="SKU码"
              single-line

              @input="v=>onInputChange(v,item,index,'sku')"
            ></v-text-field>
        </td>

        <td v-if="readonly || disabled">{{ item.price }}</td>
        <td v-else>
            <v-text-field
              :readonly="readonly"
              :disabled="disabled"

              v-validate="{required:true,decimal:2}"
              :error-messages="errors.collect(item.key+'price')"
              :name="item.key+'price'"

              prefix="￥"

              type="number"
              :value="+item.price"
              label="变体价格"
              single-line
              @input="v=>onInputChange(v,item,index,'price')"
            ></v-text-field>
        </td>

      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Model, Mixins } from 'vue-property-decorator'
import InjectValidator from '@/components/form/mixins/InjectValidator'

interface Attribute {
  'group_id':number;
  'group_name':string;
  'value_id':number;
  'value_name':string;
}
export interface SkuTableItem {
  attributes: Attribute[];
  sku: string;
  price: number;
  key: string
}

export interface SkuTableSchemaChangeParams{
  value:string|number;
  item:SkuTableItem;
  index:number;
  field:keyof SkuTableItem;
}

@Component
export default class SkuTable extends Mixins(InjectValidator) {
  @Model('input', {type: Array, default: () => []}) value!:SkuTableItem[]

  @Prop({type: Boolean, default: false}) disabled!:boolean

  @Prop({type: Boolean, default: false}) readonly!:boolean

  onInputChange (value:string|number, item:SkuTableItem, index:number, field:keyof SkuTableItem) {
    if (field==='price') { value = +value }
    const val = _.cloneDeep(this.value)
    val[index][field] = value
    this.$emit('input', val)
    this.$emit('cache-sku-item', {key: item.key, attr: val[index]})
  }

  get headers () {
    let col = _.head(this.value)
    if (col) {
      return [ ...col.attributes.map((item:any) => ({text: item.group_name, value: 'value_name'})),
        {text: 'SKU码', value: 'sku', width: '40%'},
        {text: '价格', value: 'price', width: '20%'}
      ]
    }
    return []
  }
}
</script>

<style scoped>
.v-menu__content{
  background: white;
}
</style>
