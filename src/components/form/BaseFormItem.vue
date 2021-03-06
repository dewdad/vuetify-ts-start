<script lang="ts">
import { Component, Vue, Prop, Model, Watch, Mixins } from 'vue-property-decorator'
import InjectValidator from '@/components/form/mixins/InjectValidator'
@Component({
  name:'base-form-item',
  components:{
  'file-upload':()=>import('@/components/fileUpload/Upload.vue'),
  'v-search':()=>import('@/components/form/BaseFormSearch.vue')
  }
  })
export default class BaseFormItem extends Mixins(InjectValidator) {
  @Model('input') propFields!:FormInterface.Field[]

  @Prop({type: Boolean, default: false}) loading!:boolean

  allowFieldType = {
    'text': 'v-text-field',
    'textarea': 'v-textarea',
    'switch': 'v-toggle',
    'select': 'v-select',
    'checkbox_group': 'v-checkbox',
    'radio-group': 'v-radio-group',
    'file': 'file-upload'
  }
  attributes = []

  @Watch('loading')
  onLoadingChange (val:boolean) {
    const propFields = _.cloneDeep(this.propFields)
    propFields.forEach(item => {
      if (_.has(item, 'loading')) {
        item.loading = val
      }
    })
    this.$emit('input', propFields)
  }

  filterFieldAttrs (propField:FormInterface.Field) {
    _.set(propField, 'loading', _.get(propField, 'loading', this.loading))
    const {fieldType, props, value, itemEvent, ...arg} = propField
    return {...props, ...arg}
  }

  listeners (propField:FormInterface.Field) {
    const {itemEvent} = propField
    return itemEvent
  }

  groupAttributeValues (propField:FormInterface.Field) {
    const values = propField.values
    if (values) {
      if (values.data) {
        if (_.isObject(values.data) || _.isArray(values.data)) {
          return propField.values.data
        }
      }
      return values
    }
    return []
  }

  async submit () {
    const res = await this.$validator.validateAll()
    return res
  }
}
</script>
<template>
  <v-container fluid class="px-3">
    <template v-for="propField in propFields">
      <v-text-field :key="propField.field"
                    v-if="propField.fieldType === 'text'"
                    v-validate="propField.rule"
                    :error-messages="errors.first(propField.name || propField.field)"
                    :name="propField.name || propField.field"
                    v-model="propField.value"
                    v-bind="filterFieldAttrs(propField)"
                    v-on="listeners(propField)"></v-text-field>

      <v-switch :key="propField.field"
                v-if="propField.fieldType === 'switch'"
                v-validate="propField.rule"
                :error-messages="errors.first(propField.name || propField.field)"
                :name="propField.name || propField.field"
                v-model="propField.value"
                v-bind="filterFieldAttrs(propField)"
                v-on="listeners(propField)"></v-switch>

      <v-slider :key="propField.field"
                v-if="propField.fieldType === 'slider'"
                v-validate="propField.rule"
                :error-messages="errors.first(propField.name || propField.field)"
                :name="propField.name || propField.field"
                v-model="propField.value"
                v-bind="filterFieldAttrs(propField)"
                v-on="listeners(propField)"

      ></v-slider>

      <v-textarea outline
                  :key="propField.field"
                  v-if="propField.fieldType === 'textarea'"
                  v-validate="propField.rule"
                  :error-messages="errors.collect(propField.name || propField.field)"
                  :name="propField.name || propField.field"
                  v-model="propField.value"
                  v-bind="filterFieldAttrs(propField)"
                  v-on="listeners(propField)"></v-textarea>

      <v-input :key="propField.field"
               v-if="propField.fieldType === 'file'"
               v-bind="filterFieldAttrs(propField)"
               v-validate="propField.rule"
               :error-messages="errors.first(propField.name || propField.field)"
               :name="propField.name || propField.field"
               :value="propField.value"
               v-on="listeners(propField)">
        <v-container>
          <v-layout>
            <v-flex>
              <file-upload v-model="propField.value"
                           v-bind="filterFieldAttrs(propField)"
                           v-on="listeners(propField)"></file-upload>
            </v-flex>
          </v-layout>
        </v-container>

      </v-input>

      <v-select :key="propField.field"
                v-if="propField.fieldType === 'select'"
                v-validate="propField.rule"
                :error-messages="errors.collect(propField.name || propField.field)"
                :name="propField.name || propField.field"
                v-model="propField.value"
                v-bind="filterFieldAttrs(propField)"
                v-on="listeners(propField)">
        <!-- <template v-if="propField.isSlot">
          <template slot="item" slot-scope="{item}" >
            {{item[propField.itemText]}}
          </template>
          <template slot="selection" slot-scope="{parent,item,index,selected,disabled}" >
            {{item[propField.itemText]}}
          </template>
        </template> -->
      </v-select>

      <template v-if="propField.fieldType === 'checkbox_group'">

        <slot v-if="propField.custom"
              :name="propField.slotName"
              :propField="propField"></slot>
        <template v-else>
          <v-checkbox v-for="value in groupAttributeValues(propField)"
                      :key="JSON.stringify(value)"
                      v-validate="propField.rule"
                      :error-messages="errors.collect(propField.name || propField.field)"
                      :name="propField.name || propField.field"
                      v-bind="filterFieldAttrs(propField)"
                      v-on="listeners(propField)"
                      v-model="propField.value"
                      :value="value"
                      :label="value[propField.itemText]">
          </v-checkbox>
        </template>

      </template>

      <!-- toggle -->

      <v-switch v-if="propField.fieldType === 'toggle'"
                :key="propField.field"
                v-validate="propField.rule"
                :error-messages="errors.first(propField.name || propField.field)"
                :name="propField.name || propField.field"
                v-model="propField.value"
                v-bind="filterFieldAttrs(propField)"
                v-on="listeners(propField)"></v-switch>

      <v-search v-if="propField.fieldType === 'search'"
                :key="propField.field"
                :propField="propField"
                v-on="listeners(propField)"
                v-model="propField.value">
      </v-search>
      <slot v-if="propField.fieldType === 'any'"
            :name="propField.slotName"
            :propField="propField"></slot>
    </template>
    <slot></slot>
  </v-container>
</template>
