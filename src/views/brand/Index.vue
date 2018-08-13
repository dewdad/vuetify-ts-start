<template>
<v-layout fill-height  justify-center>
  <v-flex xs12>
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
import { Component, Vue, Mixins } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'

import Base from './mixins/Base'
import { Brand } from '@/store/modules/brand'
import { With } from '@/utils/decorators'
@Component({
  components:{
  'base-data-table':()=>import('@/components/table/BaseDataTable.vue')
  }
  })
export default class BrandIndex extends Mixins(Base) {
  headers = [
    {
      text: 'ID',
      align: 'right',
      sortable: true,
      value: 'id'
    },
    { text: 'NAME', value: 'name', align: 'right' },
    { text: 'AVATAR', value: 'avatar', align: 'right' },
    { text: 'DESCRIPTION', value: 'description', align: 'right' },
    { text: 'CREATED_AT', value: 'created_at', align: 'right' },
    { text: 'UPDATED_AT', value: 'updated_at', align: 'right' }
  ]

  delItem (id:number) {
    return Brand.destroy({id})
  }

  @With(['avatars'])
  getDataFromApi (queryBuild = null) {
    return Brand.index(queryBuild)
  }

  async mounted () {
    // this.$store.getters.
  }
}
</script>
