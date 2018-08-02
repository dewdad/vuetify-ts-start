<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>创建品牌</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema"></base-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="$refs.form.clear()">重置</v-btn>
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
import { Brand } from '@/store/modules/brand'

@Component({
  components:{
  'base-form':Form
  }
  })
export default class BrandCreate extends mixins(Base) {
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
      await Brand.getInstance.create(res)
      this.$success({text: '创建成功', position: 9})
      this.$router.replace({name: this.routeName.index})
    }
  }

  async created () {
    await this.loadFormStructure()
    this.loaded = true
  }
}
</script>
