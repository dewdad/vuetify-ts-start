<template>
  <form-item-card name="属性值">
    <v-combobox v-model="model"
                :filter="filter"
                :hide-no-data="!search"
                :items="items"
                :search-input.sync="search"
                hide-selected
                label="添加或修改包含属性值"
                multiple
                small-chips
                :disabled="disabled"
                solo>
      <template slot="no-data">
        <v-list-tile>
          <span class="subheading">Create</span>
          <v-chip :color="`${colors[randomNum()]} lighten-3`"
                  label
                  small>
            {{ search }}
          </v-chip>
        </v-list-tile>
      </template>
      <template v-if="item === Object(item)"
                slot="selection"
                slot-scope="{ item,index, parent, selected }">
        <v-chip :color="`${item.color} lighten-3`"
                :selected="selected"
                label
                small>
          <span class="pr-2">
            {{ item.text }}
          </span>
          <v-icon v-if="!disabled"
                  small
                  @click="parent.selectItem(item)">close</v-icon>
        </v-chip>
      </template>
      <template slot="item"
                slot-scope="{ index, item, parent }">
        <v-list-tile-content>
          <v-text-field v-if="editing === item"
                        v-model="editing.text"
                        autofocus
                        flat
                        background-color="transparent"
                        hide-details
                        solo
                        @keyup.enter="edit(index, item)"></v-text-field>
          <v-chip v-else
                  :color="`${item.color} lighten-3`"
                  dark
                  label
                  small>
            {{ item.text }}
          </v-chip>
        </v-list-tile-content>
        <v-spacer></v-spacer>
        <v-list-tile-action @click.stop>
          <v-btn icon
                 @click.stop.prevent="edit(index, item)">
            <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
          </v-btn>
        </v-list-tile-action>
      </template>
    </v-combobox>
  </form-item-card>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from 'vue-property-decorator'
import { AttributeItem } from '@/store/modules/attribute'
import FormItemCard from '@/components/card/FormItemCard.vue'
import InjectValidator from '@/components/form/mixins/InjectValidator'

interface Item{
  id?:number;
  text:string;
  color?:string;
}
@Component({
  components:{
  'form-item-card':FormItemCard
  }
  })
export default class AttributeForm extends Mixins(InjectValidator) {
  @Prop(Array) orginFormData!:AttributeItem[]
  @Prop(Boolean) disabled!:boolean
  activator= null
  attach= null
  colors= ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange']
  editing= null
  index= -1
  items:Array<Item|{header:string}>= [
    { header: 'Select an option or create one' }
  ]
  menu= false
  model:Array<Item>= []
  x= 0
  search:string|null= null
  y= 0

  @Watch('model')
  onModelChange (val:Item[], prev:Item[]) {
    if (val.length === prev.length) return

    this.model = val.reduce((res:Item[], v) => {
      if (typeof v === 'string') {
        const hasItem = this.items.find(item => (item as Item).text === v)
        if (!hasItem) {
          // 列表中不存在
          const attribute:Item = {text: v, color: this.colors[_.random(5)]}
          res.push(attribute)
          this.items.push(attribute)
        } else {
          res.push((hasItem as Item))
        }
      } else {
        res.push(v)
      }
      return res
    }, [])
  }

  clear () {
    this.init()
  }

  init () {
    this.items = [
      { header: 'Select an option or create one' }
    ]
    if (this.orginFormData) {
      this.model = this.orginFormData.map(item => {
        const attribute = {
          text: item.value,
          id: item.id,
          color: this.colors[_.random(5)]
        }
        this.items.push(attribute)
        return attribute
      })
    } else {
      this.model = []
    }
  }

  edit (index:number, item:any) {
    if (!this.editing) {
      this.editing = item
      this.index = index
    } else {
      this.editing = null
      this.index = -1
    }
  }

  get getAttributes () {
    return this.model.map(item => {
      const {color, text, ...arg} = item
      return {value: text, ...arg}
    })
  }

  filter (item:any, queryText:any, itemText:any) {
    if (item.header) return false

    const hasValue = (val:any) => val != null ? val : ''

    const text = hasValue(itemText)
    const query = hasValue(queryText)

    return text.toString()
      .toLowerCase()
      .indexOf(query.toString().toLowerCase()) > -1
  }

  randomNum () {
    return _.random(5)
  }

  created () {
    this.init()
  }
}
</script>
