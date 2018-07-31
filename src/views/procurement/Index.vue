<template>
  <v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
    <v-card>
      <v-card-title>采购管理</v-card-title>
      <v-card-text>
          <base-form-item  v-model="testFields"></base-form-item>
      </v-card-text>
    </v-card>
  </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import BaseFormItem from '@/components/form/BaseFormItem.vue'
import {User} from '@/store/modules/user'
@Component({
  components:{
  'base-form-item':BaseFormItem
  }
  })
export default class Procurement extends Vue {
  testFields:FormInterface.Field[] = [
    {
      field: 'category_name',
      label: '名称',
      value: '',
      type: 'text',
      ref: 'categoryName',
      rule: 'required',
      requeired: true
    },
    {
      field: 'parent_id',
      label: '父分类',
      value: {},
      type: 'select',
      items: [{name: '小米', id: 1}, {name: '苹果', id: 2}],
      itemText: 'name',
      itemValue: (item:any) => item,
      rule: 'required|categroyNameNotEqParentId:categoryName',
      requeired: true
    },
    {
      field: 'brand',
      label: 'brand',
      value: '',
      type: 'select',
      rule: 'required',
      items: ['小米', '苹果'],
      requeired: true
    },
    {
      field: 'attribute',
      label: '属性',
      value: [],
      type: 'checkbox_group',
      itemText: 'value',
      rule: 'required',
      values: [{value: '蓝色', id: 1}, {value: '红色', id: 2}, {value: '黑色', id: 3}],
      requeired: true
    }
  ]

  async mounted () {
    let data = await User.getInstance.login({email: '290621352@qq.com', password: '1234567'})
    console.log(data)
  }
}
</script>
