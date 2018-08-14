<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12>
      <v-form ref="vform"
              @keyup.native.enter="submit"
              @submit.prevent="submit">
        <form-body-card title="创建供应商">
          <div slot="title-btn">
            <v-menu :close-on-content-click="false"
                    :nudge-width="175"
                    transition="slide-y-transition"
                    offset-x
                    offset-y
                    offset-overflow>
              <v-btn slot="activator"
                     icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-card>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="config" label="社交信息" value="info"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>

                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="config" label="支付信息" value="payment"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>

                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="config" label="地址信息" value="addresses"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>

                </v-list>
              </v-card>
            </v-menu>
          </div>
          <v-card-text>
            <v-subheader>基本</v-subheader>
            <base-form-item v-model="formSchema"
                            ref="form"></base-form-item>
            <template v-if="config.includes('info')">
              <v-subheader>社交</v-subheader>
              <info-form v-model="info"></info-form>
            </template>

            <template v-if="config.includes('payment')">
              <v-subheader>结算</v-subheader>
              <payment-form v-model="payment"></payment-form>
            </template>

            <template v-if="config.includes('addresses')">
              <v-subheader>地址</v-subheader>
              <address-form v-model="addresses"></address-form>
            </template>

          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="clear"
                   flat>清空</v-btn>
            <v-btn color="primary"
                   type="submit">提交</v-btn>
            <!-- <submit-button color="primary" block="true" label="Login"></submit-button> -->
          </v-card-actions>
        </form-body-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Provide } from 'vue-property-decorator'
import BaseFormItem from '@/components/form/BaseFormItem.vue'

import FormMixin from '@/components/form/mixins/Form'

import FormBodyCard from '@/components/card/FormBodyCard.vue'

import { Brand } from '@/store/modules/brand'
import Base from './mixins/Base'
import { With } from '@/utils/decorators'
const InfoForm = () => import('@/views/productProvider/components/InfoForm.vue')
const PaymentForm = () => import('@/views/productProvider/components/PaymentForm.vue')
const AddressForm = () => import('@/views/productProvider/components/AddressForm.vue')
@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard,
  'info-form':InfoForm,
  'payment-form':PaymentForm,
  'address-form':AddressForm
  }
  })
export default class BrandCreate extends Mixins(Base, FormMixin) {
  public $refs!: {
    'form':BaseFormItem,
    'vform':any
  };

  @Provide() parentValidator = this.$validator

  clear () {
    this.$refs.vform.reset()
  }

  config = ['info', 'payment', 'addresses']

  info:any = {}

  payment:any = {}

  addresses:any = {}

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '供应商名称',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required',
      required: true
    },
    {
      field: 'code',
      label: '供应商代码',
      value: '',
      fieldType: 'text',
      rule: 'required',
      required: true
    },
    {
      field: 'level',
      label: '供应商等级',
      fieldType: 'slider',
      value: 0,
      thumbLabel: 'always',
      ticks: 'always',
      max: 5,
      thumbSize: 24,
      tickSize: 2,
      hint: '拖动滑块设置供应商等级'
    },

    {
      field: 'description',
      label: '备注信息',
      fieldType: 'textarea',
      rule: 'max:200',
      counter: true
    }
  ]

  async submit () {
    if (await this.$validator.validateAll()) {
      console.log(this.getFormData())
      // await this.create()
    } else {
      this.$fail({text: '表单有误检查后再次提交'})
    }
  }

  getFormData () {
    const info = this.config.includes('info') ? this.info : {}
    const addresses = this.config.includes('addresses') ? this.addresses : {}
    const payment = this.config.includes('payment') ? this.payment : {}
    return Object.assign({}, this.paserFormData(), info, addresses, payment)
  }

  async create () {
    this.$loading({show: true, text: '提交中'})
    let res = await this.createApi(this.paserFormData())
    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: res.data.data.id}})
      this.$success({text: 'create success!'})
    } else {
      this.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }
}
</script>
