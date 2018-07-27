<template>
  <v-card>
    <v-card-title>
      <v-layout row wrap>

      <!-- 创建按钮插槽 -->
      <slot name="storeButton"/>

      <v-spacer></v-spacer>
      <!-- <table-search-input v-if="searchable" @searchChangeEvent="searchChangeEvent" :liked="liked"></table-search-input> -->
      </v-layout>
      </v-card-title>
    <v-data-table :headers="headers"
                  :items="dataList"
                  :pagination.sync="pagination"
                  :total-items="totalDesserts"
                  :loading="loading"
                  class="elevation-1"
                  @update:pagination="updatePagination"
                  disable-initial-sort
                  :rows-per-page-items="rowsPerPageItems"
                  :select-all="selectAll"
                  v-model="selected"
                  >

      <template slot="headers"
                slot-scope="props">
        <tr>
          <th v-if="selectAll">
            <v-checkbox :input-value="props.all"
                        :indeterminate="props.indeterminate"
                        primary
                        hide-details
                        @click.native="toggleAll"></v-checkbox>
          </th>
          <th v-for="header in props.headers"
              :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '',`text-xs-${header.align?header.align:'right'}`]"
              @click="changeSort(header.value)">
            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>
          <th class="text-xs-right">Actions</th>
        </tr>
      </template>

      <v-progress-linear slot="progress"
                         color="blue"
                         indeterminate></v-progress-linear>

      <template slot="items"
                slot-scope="props">

          <td v-if="selectAll">
            <v-checkbox :input-value="props.selected"
                        primary
                        hide-details></v-checkbox>
          </td>
          <td v-for="row in randerTableData(props)"
              :key="row.text"
              :class="row.class">{{ row.value }}</td>

          <td class="justify-center layout px-0">

                <v-tooltip bottom>
                  <v-btn slot="activator" icon small class="mr-2" @click="showItem(props.item.id)"><v-icon small color="success">insert_drive_file</v-icon></v-btn>
                  <span>查看</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <v-btn slot="activator" icon small class="mr-2" @click="editItem(props.item.id)"><v-icon small color="info">edit</v-icon></v-btn>
                  <span>编辑</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <v-btn slot="activator"  icon small class="mr-2" @click="deleteItem(props.item)"><v-icon small color="error">delete</v-icon></v-btn>
                  <span>删除</span>
                </v-tooltip>

          </td>

      </template>

      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>

    </v-data-table>
    <v-dialog
      v-model="deleteDialog.status"
      max-width="290"
    >
        <v-card>
          <v-card-title class="headline">{{deleteDialog.title}}</v-card-title>

          <v-card-text>
            {{deleteDialog.description}}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="deleteDialog.status = false"
            >
              Disagree
            </v-btn>

            <v-btn
              :loading="deleting"
              color="green darken-1"
              flat="flat"
              @click="deleteHandle"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components:{
  'table-search-input':()=>import('@/components/search/TableSearchInput.vue')
  }
  })
export default class BaseDataTable extends Vue {
  @Prop({default: 'text-xs-right'}) defaultRowClass!: string
  @Prop({default: true}) selectAll!:boolean
  @Prop({type: Array, required: true}) headers!:any[]
  @Prop({type: Function, required: true}) getDataFromApi!:Function
  @Prop(Function) showItem!:Function
  @Prop(Function) editItem!:Function
  @Prop({type: Boolean, default: true}) searchable!:boolean
  @Prop(Boolean) liked!:boolean

  selected= []
  deleteDialog= {
    status: false,
    title: null,
    description: null
  }
  deleting= false
  rowsPerPageItems= [10, 15, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }]
  totalDesserts= 0
  dataList= []
  loading= true
  pagination:{[propName:string]:any}= {}
  // queryBuild= {},
  originPagination= ['descending', 'page', 'sortBy', 'rowsPerPage']
  search:string= ''

  searchChangeEvent ({ search, like }:({search:string, like:boolean})) {
    this.search = search
    if (!_.isEmpty(search) && like) {
      search = `${search}:`
    }
    this.searchHandle(search)
  }

  deleteItem (item:any) {
    const dialog = {
      title: `是否删除${item.name}？`,
      description: 'Is it sure to delete this record',
      status: !this.deleteDialog.status
    }
    this.setDeleteDialog(dialog)
  }

  deleteHandle () {
    this.deleting = true
    // 发请求进行删除
    setTimeout(() => {
      this.deleting = false
      const dialog = {
        title: null,
        description: null,
        status: !this.deleteDialog.status
      }
      this.setDeleteDialog(dialog)

      // this.$store.commit('app/TOGGLE_SNACKBAR', { status: true, text: '删除成功', color: 'success' })
    }, 3000)
  }

  setDeleteDialog (item:any) {
    this.deleteDialog = Object.assign({}, this.deleteDialog, item)
  }

  toggleAll () {
    if (this.selected.length) this.selected = []
    else this.selected = this.dataList.slice()
  }

  randerTableData (props:any) {
    return this.headers.map((item, index) => {
      const origin:{[propName:string]:any} = {}
      if (!_.has(item, 'class')) {
        origin.class = this.defaultRowClass
      } else if (_.has(item, 'class')) {
        origin.class = item.class
      }
      return Object.assign({}, { field: [item.value], value: _.get(props.item, item.value) }, origin)
    })
  }

  changeSort (value:any) {
    console.log(value)
  }
  /**
   * @description 搜索处理函数
   * @param {search} 搜索条件
   */
  searchHandle (search:string) {
    _.throttle(async (search) => {
      await this.fetchData(search)
    }, 300)
  }

  /**
   * @description 分页对象更新处理函数
   * @param {pagination} 本地分页
   */
  async updatePagination (pagination:any) {
    await this.fetchData()
  }

  async refresh () {
    await this.fetchData()
  }

  /**
   * @description 数据请求
   * @param {queryBuild} 查询参数
   */
  async fetchData (queryBuild = null) {
    this.loading = true
    this.fill(await this.getDataFromApi(Object.assign({}, this.queryBuild, queryBuild)))
    this.loading = false
  }

  /**
   * @description 填充数据
   * @param {requestData}
   */
  fill (requestData:any) {
    const { data, meta } = requestData
    this.dataList = data
    if (meta) {
      this.totalDesserts = meta.pagination.total
      this.fillPagination(meta.pagination)
    }
  }

  /**
   * @description 填充本地分页对象
   * @param {pagination}
   */
  fillPagination (pagination:any) {
    this.pagination.rowsPerPage = pagination.per_page
    this.pagination.totalDesserts = pagination.total
  }

  get queryBuild () {
    return {
      order: this.pagination.descending ? 'asc' : 'desc',
      sort_by: this.pagination.sortBy,
      page: this.pagination.page,
      per_page: this.pagination.rowsPerPage
    }
  }
}
</script>
