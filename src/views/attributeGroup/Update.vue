<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>属性组修改/更新</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema" :orginFormData="orginFormData"></base-form>
      <attribute-form v-show="showAttributeForm"  ref="attributeForm" :orginFormData="orginFormData.values"></attribute-form>
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
import { AttributeGroup } from '@/store/modules/attributeGroup'
import AttributeForm from '@/components/form/AttributeForm.vue'

@Component({
  components:{
  'base-form':Form,
  'attribute-form':AttributeForm
  }
  })
export default class AttributeGroupUpdate extends mixins(Base) {
  public $refs!: {
    form: Form,
    attributeForm:AttributeForm
  }
  formSchema:any[]|null = null
  orginFormData:any|null = null
  loaded = false
  createItem:any = null
  item:any|null = null
  include = ['values']

  showAttributeForm = true

  formProp:any = {}

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      const attributes = this.showAttributeForm ? this.$refs.attributeForm.getAttributes : {}
      await AttributeGroup.getInstance.update({ formData: {...res, attributes}, id: this.item.id })
      this.$success({text: '更新成功', position: 9})
      this.$router.replace({name: this.routeName.index})
    }
  }

  async viewInit () {
    const { data } = await AttributeGroup.getInstance.with(this.include).show({id: this.$route.params.id})
    this.item = data
    this.orginFormData = AttributeGroup.getInstance.filterData(data)
  }

  reset () {
    this.$refs.form.clear()
    this.$refs.attributeForm.clear()
  }

  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  onTypeChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {
    this.showAttributeForm = !['text', 'textarea', 'toggle'].includes(newVal)
  }

  get attributes () {
    return this.$refs.attributeForm.getAttributes
  }
  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit(), this.loadFormStructure()])
      this.loaded = true
    })
  }
}
</script>
