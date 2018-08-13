<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-form ref="vform" @keyup.native.enter="submit" @submit.prevent="submit">
    <form-body-card title="编辑/更新品牌">

      <v-card-text>

        <base-form-item  v-model="formSchema" ref="form"></base-form-item>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="clear" flat>清空</v-btn>
        <v-btn color="primary" type="submit">提交</v-btn>
        <!-- <submit-button color="primary" block="true" label="Login"></submit-button> -->
      </v-card-actions>
    </form-body-card>
    </v-form>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue, Provide, Mixins } from 'vue-property-decorator'
import BaseFormItem from '@/components/form/BaseFormItem.vue'

import FormMixin from '@/components/form/mixins/Form'

import FormBodyCard from '@/components/card/FormBodyCard.vue'

import { Brand } from '@/store/modules/brand'
import Base from './mixins/Base'
import { Update, Show } from '@/api/types'
import { With } from '@/utils/decorators'

interface Images{
  origin:ApiResponse.ImageData[],
  thumb:ApiResponse.ImageData[]
}

@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard,
  }
  })
export default class BrandUpdate extends Mixins(Base, FormMixin) {
  public $refs!: {
    'form':BaseFormItem,
    'vform':any
  };

  @Provide() parentValidator = this.$validator

  item = {} as ApiResponse.BrandData

  paserMapping = {
  }

  mapping = {
    avatars: {key: 'avatars', handle: (item:ApiResponse.Images) => this.getAvatars(item)}
  }

  clear () {
    this.$refs.vform.reset()
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '品牌名称',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required',
      requeired: true
    },
    {
      field: 'avatars',
      label: '品牌LOGO',
      fieldType: 'file',
      rule: 'required',
      value: [],
      itemEvent: {'clear': (e:MouseEvent) => this.onFileComponentClear(e, this.formSchema[1])}
    },
    {
      field: 'description',
      label: '品牌描述',
      fieldType: 'textarea',
      rule: 'max:200',
      counter: true
    }
  ]

  onFileComponentClear (e:MouseEvent, item:FormInterface.Field) {
    item.value = []
  }

  async submit () {
    if (await this.$validator.validateAll()) {
      await this.update()
    }
  }

  paserFormData () {
    return this.formSchema.reduce((formData:any, field) => {
      formData[field.field] = field.value
      return formData
    }, {})
  }

  @With(['avatars'])
  updateBrandApi (payload:Update) {
    return Brand.update(payload)
  }

  @With(['avatars'])
  showBrandApi (payload:Show) {
    return Brand.show(payload)
  }

  async update () {
    this.$loading({show: true, text: '提交中'})

    let res = await this.updateBrandApi({id: +this.$route.params.id, ...this.paserFormData()})

    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: this.$route.params.id}})
      this.$success({text: 'update success!'})
    } else {
      this.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  async viewInit () {
    const {data} = await this.showBrandApi({id: +this.$route.params.id})
    this.item = data
    this.assignmentFormSchema(this.item)
  }

  async created () {
    await this.viewInit()
  }
}
</script>
