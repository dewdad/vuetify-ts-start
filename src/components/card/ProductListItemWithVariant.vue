<template>
  <component :is="isComponent" v-bind="isComponentBind">
    <v-list-tile :key="product.id" v-bind="listTileBind"  avatar>

      <v-list-tile-avatar tile
                          size="48"
                          color="indigo"
                          class="headline font-weight-light white--text">
        <v-img v-if="avatar"
              :src="avatar"
              alt=""></v-img>
        <template v-else>
          {{ name.charAt(0) }}
        </template>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title>{{name}}</v-list-tile-title>
        <v-list-tile-sub-title>
          <v-layout row
                    wrap>
            <v-flex>
              <v-chip outline
                      small
                      color="primary">{{type}}</v-chip>

              <v-chip color="secondary"
                      text-color="white"
                      small>{{brand}}</v-chip>
              <slot name="sub-title" :product="product">{{product.name_en}}</slot>
            </v-flex>

          </v-layout>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <slot name="action" :product="product"></slot>
    </v-list-tile>
    <template v-for="(variant,index) in variants" >
      <v-list-tile :key="variant.sku" @click="$emit('edit',{variant,name})">

        <v-list-tile-content>
          <v-list-tile-title class="font-weight-regular">属性:{{ variant.attribute_key }}</v-list-tile-title>
          <v-list-tile-sub-title>sku: {{variant.sku}}</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action v-if="price(variant.id)">
          <v-layout row
                    wrap>
            <v-flex>

              报价: {{price(variant.id).price}}
              <v-btn icon ripple @click.stop="$emit('detach',{variant,name})">
                <v-icon color="grey lighten-1">cancel</v-icon>
              </v-btn>
            </v-flex>

          </v-layout>
        </v-list-tile-action>

      </v-list-tile>
      <v-divider inset v-if="index<variants.length-1" :key="index"></v-divider>
    </template>

  </component>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ProductProvider } from '@/store/modules/productProvider'
@Component({
  })
export default class ProductListItemWithVariant extends Vue {
  @Prop({type: Object, default: () => {}}) product!:ApiResponse.ProductData

  @Prop({type: Array, default: () => []}) relationed!:number[]

  get hasGroup () {
    return _.has(this.product, 'variants.data')
  }

  get isComponent () {
    return this.hasGroup ? 'v-list-group' : 'span'
  }

  get listTileBind () {
    return this.hasGroup ? {slot: 'activator'} : {}
  }

  get isComponentBind () {
    return this.hasGroup ? {noAction: true} : {}
  }

  get avatar () {
    return this.product.avatars && this.product.avatars.data.length>0 && this.product.avatars.data[0].thumb.url
  }

  get variants () {
    return _.get(this.product, 'variants.data', [])
  }

  get productIds () {
    return ProductProvider.productIds(+this.$route.params.id)
  }

  get name () {
    return _.get(this.product, 'name', 'the product name not found !')
  }

  get type () {
    return _.isString(_.get(this.product, 'type')) ? _.get(this.product, 'type') : _.get(this.product, 'type.data.name', 'product type not found!')
  }

  get brand () {
    return _.isString(_.get(this.product, 'brand')) ? _.get(this.product, 'brand') : _.get(this.product, 'brand.data.name', 'product brand not found!')
  }

  get providerOffer () {
    return ProductProvider.providerOffer(+this.$route.params.id)
  }

  get price () {
    return (id:number) => (this.providerOffer.find((item:any) => item.product_variant_id === id))
  }
}
</script>
