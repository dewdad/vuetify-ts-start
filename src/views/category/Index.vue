<template>
<v-layout fill-height  justify-center>
  <v-flex xs12>
    <base-list :items="tree"></base-list>
  <base-data-table ref="table" :headers="headers" :delItem="delItem" :getDataFromApi="getDataFromApi" :showItem="showItem" :editItem="editItem" liked>
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
import { Category } from '@/store/modules/category'

import BaseList from '@/components/list/BaseList.vue'

@Component({
  components:{
  'base-data-table':()=>import('@/components/table/BaseDataTable.vue'),
  'base-list':BaseList
  }
  })
export default class CategoryIndex extends mixins(Base) {
  include:string[] = []

  tree:any[] = []

  headers = [
    {
      text: 'ID',
      align: 'right',
      sortable: true,
      value: 'id'
    },
    { text: 'NAME', value: 'name', align: 'right' },
    { text: 'PARENT_NAME', value: 'parent_name', align: 'right' },
    { text: 'CREATED_AT', value: 'created_at', align: 'right' },
    { text: 'UPDATED_AT', value: 'updated_at', align: 'right' }
  ]

  delItem (id:number) {
    return Category.getInstance.destroy(id)
  }

  getDataFromApi (queryBuild = null) {
    return Category.getInstance.with(this.include).index(queryBuild)
  }

  async mounted () {
    let {data} = await Category.getInstance.toTree()
    this.tree = data
  }
}
</script>
