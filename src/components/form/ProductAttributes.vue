<template>
  <v-layout row
            wrap
            v-if="loaded">
    <v-flex xs12>
      <template v-for="item in items">
        <!-- select -->
        <v-card :key="item.id"
                v-if="item.type === 'select'"
                flat
                tile>
          <v-card-text>
            <v-select :items="item.values"
                      :label="item.name"
                      item-text="value"
                      item-value="id"
                      :disabled="disabled"
                      :readonly="readonly"
                      v-model="formData[item.id].value"></v-select>
          </v-card-text>
        </v-card>

        <!-- text -->
        <v-card :key="item.id"
                v-if="item.type === 'text'"
                flat
                tile>

          <v-card-text>
            <v-text-field :label="item.name"
                          :disabled="disabled"
                          :readonly="readonly"
                          v-model="formData[item.id].value"></v-text-field>
          </v-card-text>
        </v-card>

        <!-- checkbox_group -->
        <v-card :key="item.id"
                flat
                tile
                v-if="item.type === 'checkbox_group'">
          <v-card-title primary-title>{{item.name}}</v-card-title>

          <v-card-text>
            <v-layout row
                      wrap>
              <v-flex xs6
                      sm3
                      md3
                      v-for="attribute in item.values"
                      :key="attribute.id">
                <v-checkbox v-model="formData[item.id].value"
                            :disabled="disabled"
                            :readonly="readonly"
                            :label="attribute.value"
                            :value="attribute">
                </v-checkbox>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>

        </v-card>

        <!-- textarea -->
        <v-card v-if="item.type === 'textarea'"
                :key="item.id"
                flat
                tile>
          <v-card-text>
            <v-textarea :label="item.name"
                        hint="Hint text"
                        :disabled="disabled"
                        :readonly="readonly"
                        v-model="formData[item.id].value"></v-textarea>
          </v-card-text>
        </v-card>

        <!-- radio_group -->
        <v-card flat
                tile
                v-if="item.type === 'radio_group'"
                :key="item.id">
          <!-- <v-card-title>{{item.name}}</v-card-title> -->
          <v-card-text>
            <v-radio-group :label="item.name"
                           :mandatory="false"
                           :disabled="disabled"
                           :readonly="readonly"
                           v-model="formData[item.id].value">
              <v-radio v-for="attribute in item.values"
                       :key="attribute.id"
                       :label="attribute.value"
                       :value="attribute"></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- toggle -->
        <v-card flat
                tile
                v-if="item.type === 'toggle'"
                :key="item.id">
          <v-card-text>
            <v-switch :label="item.name"
                      :disabled="disabled"
                      :readonly="readonly"
                      v-model="formData[item.id].value"></v-switch>
          </v-card-text>
        </v-card>

      </template>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { AttributeGroupItem } from '@/store/modules/attributeGroup'
import { AttributeItem } from '@/store/modules/attribute'
interface Item extends AttributeGroupItem{
  values:AttributeItem[]
}
@Component
export default class ProductAttributes extends Vue {
  @Prop(Array)
  items!:Item[]

  @Prop({type: Boolean, default: false})
  sku!:boolean

  @Prop(Array)
  orginFormData!:any[]

  @Prop({type: Boolean, default: false})
  disabled!:boolean

  @Prop({type: Boolean, default: false})
  readonly!:boolean

  orginData:any = []

  loaded = false
  formData:{[propName:string]:any} = {}

  variantAttribute:any[] = []

  genFormData () {
    this.formData = _.reduce(this.items, (res:any, item, index) => {
      if (this.isComment(item)) {
        res[item.id] = {value: _.get(this.orginData, `${[index]}.0.value`, ''), item}
      } else if (item.type === 'radio_group') {
        res[item.id] = {value: {}, item}
      } else {
        res[item.id] = {value: _.get(this.orginData, `${[index]}`, []), item}
      }
      return res
    }, {})
    this.onFormDataChanged()
  }

  // @Watch('formData', {immediate: true, deep: true})
  // onFormDataChanged () {
  //   if (this.sku) {
  //     this.$emit('change', this.cartesian)
  //   }
  // }

  addRadioGroupDefaultValue (item:Item) {
    return _.cloneDeep(item.values).unshift()
  }

  isComment (item:Item) {
    return item.type === 'text' || item.type==='textarea' || item.type==='toggle'
  }

  isAdd (item:AttributeItem, arr:number[]) {
    return arr.indexOf(item.id) !== -1
  }

  get attributes () {
    return Object.values(this.formData).map(item => {
      let values:any = null
      if (_.isString(item.value)) {
        values = {comment: item.value}
      }
      if (_.isObject(item.vaule)) {
        values = _.has(item.value, 'id') ? {attribute_id: [item.value.id]} : []
      }
      if (_.isArray(item.value)) {
        values = {attribute_id: item.value.map((attr:AttributeItem) => attr.id)}
      }
      return {
        'attribute_group_id': item.item.id,
        ...values
      }
    })
  }

  groupByGroupId () {
    const collect = _.groupBy(this.orginFormData, 'attribute_group_id')
    this.orginData = Object.values(collect).map(item => item.map(attr => attr.value))
  }

  flatten (arr:any[]) {
    return [].concat.apply([], arr)
  }

  get cartesian () {
    // [...element, {group_name: attr.item.name, group_id: attr.item.id, value_id: value.id, value_name: value.value}]
    return this.sku ? Object.values(this.formData).reduce((acc, set) =>
      this.flatten(acc.map((x:any) => set.value.map((y:AttributeItem) => [ ...x,
        {group_name: set.item.name, group_id: set.item.id, value_id: y.id, value_name: y.value}
      ]))), [[]]) : []
  }

  onFormDataChanged () {
    this.$emit('change', this.cartesian)
  }

  mounted () {
    this.$nextTick(() => {
      if (this.orginFormData) {
        this.groupByGroupId()
      }
      this.genFormData()

      this.loaded = true

      if (this.sku) {
        this.$watch('formData', this.onFormDataChanged, {deep: true})
      }
    })
  }
}
</script>
