<template>
<v-layout fill-height  justify-center>
  <v-flex xs12>
  <v-form ref="vform" @keyup.native.enter="submit" @submit.prevent="submit">
    <form-body-card title="创建分类">

      <v-card-text v-if="loaded">

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
import { Component, Vue, Mixins, Provide } from 'vue-property-decorator'
import BaseFormItem from '@/components/form/BaseFormItem.vue'

import FormMixin, { PaserMapping } from '@/components/form/mixins/Form'

import FormBodyCard from '@/components/card/FormBodyCard.vue'

import Base from './mixins/Base'
import { With } from '@/utils/decorators'
@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard,
  }
  })
export default class BrandCreate extends Mixins(Base, FormMixin) {
  public $refs!: {
    'form':BaseFormItem,
    'vform':any
  };

  @Provide() parentValidator = this.$validator

  categories = {} as {data:Array<{id:number, name:string, 'parent_name':null|number}>}

  loaded = false

  clear () {
    this.$refs.vform.reset()
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '分类名称',
      value: '',
      type: 'text',
      ref: 'categoryName',
      fieldType: 'text',
      rule: {required: true},
      requeired: true
    },
    {
      field: 'parent_id',
      label: '父分类',
      fieldType: 'select',
      rule: 'categroyNameNotEqParentId:categoryName',
      value: {},
      itemText: 'name',
      itemValue: (item:any) => item
    }
  ]

  paserMapping:PaserMapping = {
    'parent_id': {key: 'parent_id', handle: item => item.id}
  }

  async submit () {
    if (await this.$validator.validateAll()) {
      await this.create()
    }
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

  async viewInit () {
    this.categories = await this.listApi({filter: 'id;name'})
    const parentField = this.formSchema.find(item => item.field === 'parent_id')
    if (parentField && this.categories.data) {
      parentField.items = this.categories.data
    }
    const nameField = this.formSchema.find(item => item.field === 'name')
    if (nameField && this.categories.data) {
      nameField.rule = Object.assign({}, nameField.rule, {categoryUnique: {categories: this.categories.data, parentId: this.parentId}})
    }
  }

  get parentId () {
    const parentField = this.formSchema.find(item => item.field === 'parent_id')
    if (parentField && parentField.value.id) {
      return parentField.value.id
    }
    return 0
  }

  async mounted () {
    await this.viewInit()
    this.loaded = true
  }
}
</script>
