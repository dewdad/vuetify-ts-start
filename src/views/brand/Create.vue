<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-form ref="vform" @keyup.native.enter="submit" @submit.prevent="submit">
    <v-card class="mb-3">
      <v-toolbar card dark color="primary">
        <v-toolbar-title>创建品牌</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
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
    </v-card>
    </v-form>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
import { Brand } from '@/store/modules/brand'
import Base from './mixins/Base'
@Component({
  components:{
  'base-form-item':BaseFormItem
  }
  })
export default class BrandCreate extends mixins(Base) {
  public $refs!: {
    'form':BaseFormItem,
    'vform':any
  };

  include = ['avatars']

  clear () {
    this.$refs.vform.reset()
  }

  onFileComponentClear (e:MouseEvent, item:FormInterface.Field) {
    item.value = []
  }

  async submit () {
    if (await this.$refs.form.submit()) {
      await this.create()
    }
  }

  paserFormData () {
    return this.formSchema.reduce((formData:any, field) => {
      formData[field.field] = field.value
      return formData
    }, {})
  }

  async create () {
    this.$loading({show: true, text: '提交中'})
    let res = await Brand.getInstance.with(this.include).create(this.paserFormData())
    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: res.data.data.id}})
      this.$success({text: 'create success!'})
    } else {
      this.$refs.form.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }
}
</script>
