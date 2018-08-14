<template>
  <base-form-item  v-model="formSchema" ref="form"></base-form-item>
</template>

<script lang="ts">
import { Component, Mixins, Model, Watch } from 'vue-property-decorator'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
import FormMixin, { PaserMapping, Mapping } from '@/components/form/mixins/Form'
import InjectValidator from '@/components/form/mixins/InjectValidator'
import { Payment } from '@/store/modules/payment'
import { Balance } from '@/store/modules/balance'
@Component({
  components:{
  'base-form-item':BaseFormItem
  }
  })
export default class PaymentForm extends Mixins(FormMixin, InjectValidator) {
  @Model('input', {type: Object, default: () => {}}) value!:any

  @Watch('formData', {deep:true})
  onFormDataChange (val:any) {
    this.$emit('input', val)
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'payment.balance_id',
      label: '结算方式',
      value: {},
      fieldType: 'select',
      itemText: 'name',
      itemValue: (item:any) => item
    },
    {
      field: 'payment.description',
      label: '备注',
      value: '',
      fieldType: 'textarea'
    },
    {
      field: 'payment.payment_id',
      label: '付款方式',
      value: {},
      fieldType: 'select',
      itemText: 'name',
      itemValue: (item:any) => item
    },
    {
      field: 'payment.options.account',
      label: '账户信息',
      fieldType: 'text',
      value: ''
    }
  ]

  paserMapping:PaserMapping = {
    'payment.balance_id': {key: 'payment.balance_id', handle: item => item && item.id},
    'payment.payment_id': {key: 'payment.payment_id', handle: item => item && item.id}
  }

  mapping:Mapping = {
    'payment.balance_id': {key: 'payment.balance_id', handle: id => this.balanceHandle(id)},
    'payment.payment_id': {key: 'payment.payment_id', handle: id => this.paymentHandle(id)}
  }

  balanceHandle (id:number) {
    return this.balances.data.find(item => item.id === id)
  }

  paymentHandle (id:number) {
    return this.payments.data.find(item => item.id === id)
  }

  payments = {} as ApiResponse.Payments

  balances = {} as ApiResponse.Balances

  async loadPayment () {
    this.payments = await Payment.index()
  }

  async loadBalance () {
    this.balances = await Balance.index()
  }

  viewInit () {
    const balanceField = this.formSchema.find(item => item.field==='payment.balance_id')
    if (balanceField) {
      this.$set(balanceField, 'items', this.balances.data)
    }

    const paymentField = this.formSchema.find(item => item.field === 'payment.payment_id')
    if (paymentField) {
      this.$set(paymentField, 'items', this.payments.data)
    }
  }

  get formData () {
    return this.paserFormData()
  }

  async mounted () {
    await Promise.all([
      this.loadPayment(),
      this.loadBalance()
    ])
    this.viewInit()
    this.init()
  }

  init () {
    if (!_.isEmpty(this.value)) {
      this.assignmentFormSchema(this.value)
    }
  }
}
</script>
