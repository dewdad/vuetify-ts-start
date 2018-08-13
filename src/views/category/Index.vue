<template>
  <v-layout fill-height
            v-bind="{'wrap':!$vuetify.breakpoint.lgAndUp}"
            justify-center>
    <v-flex xs12>
      <base-data-table ref="table" :headers="headers" :delItem="delItem" :getDataFromApi="listApi" :showItem="showItem" :editItem="editItem" liked>
      <!-- 创建表单 -->
      <v-btn color="info" slot="storeButton" @click="$router.push({name:routeName.create})">创建</v-btn>
      <!-- 更新表单 -->
      <update-data-from></update-data-from>
      </base-data-table>
    </v-flex>
    <v-flex xs12 md6>
      <form-body-card title="分类树">
        <base-list :items="tree"
                   v-model="active"></base-list>
      </form-body-card>

    </v-flex>
    <v-flex xs12 md6>

      <form-body-card title="当前分类">
        <v-menu slot="title-btn"
                bottom
                left>
          <v-btn slot="activator"
                 small
                 icon>
            <v-icon>more_vert</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile>
              <v-list-tile-title>添加</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-card-text>
          <v-alert v-if="!active.id"
                   :value="true"
                   color="info"
                   icon="priority_high"
                   outline>
            暂无目标
          </v-alert>
          <code v-else>
            {{currentCategory}}
          </code>
        </v-card-text>
      </form-body-card>

    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import { Category } from '@/store/modules/category'
import FormBodyCard from '@/components/card/FormBodyCard.vue'

import BaseList from '@/components/list/BaseList.vue'

@Component({
  components:{
  'base-data-table':()=>import('@/components/table/BaseDataTable.vue'),
  'base-list':BaseList,
  'form-body-card':FormBodyCard
  }
  })
export default class CategoryIndex extends mixins(Base) {
  include:string[] = []

  active:any = {}

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

  currentCategory:any = null

  @Watch('active')
  async onActiveChange (val:any) {
    // let res = await Category.getInstance.with(this.include).show({id:val.id})
    const {path} = this.$route
    this.$router.push({path, query: {id: val.id}})
    // console.log(res)
  }

  @Watch('$route.query.id')
  onCurrentIdChange (id:number) {
    this.fetchCategoryById(id)
  }

  async fetchCategoryById (id:number) {
    let res = await this.showApi({id})
    this.currentCategory = res
  }

  delItem (id:number) {
    return this.deleteApi({id})
  }

  async mounted () {
    let {data} = await Category.toTree()
    this.tree = data
  }

  get vuei () {
    return this.$vuetify
  }
}
</script>
