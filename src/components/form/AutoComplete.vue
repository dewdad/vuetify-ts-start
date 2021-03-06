<template>
  <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      :disabled="disabled"
      :readonly="readonly"
      chips
      :clearable="clearable"
      hide-details
      hide-selected
      item-text="name"
      item-value="id"
      :label="label"
      solo
      @change="change"
    >
      <template slot="no-data">
        <v-list-tile>
          <v-list-tile-title>
            {{label}}
            <strong>{{labelName}}</strong>
          </v-list-tile-title>
        </v-list-tile>
      </template>
      <template
        slot="selection"
        slot-scope="{ item, selected }"
      >
        <v-chip
          :selected="selected"
          color="blue-grey"
          class="white--text"
        >
          <v-icon left>mdi-coin</v-icon>
          <span v-text="item.name"></span>
        </v-chip>
      </template>
      <template
        slot="item"
        slot-scope="{ item, tile }"
      >
        <v-list-tile-avatar
          color="indigo"
          class="headline font-weight-light white--text"
        >
          {{ item.name.charAt(0) }}
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.name"></v-list-tile-title>
          <!-- <v-list-tile-sub-title v-text="item.symbol"></v-list-tile-sub-title> -->
        </v-list-tile-content>
        <!-- <v-list-tile-action>
          <v-icon>mdi-coin</v-icon>
        </v-list-tile-action> -->
      </template>
    </v-autocomplete>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from 'vue-property-decorator'
import { Pagination } from '@/store/modules/app'
import InjectValidator from '@/components/form/mixins/InjectValidator'

@Component
export default class AutoComplete extends Mixins(InjectValidator) {
  isLoading = false
  items:any[] = []
  model:number|null = null
  search:string|null = null
  pagination:Pagination|null = null;

  @Prop({default: '请搜索', type: String})
  label!:string

  @Prop({default: '类型', type: String})
  labelName!:string

  @Prop(Function)
  searchAction!:()=>Promise<any>

  @Prop(Number)
  defaultType!:number

  @Prop({type: Boolean, default: false})
  readonly!:boolean

  @Prop({type: Boolean, default: false})
  disabled!:boolean

  @Watch('search')
  async onSearchChange (val:string|null) {
    // Items have already been loaded
    if (this.items.length > 0) return

    this.isLoading = true

    if (!this.searchAction) {
      this.isLoading = false
      return
    }
    // Lazily load input itemps
    let {data, meta} = await this.searchAction()
    this.items = data
    this.pagination = meta.pagination
    this.isLoading = false
  }

  change () {
    this.$emit('change', this.model)
  }
  get getSelect () {
    return this.model
  }

  get clearable () {
    return !this.disabled && !this.readonly
  }

  async init () {
    this.isLoading = true
    let {data, meta} = await this.searchAction()
    this.items = data
    this.pagination = meta.pagination
    this.isLoading = false
  }

  async created () {
    await this.init()
    if (this.defaultType) {
      this.model = this.defaultType
    }
  }
}
</script>
