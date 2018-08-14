<template>
  <base-form-item  v-model="formSchema" ref="form"></base-form-item>
</template>

<script lang="ts">
import { Component, Mixins, Model, Watch } from 'vue-property-decorator'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
import FormMixin from '@/components/form/mixins/Form'
import InjectValidator from '@/components/form/mixins/InjectValidator'
@Component({
  components:{
  'base-form-item':BaseFormItem
  }
  })
export default class AddressForm extends Mixins(FormMixin, InjectValidator) {
  @Model('input', {type: Object, default: () => {}}) value!:any

  @Watch('formData', {deep:true})
  onFormDataChange (val:any) {
    this.$emit('input', val)
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'addresses.name',
      label: '联系人',
      value: '',
      type: 'text',
      fieldType: 'text'
    },
    {
      field: 'addresses.tel',
      label: '座机',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'addresses.fax',
      label: '传真',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'addresses.zip',
      label: '邮编',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'addresses.country',
      label: '国家',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'addresses.province',
      label: '省份',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'addresses.city',
      label: '城市',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'addresses.district',
      label: '街道',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'addresses.address',
      label: '详细地址',
      value: '',
      fieldType: 'textarea'
    }
  ]

  get formData () {
    return this.paserFormData()
  }

  init () {
    if (!_.isEmpty(this.value)) {
      this.assignmentFormSchema(this.value)
    }
  }

  mounted () {
    this.init()
  }
}
</script>
