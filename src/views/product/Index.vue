<template>
<v-layout fill-height  justify-center>
  <v-flex xs12>
  <base-data-table ref="table" :headers="headers" :delItem="delItem" :getDataFromApi="listApi" :showItem="showItem" :editItem="editItem" liked>
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
  include:string[] = ['brand', 'type']
  headers = [
    {
      text: 'ID',
      align: 'right',
      sortable: true,
      value: 'id'
    },
    { text: '产品名称', value: 'name', align: 'right' },
    { text: '产品编号', value: 'code', align: 'right' },
    { text: '品牌', value: 'brand.data.name', align: 'right' },
    { text: '产品类型', value: 'type.data.name', align: 'right' },
    { text: 'CREATED_AT', value: 'created_at', align: 'right' },
    { text: 'UPDATED_AT', value: 'updated_at', align: 'right' }
  ]

  delItem (id:number) {
    return this.deleteApi({id})
  }
}
</script>
