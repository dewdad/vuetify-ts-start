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

          <product-list-item-with-variant v-for="product in productList" @detach="cancel" @edit="openForm" :product="product" :key="product.id"></product-list-item-with-variant>
        </v-list>

      </v-card-text>

      <div style="flex: 1 1 auto;"></div>
    </v-card>

    <v-layout row
              justify-center>
      <v-dialog v-model="dialogForm"
                persistent
                max-width="500px">
        <v-card>
          <v-progress-linear :value="50"
                             class="my-0"
                             height="3"></v-progress-linear>
          <v-card-title primary-title>
            <v-layout column>
              <v-flex>
                <div class="headline">输入供应商报价</div>
                <div>SKU: {{currentAddVariant.sku}}</div>
                <div>参考价: {{currentAddVariant.price}}</div>
                <v-divider></v-divider>
                <div class='grey--text'>添加 {{currentAddVariant.name+' '+ currentAddVariant.attribute_key|| '关联变体' }}</div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>
                  <v-text-field mask="###########"
                                v-model="currentAddVariant.prePrice"
                                label="价格"
                                required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey lighten-1"
                   flat
                   @click.native="dialogForm = false">关闭</v-btn>
            <v-btn color="primary"
                   flat
                   @click.native="save">保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-dialog
      v-model="willDeleteVariant.status"
      max-width="290"
    >
        <v-card>
          <v-card-title>{{willDeleteVariant.title}}</v-card-title>

          <v-card-text v-html="willDeleteVariant.description">

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="grey lighten-1"
              flat="flat"
              @click="willDeleteVariant.status = false"
            >
              取消
            </v-btn>

            <v-btn
              :loading="deleting"
              color="primary"
              flat="flat"
              @click="deleteHandle"
            >
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Product } from '@/store/modules/product'
import { ProductProvider, RelationProducts } from '@/store/modules/productProvider'
import { List } from '@/api/types'
import { With } from '@/utils/decorators'

type EventPayload = {variant:ApiResponse.ProductVariantData, name:string}

@Component({
  components:{
  'product-list-item-with-variant':()=>import('@/components/card/ProductListItemWithVariant.vue')
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

  currentAddVariant:any = {
    id: 0,
    name: '',
    code: '',
    attributes: [],
    prePrice: 0
  }

  willDeleteVariant:any = {
    status: false,
    title: null,
    description: null,
    item: null
  }

  deleting:boolean = false

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

  @With(['variants.attributes.attributeValue', 'type', 'brand', 'avatars'])
  listProductApi (payload:List) {
    return Product.index(payload)
  }

  async fetchProductList (queryBuild:List|null = null) {
    const {data, meta} = await this.listProductApi({...queryBuild, ...this.queryBuild})
    this.productList = data
    this.meta = meta
    this.fetched = true
  }

  async save () {
    console.log(this.params)
    await ProductProvider.attach(this.params)
    // await ProductProvider.products(this.params)
    this.dialogForm = false
    this.$success({text: '关联成功'})
  }

  openForm ({variant, name}:EventPayload) {
    this.currentAddVariant = {...variant, name}
    if (this.productIds[variant.id]) {
      this.currentAddVariant.prePrice =this.productIds[variant.id].price
    }
    this.dialogForm = true
  }

  setDeleteDialog (item:any) {
    this.willDeleteVariant = Object.assign({}, this.willDeleteVariant, item)
  }

  cancel ({variant, name}:EventPayload) {
    const title = name+' ' +variant.attribute_key
    const dialog = {
      title: `tips`,

      description: `是否取消 <b class="primary--text">${this.provider.name}</b> 对 <b class="primary--text">${title}</b> 的关联？`,
      status: !this.willDeleteVariant.status,
      item: {id: +this.$route.params.id, product_ids: variant.id}
    }
    this.setDeleteDialog(dialog)
  }

  async deleteHandle () {
    this.deleting = true
    // 发请求进行删除

    await ProductProvider.detach(this.willDeleteVariant.item)
    // await ProductProvider.products(this.willDeleteVariant.item, true)
    this.deleting = false
    const dialog = {
      title: null,
      description: null,
      status: !this.willDeleteVariant.status,
      item: null
    }
    this.setDeleteDialog(dialog)
    this.$success({text: '取消关联成功'})
  }

  getAttribute (attributes:any[]) {
    return (attributes.map((item:any) => item.attributeValue.value)).join('-')
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

  get params () {
    return {id: +this.$route.params.id, product: {id: this.currentAddVariant.id, attribute: {price: +this.currentAddVariant.prePrice}}}
  }

  get products () {
    return ProductProvider.getProducts(+this.$route.params.id)
  }

  get productIds () {
    return ProductProvider.productIds(+this.$route.params.id)
  }

  get provider () {
    return ProductProvider.provider(+this.$route.params.id)
  }
}
</script>
