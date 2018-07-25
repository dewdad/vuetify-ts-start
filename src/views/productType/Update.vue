<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>产品类型修改/更新</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema" :orginFormData="orginFormData"></base-form>
      <attribute-group-form ref="attributeGroupForm" :orginFormData="selected"></attribute-group-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn flat
             @click.native="reset">Reset</v-btn>
      <v-btn dark
             color="info"
             flat
             @click.native="submit">Save</v-btn>
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
import { AttributeGroupItem } from '@/store/modules/attributeGroup'

@Component({
  components:{
  'base-form':Form,
  'attribute-group-form':AttributeGroupForm
  }
  })
export default class ProductTypeUpdate extends mixins(Base) {
  public $refs!: {
    form: Form,
    attributeGroupForm:AttributeGroupForm,
  }
  formSchema:any[]|null = null
  orginFormData:any|null = null
  loaded = false
  createItem:any = null
  item:any|null = null
  include = ['attributeGroups']

  selected:number[] = []

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      await ProductType.getInstance.update({ formData: {...res, group_ids: this.$refs.attributeGroupForm.getGroupIds}, id: this.item.id })
      this.$success({text: '更新成功', position: 9})
      this.$router.replace({name: this.routeName.index})
    }
  }

  reset () {
    this.$refs.form.clear()
    this.$refs.attributeGroupForm.clear()
  }

  async viewInit () {
    const { data } = await ProductType.getInstance.with(this.include).show({id: this.$route.params.id})
    this.item = data
    this.orginFormData = ProductType.getInstance.filterData(data)
    this.selected = this.orginFormData.attributeGroups.map((item:AttributeGroupItem) => item.id)
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
