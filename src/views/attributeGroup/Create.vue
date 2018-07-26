<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <v-card class="mb-3">
    <v-toolbar card dark color="primary">
      <v-toolbar-title>创建属性组</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
    <v-card-text v-if="loaded">
      <base-form ref="form" :schema="formSchema"></base-form>
      <attribute-form ref="attributeForm"></attribute-form>
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
import AttributeForm from '@/components/form/AttributeForm.vue'
import { AttributeGroup } from '@/store/modules/attributeGroup'

@Component({
  components:{
  'base-form':Form,
  'attribute-form':AttributeForm
  }
  })
export default class AttributeGroupCreate extends mixins(Base) {
  public $refs!: {
    form: Form,
    attributeForm:AttributeForm
  };
  formSchema:any[]|null = null
  loaded = false
  createItem:any = null
  async loadFormStructure () {
    this.$loading({ show: true, text: '正在生成表单。。。' })
    this.formSchema = await this.createSchema()
    this.$loading({ show: false })
  }

  reset () {
    this.$refs.form.clear()
    this.$refs.attributeForm.clear()
  }

  async submit () {
    const res = await this.$refs.form.submit()
    if (res) {
      this.createItem = res
      await AttributeGroup.getInstance.create({...res, attributes: this.$refs.attributeForm.getAttributes})
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
