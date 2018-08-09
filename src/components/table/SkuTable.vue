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
      <template slot="items" slot-scope="props">

        <td class="text-xs-left" v-for="attribute in props.item.attributes" :key="attribute.group_name+ '' +attribute.value_name">{{ attribute.value_name }}</td>
        <td v-if="readonly || disabled">{{ props.item.sku }}</td>
        <td v-else>
          <v-edit-dialog
            :return-value.sync="props.item.sku"
            lazy
            @save="save(props.item)"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.sku }}
            <v-text-field
              :readonly="readonly"
              :disabled="disabled"
              slot="input"
              v-validate="{required:true,stringUnique:skuList}"
              :error-messages="errors.collect(props.item.key)"
              :name="props.item.key"
              v-model="props.item.sku"
              :rules="[max25chars]"
              placeholder="请输入商品sku码"
              label="Edit"
              single-line
              @input="v=>verifySkuCodeUnique(v,props.item)"
            ></v-text-field>
          </v-edit-dialog>
        </td>

        <td v-if="readonly || disabled">{{ props.item.price }}</td>
        <td v-else>
          <v-edit-dialog
            :return-value.sync="props.item.price"
            lazy
            @save="save(props.item)"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.price }}
            <v-text-field
              :readonly="readonly"
              :disabled="disabled"
              slot="input"
              v-model="props.item.price"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
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
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator'

interface Attribute {
  'group_id':number;
  'group_name':string;
  'value_id':number;
  'value_name':string;
}
interface Item {
  attributes: Attribute[];
  sku: string;
  price: number;
  key: string
}
type CacheValue = {sku:string, price:number}

@Component
export default class SkuTable extends Vue {
  @Model('input', {type: Array, default: () => []}) value!:Item[]

  @Prop(Array) items!:Item[]

  @Prop({type: Boolean, default: false}) disabled!:boolean

  @Prop({type: Boolean, default: false}) readonly!:boolean

  snack= false;
  snackColor= '';
  snackText= '';
  max25chars= (v:any) => v.length <= 25 || 'Input too long!';
  stringUnique = (v:string) => !this.skuList.includes(v) || 'sku code must be unique'
  pagination= {};
  // headers= [
  //   {text: 'Calories', value: 'calories'},
  //   {text: 'Fat (g)', value: 'fat'},
  //   {text: 'Carbs (g)', value: 'carbs'},
  //   {text: 'Protein (g)', value: 'protein'},
  //   {text: 'Iron (%)', value: 'iron'}
  // ]
  cacheInputData:Map<string, CacheValue> = new Map()

  @Watch('items', {deep:true})
  onItemsChange (v:Item[]) {
    v.forEach(item => {
      if (this.getCache(item.key)) {
        item.sku = (this.getCache(item.key) as CacheValue).sku
        item.price = (this.getCache(item.key) as CacheValue).price
      }
    })
  }

  verifySkuCodeUnique (v:string, item:Item) {
    const attrs = this.value.filter(el => el!==item)
    let error = attrs.some(attr => attr.sku === v)
    const field = this.$validator.fields.find({name: item.key})
    if (error) {
      this.$validator.errors.add({id: field.id, field: item.key, msg: 'sku必须唯一'})
    }
  }

  save (item:Item) {
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
    return this.value.map(item => item.sku)
  }
}
</script>

<style scoped>
.v-menu__content{
  background: white;
}
</style>
