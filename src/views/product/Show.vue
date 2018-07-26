<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>产品详情</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema" :orginFormData="orginFormData" :disabled="true"></base-form>
      <attribute-form :orginFormData="orginFormData.values" disabled></attribute-form>
    </v-card-text>
  </v-card>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import Form from '@/components/form/BaseForm.vue'
import { Product } from '@/store/modules/product'
import AttributeForm from '@/components/form/AttributeForm.vue'

@Component({
  components:{
  'base-form':Form,
  'attribute-form':AttributeForm
  }
  })
export default class ProductShow extends mixins(Base) {
  public $refs!: {
    form: Form,
  }
  formSchema:any[]|null = null
  orginFormData:any|null = null
  loaded = false
  createItem:any = null
  item:any|null = null
  include = ['values']

  async viewInit () {
    const { data } = await Product.getInstance.with(this.include).show({id: this.$route.params.id})
    this.item = data
    this.orginFormData = Product.getInstance.filterData(data)
  }

  async loadFormStructure () {
    this.$loading({ show: true, text: '正在加载。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit(), this.loadFormStructure()])
      this.loaded = true
    })
  }
}
</script>
