<template>
  <v-autocomplete
      :loading="loading"
      :items="propField.items"
      :search-input.sync="search"
      @input="val=>$emit('input',val)"
      cache-items
      v-validate="propField.rule"
      :error-messages="errors.first(propField.name || propField.field)"
      :name="propField.name || propField.field"
      :value="value"
      v-bind="filterFieldAttrs"
    ></v-autocomplete>
</template>

<script lang="ts">

import { Component, Vue, Watch, Model, Prop, Mixins } from 'vue-property-decorator'
import FormItem from './mixins/FormItem'
import InjectValidator from '@/components/form/mixins/InjectValidator'
@Component({
  inheritAttrs:true
  })
export default class BaseFormSearch extends Mixins(FormItem, InjectValidator) {
  @Prop({type: Array, default: () => []}) items!:any[]

  loading:boolean = false
  search:string|null = null

  @Watch('search')
  onSearchChange (val:string) {
    val && this.verifySearchValue(val) && this.throttle(val)
  }

  verifySearchValue (search:string) {
    const key = this.propField.itemText
    if (_.isObject(this.value)) {
      return this.value[(key as string)] !==search
    } else {
      const valueKey = this.propField.itemValue
      const items = this.propField.items
      if (items) {
        const res = items.find(item => item[valueKey as string]===this.value)
        if (!res) return true
        return res[key as string] !==search
      }
      return true
    }
  }

  throttle = _.throttle(function (this:any, val) {
    this.$emit('change', val)
  }, 300)
}
</script>
