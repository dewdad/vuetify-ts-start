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
export default class InfoForm extends Mixins(FormMixin, InjectValidator) {
  @Model('input', {type: Object, default: () => {}}) value!:any
  formSchema:FormInterface.Field[] = [
    {
      field: 'info.email',
      label: '电子邮箱',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'email'
    },
    {
      field: 'info.qq',
      label: 'QQ号',
      value: '',
      fieldType: 'text'
    },
    {
      field: 'info.wechat',
      label: '微信号',
      value: '',
      fieldType: 'text'
    }
  ]

  get formData () {
    return this.paserFormData()
  }

  @Watch('formData', {deep:true})
  onFormDataChange (val:any) {
    this.$emit('input', val)
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
