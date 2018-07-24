<template>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>创建供应商</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema"></base-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="$refs.form.clear()">重置</v-btn>
      <v-btn flat color="info" @click.native="submit">提交</v-btn>
    </v-card-actions>
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
export default class ProductProviderCreate extends mixins(Base) {
  public $refs!: {
    form: Form,
  };
  formSchema:any[]|null = null
  loaded = false
  createItem:any = null
  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      this.createItem = res
      await ProductProvider.create(res)
      alert('创建成功')
    }
  }

  async created () {
    await this.loadFormStructure()
    this.loaded = true
  }
}
</script>
