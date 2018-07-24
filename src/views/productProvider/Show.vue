<template>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>供应商详情</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema" :orginFormData="orginFormData" :disabled="true"></base-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import Form from '@/components/form/BaseForm.vue'
import { ProductProvider } from '@/store/modules/productProvider'

@Component({
  components:{
  'base-form':Form
  }
  })
export default class ProductProviderShow extends mixins(Base) {
  public $refs!: {
    form: Form,
  }
  formSchema:any[]|null = null
  orginFormData:any|null = null
  loaded = false
  createItem:any = null
  item:any|null = null
  include = ['info', 'payment.balance', 'payment.payment', 'addresses']

  async viewInit () {
    const { data } = await (ProductProvider.with(this.include) as any).show({id: this.$route.params.id})
    this.item = data
    this.orginFormData = ProductProvider.filterData(data)
    this.orginFormData.addresses = this.orginFormData.addresses[0]
  }

  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
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
