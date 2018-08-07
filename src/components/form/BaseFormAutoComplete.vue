<template>
  <v-combobox

    :filter="filter"
    :hide-no-data="!search"
    :items="items"
    :search-input.sync="search"
    hide-selected
    @change="change"
    multiple
    small-chips

    v-validate="propField.rule"
    :error-messages="errors.first(propField.name || propField.field)"
    :name="propField.name || propField.field"
    :value="model"
    v-bind="filterFieldAttrs"
  >
    <template slot="no-data">
      <v-list-tile>
        <span class="subheading">Create</span>
        <v-chip
          :color="`${colors[nonce - 1]} lighten-3`"
          label
          small
        >
          {{ search }}
        </v-chip>
      </v-list-tile>
    </template>
    <template
      v-if="item === Object(item)"
      slot="selection"
      slot-scope="{ item, parent, selected }"
    >
      <v-chip
        :color="`${colors[randomNum()]} lighten-3`"
        :selected="selected"
        label
        small
      >
        <span class="pr-2">
          {{ item.value }}
        </span>
        <v-icon
          small
          @click="parent.selectItem(item)"
        >close</v-icon>
      </v-chip>
    </template>
    <template
      slot="item"
      slot-scope="{ index, item, parent }"
    >
      <v-list-tile-content>
        <v-text-field
          v-if="editing === item"
          v-model="editing.value"
          autofocus
          flat
          background-color="transparent"
          hide-details
          solo
          @keyup.enter="edit(index, item)"
        ></v-text-field>
        <v-chip
          v-else
          :color="`${colors[randomNum()]} lighten-3`"
          dark
          label
          small
        >
          {{ item.value }}
        </v-chip>
      </v-list-tile-content>
      <v-spacer></v-spacer>
      <v-list-tile-action @click.stop>
        <v-btn
          icon
          @click.stop.prevent="edit(index, item)"
        >
          <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
        </v-btn>
      </v-list-tile-action>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Model } from 'vue-property-decorator'
import { Pagination } from '@/store/modules/app'
interface Item{
  id?:number;
  color?:string;
  value:string;
}
@Component
export default class AutoComplete extends Vue {
  @Prop(Object) propField!:FormInterface.Field

  @Prop({type: Boolean, default: false}) loading!:boolean

  loaded = false

  items:Item[] = []

  search:string|null = null

  pagination:Pagination|null = null;

  editing = null

  activator = null

  attach = null

  colors = ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange']

  index = -1

  nonce = 1

  menu = false

  x = 0

  y = 0

  @Model('input') model!:any

  @Prop(Function)
  searchAction!:()=>Promise<any>

  @Watch('propField.loading')
  onLoadingChange (val:boolean) {
    if (!this.loaded && !val) {
      this.loaded = true
      this.items = this.model
    }
  }

  @Watch('model')
  onModelChange (val:Item[], prev:Item[]) {
    if (val.length === prev.length) return

    const model = val.reduce((res:Item[], v) => {
      if (typeof v === 'string') {
        const hasItem = this.items.find(item => item.value === v)
        if (!hasItem) {
          // 列表中不存在
          const attribute:Item = {value: v}
          res.push(attribute)
          this.items.push(attribute)
        } else {
          res.push(hasItem)
        }
      } else {
        res.push(v)
      }
      return res
    }, [])
    this.change(model)
  }

  change (e:Item[]) {
    this.$emit('input', e)
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

  filter (item:any, queryText:string, itemText:string) {
    if (item.header) return false

    const hasValue = (val:string) => val != null ? val : ''

    const text = hasValue(itemText)
    const query = hasValue(queryText)

    return text.toString()
      .toLowerCase()
      .indexOf(query.toString().toLowerCase()) > -1
  }

  randomNum () {
    return _.random(5)
  }

  get filterFieldAttrs () {
    _.set(this.propField, 'loading', _.get(this.propField, 'loading', this.loading))
    const {fieldType, props, value, itemEvent, ...arg} = this.propField
    return {...props, ...arg}
  }

  get listeners () {
    const {itemEvent} = this.propField
    return itemEvent
  }
}
</script>
