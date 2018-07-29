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
          <template v-for="item in productList">
            <v-list-group :key="item.id"
                          no-action>

              <v-list-tile avatar
                           slot="activator">
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
                                color="primary">{{item.type.name}}</v-chip>

                        <v-chip color="secondary" text-color="white"
                                small
                                >{{item.brand.name}}</v-chip>
                        {{item.name_en}}
                      </v-flex>

                    </v-layout>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-for="variant in item.variants"
                           :key="variant.sku"
                           @click="openForm(item,variant)">
                <v-list-tile-content>
                  <v-list-tile-title class="font-weight-regular">属性:{{ getAttribute(variant.attributes) }}</v-list-tile-title>
                  <v-list-tile-sub-title>sku: {{variant.sku}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action v-if="productIds[variant.id]">
                  <v-layout row
                            wrap>
                    <v-flex>

                      报价: {{productIds[variant.id].price}}
                      <v-btn icon ripple @click.stop.native="cancel(item,variant)">
                        <v-icon color="grey lighten-1">cancel</v-icon>
                      </v-btn>
                    </v-flex>

                  </v-layout>
                </v-list-tile-action>
                <!-- <v-list-tile-action>
                <v-icon>{{ subItem.meta.action }}</v-icon>
              </v-list-tile-action> -->
              </v-list-tile>

            </v-list-group>
          </template>
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
                <div class='grey--text'>添加 {{currentAddVariant.name+' '+ getAttribute(currentAddVariant.attributes)|| '关联变体' }}</div>
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

          <v-card-text>
            {{willDeleteVariant.description}}
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
import { QueryBuild } from '@/api/types'

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

  async fetchProductList (queryBuild:QueryBuild|null = null) {
    const {data, meta} = await Product.getInstance.with(['variants.attributes.attributeValue', 'type', 'brand']).index({...queryBuild, ...this.queryBuild})
    this.productList = Product.getInstance.filterData(data)
    this.meta = meta
    this.fetched = true
  }

  async save () {
    await ProductProvider.getInstance.products(this.params as any)
    this.dialogForm = false
    this.$success({text: '关联成功'})
  }

  openForm (product:any, variant:any) {
    this.currentAddVariant = {...variant, name: product.name}
    if (this.productIds[variant.id]) {
      this.currentAddVariant.prePrice =this.productIds[variant.id].price
    }
    this.dialogForm = true
  }

  setDeleteDialog (item:any) {
    this.willDeleteVariant = Object.assign({}, this.willDeleteVariant, item)
  }

  cancel (product:any, variant:any) {
    const title = product.name+' ' +this.getAttribute(variant.attributes)
    const dialog = {
      title: `tips`,
      description: `是否取消 ${this.provider.name} 对 ${title} 的关联？`,
      status: !this.willDeleteVariant.status,
      item: {providerId: this.$route.params.id, variantId: variant.id}
    }
    this.setDeleteDialog(dialog)
  }

  async deleteHandle () {
    this.deleting = true
    // 发请求进行删除
    await ProductProvider.getInstance.products(this.willDeleteVariant.item, true)
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
    const queryBuild = {search: this.search, search_fields: 'name:like;name_en:like;code:lik'}
    const throttle = (fn:any) => _.throttle(async (arg) => await fn(arg), 300)
    throttle(this.fetchProductList)(queryBuild)
    this.lastSearch = this.search
  }

  get params () {
    return {providerId: this.$route.params.id, products: {[this.currentAddVariant.id]: {price: +this.currentAddVariant.prePrice}}}
  }

  get products () {
    return ProductProvider.getInstance.getProducts(this.$route.params.id)
  }

  get productIds () {
    return ProductProvider.getInstance.productIds(this.$route.params.id)
  }

  get provider () {
    return ProductProvider.getInstance.provider(this.$route.params.id)
  }
}
</script>
