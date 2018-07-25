<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>创建产品类型</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema"></base-form>
      <attribute-group-form ref="attributeGroupForm"></attribute-group-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="reset">重置</v-btn>
      <v-btn flat color="info" @click.native="submit">提交</v-btn>
    </v-card-actions>
  </v-card>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import Form from '@/components/form/BaseForm.vue'
import { ProductType } from '@/store/modules/productType'
import AttributeGroupForm from '@/components/productType/AttributeGroupForm.vue'
@Component({
  components:{
  'base-form':Form,
  'attribute-group-form':AttributeGroupForm
  }
  })
export default class ProductTypeCreate extends mixins(Base) {
  public $refs!: {
    form: Form,
    attributeGroupForm:AttributeGroupForm
  };
  formSchema:any[]|null = null
  loaded = false
  createItem:any = null

  reset () {
    this.$refs.form.clear()
    this.$refs.attributeGroupForm.clear()
  }
  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      this.createItem = res
      await ProductType.getInstance.create({...res, group_ids: this.$refs.attributeGroupForm.getGroupIds})
      alert('创建成功')
    }
  }

  async created () {
    await this.loadFormStructure()
    this.loaded = true
  }
}
</script>
