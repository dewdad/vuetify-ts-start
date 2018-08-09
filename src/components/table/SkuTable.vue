<template>
  <div>
    <!-- <v-layout>
      <v-flex>
        <v-btn color="info">填充</v-btn>
      </v-flex>
    </v-layout> -->
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
          <!-- <v-edit-dialog
            :return-value.sync="item.sku"
            lazy
            @save="save(item)"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ item.sku }} -->
            <v-text-field
              :readonly="readonly"
              :disabled="disabled"
              v-validate="{required:true,skuUnique:value}"
              :error-messages="errors.collect(item.key+'sku')"
              :name="item.key+'sku'"
              :value="item.sku"
              placeholder="请输入商品sku码"
              label="Edit"
              single-line
              @input="v=>onInputChange(v,item,index,'sku')"
            ></v-text-field>
          <!-- </v-edit-dialog> -->
        </td>

        <td v-if="readonly || disabled">{{ item.price }}</td>
        <td v-else>
          <!-- <v-edit-dialog
            :return-value.sync="item.price"
            lazy
            @save="save(item)"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ item.price }} -->
            <v-text-field
              :readonly="readonly"
              :disabled="disabled"

              v-validate="{required:true}"
              :error-messages="errors.collect(item.key+'price')"
              :name="item.key+'price'"

              :value="item.price"
              label="Edit"
              single-line
              @input="v=>onInputChange(v,item,index,'price')"
            ></v-text-field>
          <!-- </v-edit-dialog> -->
        </td>

      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Model, Mixins } from 'vue-property-decorator'
import BaseForm from '@/components/form/mixins/BaseForm'

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
type CacheValue = {sku:string, price:number}

@Component
export default class SkuTable extends Mixins(BaseForm) {
  @Model('input', {type: Array, default: () => []}) value!:SkuTableItem[]

  @Prop(Array) items!:SkuTableItem[]

  @Prop({type: Boolean, default: false}) disabled!:boolean

  @Prop({type: Boolean, default: false}) readonly!:boolean

  snack= false;
  snackColor= '';
  snackText= '';
  max25chars= (v:any) => v.length <= 25 || 'Input too long!';
  pagination= {};
  // headers= [
  //   {text: 'Calories', value: 'calories'},
  //   {text: 'Fat (g)', value: 'fat'},
  //   {text: 'Carbs (g)', value: 'carbs'},
  //   {text: 'Protein (g)', value: 'protein'},
  //   {text: 'Iron (%)', value: 'iron'}
  // ]
  cacheInputData:Map<string, CacheValue> = new Map()

  @Watch('value', {deep:true})
  onItemsChange (v:SkuTableItem[]) {
    v.forEach(item => {
      if (this.getCache(item.key)) {
        item.sku = (this.getCache(item.key) as CacheValue).sku
        item.price = (this.getCache(item.key) as CacheValue).price
      }
    })
  }

  verifySkuCodeUnique (v:string, item:SkuTableItem) {
    const attrs = this.value.filter(el => el!==item)
    let error = attrs.some(attr => attr.sku === v)
    const field = this.$validator.fields.find({name: item.key})
    if (error) {
      this.$validator.errors.add({id: field.id, field: item.key, msg: 'sku必须唯一'})
    }
  }

  onInputChange (value:string, item:SkuTableItem, index:number, field:keyof SkuTableItem) {
    this.$emit('input', {value, index, field, item})
  }

  save (item:SkuTableItem) {
    const {key, sku, price, ...arg} = item
    this.setCache(key, {sku, price})
    this.snack = true
    this.snackColor = 'success'
    this.snackText = '数据填充完成'
  }
  cancel () {
    // this.snack = true
    // this.snackColor = 'error'
    // this.snackText = 'Canceled'
  }
  open () {
    // this.snack = true
    // this.snackColor = 'info'
    // this.snackText = 'Dialog opened'
  }
  close () {
    // console.log('Dialog closed')
  }

  setCache (key:string, val:CacheValue) {
    this.cacheInputData.set(key, val)
  }

  getCache (key:string) {
    return this.cacheInputData.has(key) ? this.cacheInputData.get(key) : null
  }

  get headers () {
    let col = _.head(this.value)
    if (col) {
      return [ ...col.attributes.map((item:any) => ({text: item.group_name, value: 'value_name'})),
        {text: 'SKU码', value: 'sku'},
        {text: '价格', value: 'price'}
      ]
    }
    return []
  }

  get skuList () {
    return this.value
  }
}
</script>

<style scoped>
.v-menu__content{
  background: white;
}
</style>
