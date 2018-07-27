<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>分类修改/更新</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema" :orginFormData="orginFormData"></base-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn flat
             @click.native="$refs.form.clear()">Reset</v-btn>
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
import { Category } from '@/store/modules/category'

@Component({
  components:{
  'base-form':Form
  }
  })
export default class CategoryUpdate extends mixins(Base) {
  public $refs!: {
    form: Form,
  }
  formSchema:any[]|null = null
  orginFormData:any|null = null
  loaded = false
  createItem:any = null
  item:any|null = null
  include = []

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      await Category.getInstance.update({ formData: res, id: this.item.id })
      this.$success({text: '更新成功', position: 9})
      this.$router.replace({name: this.routeName.index})
    }
  }

  async viewInit () {
    const { data } = await Category.getInstance.with(this.include).show({id: this.$route.params.id})
    this.item = data
    this.orginFormData = Category.getInstance.filterData(data)
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
