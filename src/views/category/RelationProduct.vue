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
        <v-text-field flat
                      solo-inverted
                      hide-details
                      append-icon="search"
                      label="Search"
                      v-model="search"
                      class="hidden-sm-and-down"
                      @keydown.enter="searchHandel"
                      @click:append="searchHandel"></v-text-field>
        <!-- <v-toolbar-items>
              <v-btn dark flat @click.native="dialog = false">Save</v-btn>
            </v-toolbar-items> -->
      </v-toolbar>
      <v-card-text>

        <v-list three-line
                expand>
          <v-text-field flat
                        color="white"
                        solo-inverted
                        hide-details
                        append-icon="search"
                        label="Search"
                        v-model="search"
                        @keydown.enter="searchHandel"
                        @click:append="searchHandel"
                        class="hidden-md-and-up grey lighten-5"></v-text-field>
          <template v-for="(item,index) in productList">
            <product-list-item :product="item"
                               :key="item.id"
                               :relationed="productIds" @attach="attach" @detach="detach"></product-list-item>
            <v-divider v-if="index!==productList.length-1"
                       :key="item.code"></v-divider>
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
import { Category } from '@/store/modules/category'
import { List } from '@/api/types'
import { With } from '@/utils/decorators'

@Component({
  components:{
  'product-list-item':()=>import('@/components/card/ProductListItem.vue')
  }
  })
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

  @With(['type', 'brand', 'avatars'])
  listProductApi (payload:List) {
    return Product.index(payload)
  }

  async fetchProductList (queryBuild:List|null = null) {
    const {data, meta} = await this.listProductApi({...queryBuild, ...this.queryBuild})
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

  async attach (product:ApiResponse.ProductData) {
    await Category.products({id: +this.$route.params.id, product}, false)
  }

  async detach (product:ApiResponse.ProductData) {
    await Category.products({id: +this.$route.params.id, product}, true)
  }

  get products () {
    return []
  }

  get productIds () {
    return Category.productIds(+this.$route.params.id)
  }

  get provider () {
    return []
  }
}
</script>
