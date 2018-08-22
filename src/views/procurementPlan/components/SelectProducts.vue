<template>
  <div>
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
            ></v-text-field>

      <product-list-item-with-variant v-for="product in productList" @detach="cancel" @edit="openForm" :product="product" :key="product.id">
        <v-list-tile-action slot="sub-list-tile-action" slot-scope="{variant}">
          <div class="flex">
            <v-list-tile-action-text>建议售价:{{variant.price}}</v-list-tile-action-text>
            <div class="action-avatar">
              <v-tooltip bottom v-for="provider in variant.providers.data" :key="provider.code">
                <v-avatar class="mx-1" size="18" slot="activator" :color="isActive(provider.id,variant.id)">
                  <span class="white--text">{{ provider.name.charAt(0) }}</span>
                </v-avatar>
                <span>{{provider.name}}</span>
              </v-tooltip>
            </div>
          </div>
        </v-list-tile-action>
      </product-list-item-with-variant>
    </v-list>
    <add-variant-form v-model="dialogForm" @procurement-plan-save-variant="save"></add-variant-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Model } from 'vue-property-decorator'
import { With } from '@/utils/decorators'
import { Product } from '@/store/modules/product'
import { List } from '@/api/types'
import { CurrentAddVariant } from '@/views/procurementPlan/components/AddVariantForm.vue'

@Component({
  components:{
  'product-list-item-with-variant':()=>import('@/components/card/ProductListItemWithVariant.vue'),
  'add-variant-form':()=>import('@/views/procurementPlan/components/AddVariantForm.vue'),
  }
  })
export default class SelectProducts extends Vue {
  @Model('input', {type: Array, default: () => []}) value!:CurrentAddVariant[]

  dialogForm:boolean = false

  productList:any[] = []

  meta:any = null

  search:string = ''

  lastSearch:string = ''

  fetched:boolean = false

  cacheProductList:any[] = []

  cacheMeta:any = null

  queryBuild = {per_page: 999}

  willDeleteVariant:any = {
    status: false,
    title: null,
    description: null,
    item: null
  }

  deleting:boolean = false

  @Watch('search')
  onSearchChange (val:string, oldVal:string) {
    if (val.length === 0 && oldVal.length === 0) return
    if (val.length === 0) {
      this.productList = this.cacheProductList
      this.meta = this.cacheMeta
    }
  }

  @With(['variants.providers', 'type', 'brand', 'avatars'])
  listProductApi (payload:List) {
    return Product.index(payload)
  }

  get isActive () {
    return (ProviderId:number, variantId:number) => this.inArray(ProviderId, variantId) ? 'primary' : 'grey lighten-1'
  }

  async fetchProductList (queryBuild:List|null = null) {
    const {data, meta} = await this.listProductApi({...queryBuild, ...this.queryBuild})
    this.productList = data
    this.meta = meta
    this.fetched = true
  }

  async save (currentAddVariant:any) {
    const variantId = _.get(currentAddVariant, 'variant.id')
    const ProviderId = _.get(currentAddVariant, 'provider.id')
    if (!this.inArray(ProviderId, variantId)) {
      const value = _.cloneDeep(this.value)
      this.value.push(_.cloneDeep(currentAddVariant))
      this.$emit('input', this.value)
      this.dialogForm = false
      this.$success({text: '添加成功'})
      return
    }
    this.$fail({text: '请勿重复添加'})
  }

  inArray (ProviderId:number, variantId:number) {
    return this.value.find((item:any) => item.provider.id === ProviderId && item.variant.id === variantId)
  }

  openForm ({variant, name}:any) {
    if (variant.providers.data.length === 0) {
      this.$fail({text: '该产品暂无供应商，无法进行采购！'})
      return
    }
    this.$bus.$emit('procurement-plan-edit-variant', {variant: {...variant, name}})
    this.dialogForm = true
  }

  setDeleteDialog (item:any) {
    this.willDeleteVariant = Object.assign({}, this.willDeleteVariant, item)
  }

  cancel ({variant, name}:any) {

  }

  async deleteHandle () {

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

  async mounted () {
    await this.fetchProductList()
    this.cacheList()
  }
}
</script>

<style scoped>
.action-avatar{
  display:flex;
  flex-direction:row;
  justify-content:flex-end !important;
}
</style>
