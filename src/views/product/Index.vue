<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
  <base-data-table ref="table" :headers="headers" :getDataFromApi="getDataFromApi" :showItem="showItem" :editItem="editItem" liked>
        <!-- 创建表单 -->
        <v-btn color="info" slot="storeButton" @click="$router.push({name:routeName.create})">创建</v-btn>
        <!-- 更新表单 -->
        <!-- <update-data-from></update-data-from> -->
  </base-data-table>
  </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import { Product } from '@/store/modules/product'

@Component({
  components:{
  'base-data-table':()=>import('@/components/table/BaseDataTable.vue')
  }
  })
export default class ProductIndex extends mixins(Base) {
  include:string[] = []
  headers = [
    {
      text: 'ID',
      align: 'right',
      sortable: true,
      value: 'id'
    },
    { text: '属性组名称', value: 'name', align: 'right' },
    { text: '可为销售属性', value: 'variant', align: 'right' },
    { text: '选择方式', value: 'type', align: 'right' },
    { text: '是否必填', value: 'required', align: 'right' },
    { text: '可自定义', value: 'customized', align: 'right' },
    { text: 'CREATED_AT', value: 'created_at', align: 'right' },
    { text: 'UPDATED_AT', value: 'updated_at', align: 'right' }
  ]

  async createSuccess () {

  }

  getDataFromApi (queryBuild = null) {
    return Product.getInstance.with(this.include).index(queryBuild)
  }
}
</script>
