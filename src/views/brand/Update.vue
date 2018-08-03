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
export default class BrandCreate extends mixins(Base) {
  public $refs!: {
    'form':BaseFormItem,
    'vform':any
  };

  include = ['images']

  item = {} as ApiResponse.BrandData

  images = {} as Images

  clear () {
    this.$refs.vform.reset()
  }

  onFileComponentClear (e:MouseEvent, item:FormInterface.Field) {
    item.value = []
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
      field: 'avatar',
      label: '品牌LOGO',
      fieldType: 'file',
      rule: 'required',
      value: [],
      itemEvent: {'clear': (e:MouseEvent) => this.onFileComponentClear(e, this.formSchema[1])}
    },
    {
      field: 'description',
      label: '品牌描述',
      value: '',
      fieldType: 'textarea',
      rule: 'max:200',
      counter: true
    }
  ]

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
    // if (res.status === 201) {
    //   this.$router.push({name: this.routeName.show,params:{}})
    //   this.$success({text: 'Welcome back!'})
    // } else {
    //   this.$refs.form.$setErrorsFromResponse(res.data)
    //   this.$fail({text: res.data.message})
    // }
    this.$loading({show: false})
  }

  imageGroupByType (images:ApiResponse.Images):any {
    return _.groupBy(images.data, item => item.type)
  }

  // 表单赋值
  assignmentFormSchema (item:ApiResponse.BrandData) {
    this.formSchema.forEach(row => {
      row.value = (this as any).item[row.field]
    })
  }

  async viewInit () {
    const {data} = await Brand.getInstance.with(this.include).show({id: +this.$route.params.id})
    this.item = data
    this.images = this.imageGroupByType(this.item.images)
    this.item.avatar = this.images.origin.map(item => item.url)
    this.assignmentFormSchema(this.item)
  }

  async created () {
    await this.viewInit()
  }
}
</script>
