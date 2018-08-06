<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-form ref="vform" @keyup.native.enter="submit" @submit.prevent="submit">
    <v-card class="mb-3">
      <v-toolbar card dark color="primary">
        <v-toolbar-title>编辑/更新品牌</v-toolbar-title>
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

interface Images{
  origin:ApiResponse.ImageData[],
  thumb:ApiResponse.ImageData[]
}

@Component({
  components:{
  'base-form-item':BaseFormItem
  }
  })
export default class BrandUpdate extends mixins(Base) {
  public $refs!: {
    'form':BaseFormItem,
    'vform':any
  };

  include = ['avatars']

  item = {} as ApiResponse.BrandData

  images = {} as Images

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
    let res = await Brand.getInstance.update({id: +this.$route.params.id, formData: this.paserFormData()})

    console.log(res)
    if (res.status === 204) {
      this.$router.push({name: this.routeName.show, params: {id: this.$route.params.id}})
      this.$success({text: 'update success!'})
    } else {
      this.$refs.form.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  // 表单赋值
  assignmentFormSchema (item:ApiResponse.BrandData) {
    this.formSchema.forEach(row => {
      row.value = (this as any).item[row.field]
    })
  }

  getAvatars () {
    return (this.item.avatars as ApiResponse.Images).data.map(img => {
      const {id, url: src} = img
      const thumb = img.thumb ? img.thumb.url : null
      return {id, src, thumb}
    })
  }

  async viewInit () {
    const {data} = await Brand.getInstance.with(this.include).show({id: +this.$route.params.id})
    this.item = data
    this.item.avatars = this.getAvatars()
    this.assignmentFormSchema(this.item)
  }

  async created () {
    await this.viewInit()
  }
}
</script>
