<template>
<v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
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
import { ProductProvider } from '@/store/modules/productProvider'

@Component({
  components:{
  'base-data-table':()=>import('@/components/table/BaseDataTable.vue')
  }
  })
export default class ProductProviderIndex extends mixins(Base) {
  include:string[] = []
  headers = [
    {
      text: 'ID',
      align: 'right',
      sortable: true,
      value: 'id'
    },
    { text: 'NAME', value: 'name', align: 'right' },
    { text: 'CODE', value: 'code', align: 'right' },
    { text: 'LEVEL', value: 'level', align: 'right' },
    { text: 'DESCRIPTION', value: 'description', align: 'right' },
    { text: 'CREATED_AT', value: 'created_at', align: 'right' },
    { text: 'UPDATED_AT', value: 'updated_at', align: 'right' }
  ]

  dialog = false

  delItem (id:number) {
    return this.deleteApi({id})
  }
}
</script>
