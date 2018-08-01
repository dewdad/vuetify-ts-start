<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'

@Component({
  name:'base-form-item',
  components:{
  }
  })
export default class BaseFormItem extends Vue {
  @Model('input') propFields!:FormInterface.Field[]

  allowFieldType = {
    'text': 'v-text-field',
    'textarea': 'v-textarea',
    'switch': 'v-toggle',
    'select': 'v-select',
    'checkbox_group': 'v-checkbox',
    'radio-group': 'v-radio-group'
  }
  attributes = []

  get filterFieldAttrs () {
    return (propField:FormInterface.Field) => {
      const {fieldType, props, value, itemEvent, ...arg} = propField
      return {...props, ...arg}
    }
  }

  get listeners () {
    return (propField:FormInterface.Field) => {
      const {itemEvent} = propField
      return itemEvent
    }
  }

  async submit () {
    const res = await this.$validator.validateAll()
    return res
  }
}
</script>
<template>
<v-layout column>
  <template v-for="propField in propFields">
    <v-text-field
      :key="propField.field"
      v-if="propField.fieldType === 'text'"
      v-validate="propField.rule"
      :error-messages="errors.first(propField.name || propField.field)"
      :name="propField.name || propField.field"
      v-model="propField.value"
      v-bind="filterFieldAttrs(propField)"
      v-on="listeners(propField)"
    ></v-text-field>

    <v-textarea
      :key="propField.field"
      v-if="propField.fieldType === 'textarea'"
      v-validate="propField.rule"
      :error-messages="errors.collect(propField.name || propField.field)"
      :name="propField.name || propField.field"
      v-model="propField.value"
      v-bind="filterFieldAttrs(propField)"
      v-on="listeners(propField)"

      ></v-textarea>

    <v-select
      :key="propField.field"
      v-if="propField.fieldType === 'select'"
      v-validate="propField.rule"
      :error-messages="errors.collect(propField.name || propField.field)"
      :name="propField.name || propField.field"
      v-model="propField.value"
      v-bind="filterFieldAttrs(propField)"
      v-on="listeners(propField)"
      >
        <!-- <template v-if="propField.isSlot">
          <template slot="item" slot-scope="{item}" >
            {{item[propField.itemText]}}
          </template>
          <template slot="selection" slot-scope="{parent,item,index,selected,disabled}" >
            {{item[propField.itemText]}}
          </template>
        </template> -->
      </v-select>

    <template  v-if="propField.fieldType === 'checkbox_group'">
      <v-checkbox
        v-for="(value,index) in propField.values"
        :key="index"
        v-validate="propField.rule"
        :error-messages="errors.collect(propField.name || propField.field)"
        :name="propField.name || propField.field"
        v-bind="filterFieldAttrs(propField)"
        v-on="listeners(propField)"
        v-model="propField.value"
        :value="value"
        :label="value[propField.itemText]"
        ></v-checkbox>
    </template>
  </template>
</v-layout>
</template>
