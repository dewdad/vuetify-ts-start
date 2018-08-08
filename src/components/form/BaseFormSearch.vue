<template>
  <v-autocomplete
      :loading="loading"
      :items="propField.items"
      :search-input.sync="search"
      @input="val=>$emit('input',val)"
      cache-items
      class="mx-3"

      hide-no-data

      solo

      v-validate="propField.rule"
      :error-messages="errors.first(propField.name || propField.field)"
      :name="propField.name || propField.field"
      :value="value"
      v-bind="filterFieldAttrs"
    ></v-autocomplete>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'

import { Component, Vue, Watch, Model, Prop } from 'vue-property-decorator'
import FormItem from './mixins/FormItem'
@Component({
  inheritAttrs:true
  })
export default class BaseFormSearch extends mixins(FormItem) {
  @Prop({type: Array, default: () => []}) items!:any[]

  loading:boolean = false
  search:string|null = null

  @Watch('search')
  onSearchChange (val:string) {
    val && val !== this.value && this.throttle(val)
  }

  throttle = _.throttle(function (this:any, val) {
    this.$emit('change', val)
  }, 300)
}
</script>
