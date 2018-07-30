<template>
  <v-dialog v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            scrollable>
    <v-card tile>
      <v-toolbar card
                 dark
                 color="primary">
        <v-btn icon
               dark
               @click.native="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>添加关联产品</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
                  flat
                  solo-inverted
                  hide-details
                  append-icon="search"
                  label="Search"
                  v-model="search"
                  class="hidden-sm-and-down"
                  @keydown.enter="searchHandel"
                  @click:append="searchHandel"
                ></v-text-field>
        <!-- <v-toolbar-items>
              <v-btn dark flat @click.native="dialog = false">Save</v-btn>
            </v-toolbar-items> -->
      </v-toolbar>
      <v-card-text>

        <v-list three-line
                expand>
                <v-text-field
                  flat
                  color="white"
                  solo-inverted
                  hide-details
                  append-icon="search"
                  label="Search"
                  v-model="search"
                  @keydown.enter="searchHandel"
                  @click:append="searchHandel"
                  class="hidden-md-and-up grey lighten-5"
                ></v-text-field>
          <template v-for="(item,index) in productList">

              <v-list-tile :key="item.id" avatar @click="openProductShow(item)">
                <v-list-tile-avatar color="indigo"
                                    class="headline font-weight-light white--text">
                  {{ item.name.charAt(0) }}
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>

                  <v-list-tile-sub-title>
                    <v-layout row
                              wrap>
                      <v-flex>
                        <v-chip outline
                                small
                                color="primary">{{item.type.data.name}}</v-chip>

                        <v-chip color="secondary" text-color="white"
                                small
                                >{{item.brand.data.name}}</v-chip>
                        {{item.name_en}}
                      </v-flex>

                    </v-layout>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-layout row wrap>
                          <v-flex v-if="productIds.includes(item.id)">
                            <v-tooltip bottom>
                              <v-btn @click.stop="relationProduct(item,true)" icon slot="activator" ripple>
                              <v-icon  color="red lighten-1">cancel</v-icon>
                              </v-btn>
                              <span>从分类中移除</span>
                            </v-tooltip>
                          </v-flex>
                          <v-flex v-else>
                            <v-tooltip bottom>
                              <v-btn @click.stop="relationProduct(item,false)" icon slot="activator" ripple>
                              <v-icon color="grey lighten-1">info</v-icon>
                              </v-btn>
                              <span>加入到该分类</span>
                            </v-tooltip>
                          </v-flex>
                        </v-layout>
                  </v-list-tile-action>
              </v-list-tile>

              <v-divider v-if="index!==productList.length-1" :key="item.code"></v-divider>
          </template>
        </v-list>

      </v-card-text>

      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Product } from '@/store/modules/product'
// import { ProductProvider, RelationProducts } from '@/store/modules/productProvider'
import { QueryBuild } from '@/api/types'
import { Category } from '@/store/modules/category'

@Component
export default class RelationProduct extends Vue {
  dialog:boolean = false

  dialogForm:boolean = false

  productList:any[] = []

  meta:any = null

  search:string = ''

  lastSearch:string = ''

  fetched:boolean = false

  cacheProductList:any[] = []

  cacheMeta:any = null

  queryBuild = {per_page: 999}

  @Watch('dialog')
  async onDialogChange (v:boolean) {
    if (v && !this.fetched) {
      await this.fetchProductList()
      this.cacheList()
    }
  }

  @Watch('search')
  onSearchChange (val:string, oldVal:string) {
    if (val.length === 0 && oldVal.length === 0) return
    if (val.length === 0) {
      this.productList = this.cacheProductList
      this.meta = this.cacheMeta
    }
  }

  async fetchProductList (queryBuild:QueryBuild|null = null) {
    const {data, meta} = await Product.getInstance.with(['type', 'brand']).index({...queryBuild, ...this.queryBuild})
    this.productList = data
    this.meta = meta
    this.fetched = true
  }

  cacheList () {
    this.cacheProductList = _.cloneDeep(this.productList)
    this.cacheMeta = _.cloneDeep(this.meta)
  }

  searchHandel () {
    if (this.search === this.lastSearch || this.search.length === 0) return
    // this.cacheList()
    const queryBuild = {search: this.search, search_fields: 'name:like;name_en:like;code:like'}
    const throttle = (fn:any) => _.throttle(async (arg) => await fn(arg), 300)
    throttle(this.fetchProductList)(queryBuild)
    this.lastSearch = this.search
  }

  async relationProduct (product:ApiResponse.ProductData, cancel:boolean) {
    await Category.getInstance.products({id: +this.$route.params.id, product}, cancel)
  }

  get products () {
    return []
  }

  get productIds () {
    return Category.getInstance.productIds(+this.$route.params.id)
  }

  get provider () {
    return []
  }
}
</script>
