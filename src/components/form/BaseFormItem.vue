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

  get fieldAttr () {
    return (propField:FormInterface.Field) => {
      const {type, props, value, ...arg} = propField
      return {...props, ...arg}
    }
  }

  get listeners () {
    return {
      ...this.$listeners
    }
  }
}
</script>
<template>
<v-layout column>
  <template v-for="propField in propFields">
    <v-text-field
      :key="propField.field"
      v-if="propField.type === 'text'"
      v-validate="propField.rule"
      :error-messages="errors.first(propField.field)"
      :name="propField.field"
      v-model="propField.value"
      v-bind="fieldAttr(propField)"

    ></v-text-field>

    <v-textarea
      :key="propField.field"
      v-if="propField.type === 'textarea'"
      v-validate="propField.rule"
      :error-messages="errors.collect(propField.field)"
      :name="propField.field"
      v-model="propField.value"
      v-bind="propField"

      ></v-textarea>

    <v-select
      :key="propField.field"
      v-if="propField.type === 'select'"
      v-validate="propField.rule"
      :error-messages="errors.collect(propField.field)"
      :name="propField.field"
      v-model="propField.value"
      v-bind="propField"
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

    <template  v-if="propField.type === 'checkbox_group'">
      <v-checkbox
        v-for="(value,index) in propField.values"
        :key="index"
        v-validate="propField.rule"
        :error-messages="errors.collect(propField.field)"
        :name="propField.field"
        v-bind="propField"
        v-model="propField.value"
        :value="value"
        :label="value[propField.itemText]"
        ></v-checkbox>
    </template>
  </template>
</v-layout>
</template>
