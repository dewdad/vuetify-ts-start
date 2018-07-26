<template>
  <v-container v-if="loaded">
    <v-layout row
              wrap>
      <v-flex xs12>
        <template v-for="item in items">
          <!-- select -->
          <v-select :key="item.id"
                    v-if="item.type === 'select'"
                    :items="item.values"
                    :label="item.name"
                    item-text="value"
                    item-value="id"
                    @change="formItemChange(item)"
                    v-model="formData[item.id]"></v-select>
          <!-- text -->
          <v-text-field :key="item.id"
                        v-if="item.type === 'text'"
                        :label="item.name"
                        @change="formItemChange(item)"
                        v-model="formData[item.id]"></v-text-field>
          <!-- checkbox_group -->
          <v-container fluid
                       :key="item.id"
                       v-if="item.type === 'checkbox_group'">
            <v-layout row
                      wrap>
              {{item.name}}
              <v-flex xs6
                      sm3
                      md3
                      v-for="attribute in item.values"
                      :key="attribute.id">
                <v-checkbox v-model="formData[item.id]"
                            :label="attribute.value"
                            @change="formItemChange(item,attribute)"
                            :value="attribute.id"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
          <!-- textarea -->
          <v-textarea v-if="item.type === 'textarea'"
                      :key="item.id"
                      :label="item.name"
                      hint="Hint text"
                      @change="formItemChange(item)"
                      v-model="formData[item.id]"></v-textarea>
          <!-- radio_group -->
          <v-radio-group v-if="item.type === 'radio_group'"
                         :key="item.id"
                         :label="item.name"
                         @change="formItemChange(item)"
                         v-model="formData[item.id]">
            <v-radio v-for="attribute in item.values"
                     :key="attribute.id"
                     :label="attribute.value"
                     :value="attribute.id"></v-radio>
          </v-radio-group>
          <!-- toggle -->
          <v-switch v-if="item.type === 'toggle'"
                    :key="item.id"
                    :label="item.name"
                    @change="formItemChange(item)"
                    v-model="formData[item.id]"></v-switch>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
interface Item{
  'can_upload':boolean;
  'created_at'?:string;
  customized?:boolean;
  id:number;
  name:string;
  required:boolean;
  type:string;
  'updated_at'?:string;
  variant:boolean;
  values:Value[];
}

interface Value{
  'created_at?':string;
  'group_id':number;
  id:number;
  'updated_at'?:string;
  value:string;
  variant:boolean
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
        res[item.id] = ''
      } else {
        res[item.id] = []
      }
      return res
    }, {})
  }

  isComment (item:Item) {
    return item.type === 'text' || item.type==='textarea' || item.type==='toggle'
  }

  isAdd (item?:Value, array:number[]) {
    return (array as any).includes(item.id)
  }

  formItemChange (item:Item, attribute?:Value) {
    if (item.variant) {
      console.log(attribute)
      console.log(this.formData[item.id])
      console.log(this.isAdd(attribute, this.formData[item.id]))
      if (!this.isComment(item)) {
        const attrIds = this.formData[item.id]
        let variantAttr = this.variantAttribute.find(attr => attr.id === item.id)
        if (attrIds.length>0) {
          if (variantAttr) {
            attrIds.forEach((attributes:Value) => {
              console.log(variantAttr.attributes.includes(attributes))
              variantAttr.attributes.includes(attributes) || variantAttr.attributes.push(attribute)
            })
          } else {
            this.variantAttribute.push({id: item.id, name: item.name, attributes: [attribute]})
          }
        } else {
          if (variantAttr) {
            this.variantAttribute = this.variantAttribute.filter(item => item!==variantAttr)
          }
        }
        /*
          [
            {id:1,name:颜色,attributes:[

            ]}
          ]
        */
      }
    }
  }
  mounted () {
    this.$nextTick(() => {
      // 销售属性放在数组最后
      this.items.sort(item => +item.variant)
      this.genFormData()
      this.loaded =true
    })
  }
}
</script>
