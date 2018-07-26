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
                      v-model="formData[item.id].value"></v-switch>
          </v-card-text>
        </v-card>

      </template>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import { AttributeGroupItem } from '@/store/modules/attributeGroup'
import { AttributeItem } from '@/store/modules/attribute'
interface Item extends AttributeGroupItem{
  values:AttributeItem[]
}
@Component
export default class ProductAttributes extends Vue {
  @Prop(Array)
  items!:Item[]
  loaded = false
  formData:{[propName:string]:any} = {}

  variantAttribute:any[] = []

  genFormData () {
    this.formData = _.reduce(this.items, (res:any, item) => {
      if (this.isComment(item)) {
        res[item.id] = {value: '', item}
      } else if (item.type === 'radio_group') {
        res[item.id] = {value: {}, item}
      } else {
        res[item.id] = {value: [], item}
      }
      return res
    }, {})
  }

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
      let values = _.isString(item.value) ? {comment: item.value} : {attribute_id: _.isObject(item.value) ? (_.has(item.value, 'id') ? [item.value.id] :[ ]) : item.value.map((attr:AttributeItem) => attr.id)}
      return {
        'attribute_group_id': item.item.id,
        ...values
      }
    })
  }

  flatten (arr:any[]) {
    return [].concat.apply([], arr)
  }

  get cartesian () {
    // [...element, {group_name: attr.item.name, group_id: attr.item.id, value_id: value.id, value_name: value.value}]
    return Object.values(this.formData).reduce((acc, set) =>
      this.flatten(acc.map((x:any) => set.value.map((y:AttributeItem) => [ ...x,
        {group_name: set.item.name, group_id: set.item.id, value_id: y.id, value_name: y.value}
      ]))), [[]])
  }

  mounted () {
    this.$nextTick(() => {
      this.genFormData()
      this.loaded =true
    })
  }
}
</script>
