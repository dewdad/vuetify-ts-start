<template>
  <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>添加关联产品</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-toolbar-items>
              <v-btn dark flat @click.native="dialog = false">Save</v-btn>
            </v-toolbar-items> -->
          </v-toolbar>
          <v-card-text>

            <v-list three-line expand>
          <template v-for="item in productList">
            <v-list-group
                    :key="item.code"
                    no-action>

            <v-list-tile avatar slot="activator">
              <v-list-tile-avatar
                color="indigo"
                class="headline font-weight-light white--text"
              >
                {{ item.name.charAt(0) }}
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="item.name"></v-list-tile-title>

                <v-list-tile-sub-title>
                    <v-layout row wrap>
                      <v-flex>
                        <v-chip outline small color="primary">{{item.type.name}}</v-chip>

                        {{item.name_en}}
                      </v-flex>

                    </v-layout>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-for="variant in item.variants"
                     :key="variant.sku"
                     @click="openForm(item,variant)"
                     >
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-regular">属性:{{ getAttribute(variant.attributes) }}</v-list-tile-title>
                <v-list-tile-sub-title>sku: {{variant.sku}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="productIds[variant.id]">
                <v-layout row wrap>
                      <v-flex>
                        <v-icon color="grey lighten-1">info</v-icon>
                        报价: {{productIds[variant.id].price}}
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

        <v-layout row justify-center>
    <v-dialog v-model="dialogForm" persistent max-width="500px">
      <v-card>
        <v-progress-linear
          :value="50"
          class="my-0"
          height="3"
        ></v-progress-linear>
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
                <v-text-field mask="###########" v-model="currentAddVariant.prePrice" label="价格" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialogForm = false">关闭</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

      </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Product } from '@/store/modules/product'
import { ProductProvider, RelationProducts } from '@/store/modules/productProvider'

@Component
export default class RelationProduct extends Vue {
  dialog:boolean = false

  dialogForm:boolean = false

  productList:any[] = []

  meta:any = null

  currentAddVariant:any = {
    id: 0,
    name: '',
    code: '',
    attributes: [],
    prePrice: 0
  }

  @Watch('dialog')
  async onDialogChange (v:boolean) {
    if (v && this.productList.length<1) {
      await this.fetchProductList()
    }
  }

  async fetchProductList () {
    const {data, meta} = await Product.getInstance.with(['variants.attributes.attributeValue', 'type']).index()
    this.productList = Product.getInstance.filterData(data)
    this.meta = meta
  }

  async save () {
    await ProductProvider.getInstance.products(this.params as any)
    this.dialogForm = false
  }

  openForm (product:any, variant:any) {
    this.currentAddVariant = {...variant, name: product.name}
    if (this.productIds[variant.id]) {
      this.currentAddVariant.prePrice =this.productIds[variant.id].price
    }
    this.dialogForm = true
  }

  getAttribute (attributes:any[]) {
    return (attributes.map((item:any) => item.attributeValue.value)).join('-')
  }

  get params () {
    return {id: this.$route.params.id, products: {[this.currentAddVariant.id]: {price: +this.currentAddVariant.prePrice}}}
  }

  get products () {
    return ProductProvider.getInstance.getProducts(this.$route.params.id)
  }

  get productIds () {
    return ProductProvider.getInstance.productIds(this.$route.params.id)
  }
}
</script>
