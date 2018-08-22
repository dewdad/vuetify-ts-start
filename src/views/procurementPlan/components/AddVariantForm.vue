<template>
  <v-layout row
            justify-center>
    <v-dialog v-model="value"
              persistent
              max-width="500px">
      <v-card v-if="currentAddVariant.variant">
        <v-progress-linear :value="50"
                           class="my-0"
                           height="3"></v-progress-linear>
        <v-card-title primary-title>
          <v-layout column>
            <v-flex>
              <div class="headline">{{title}}</div>
              <div>SKU: {{currentAddVariant.variant.sku}}</div>
              <v-divider></v-divider>
              <div class='grey--text'>添加 {{currentAddVariant.variant.name+' '+ currentAddVariant.variant.attribute_key}}</div>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex>
                <v-text-field mask="###########"
                              v-model="currentAddVariant.price"
                              label="参考价格"
                              readonly
                              required></v-text-field>

                <v-select :items="currentAddVariant.variant.providers.data"
                          label="供应商"
                          :item-text="item=>item.name"
                          :item-value="item=>item"
                          no-data-text="该商品目前暂无供应商"
                          v-validate="'required'"
                          :error-messages="errors.first('provider')"
                          name="provider"
                          v-model="currentAddVariant.provider"
                          required
                          >
                  <template slot="item"
                            slot-scope="{item}">
                    <v-list-tile-avatar size="36"
                                        color="indigo"
                                        class="headline font-weight-light white--text">
                      {{ item.name.charAt(0) }}
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.name"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="item.description"></v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action-text>报价: {{item.pivot.price}}</v-list-tile-action-text>
                  </template>
                </v-select>
                <v-text-field v-if="currentAddVariant.provider"
                              mask="###########"
                              v-model="currentAddVariant.offerPrice"
                              label="供应商报价"
                              required></v-text-field>

                <v-text-field mask="###########"
                              v-model.number="currentAddVariant.pcs"
                              label="采购数量"
                              v-validate="'required|min_value:1'"
                              :error-messages="errors.first('pcs')"
                              name="pcs"
                              required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1"
                 flat
                 @click.native="setShow(false)">关闭</v-btn>
          <v-btn color="primary"
                 flat
                 @click.native="save">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Model } from 'vue-property-decorator'

export interface CurrentAddVariant {
  id?: number;
  offerPrice:number;
  pcs:number;
  price:number;
  variant:ApiResponse.ProductVariantData|null;
  provider:ApiResponse.ProductProviderData|null;
}

@Component({
  })
export default class AddVariantForm extends Vue {
  @Model('input', {type: Boolean, default: false}) value!:boolean

  @Prop({type: String, default: '完成采购明细'}) title!:string

  currentAddVariant:CurrentAddVariant = {
    provider: null,
    offerPrice: 0,
    price: 0,
    pcs: 0,
    variant: null
  }

  @Watch('currentAddVariant.provider')
  onProviderChange (val:any) {
    if (val) {
      this.currentAddVariant.offerPrice = val.pivot.price
    }
  }

  @Watch('currentAddVariant.variant')
  onVariantChange (val:any) {
    if (val) {
      this.currentAddVariant.price = val.price
    }
  }

  setShow (value:boolean) {
    this.$emit('input', value)
  }

  async save () {
    if (await this.$validator.validateAll()) {
      this.$emit('procurement-plan-save-variant', this.currentAddVariant)
    }
  }

  initForm () {
    this.currentAddVariant = {
      provider: null,
      offerPrice: 0,
      price: 0,
      pcs: 0,
      variant: null
    }
  }

  mounted () {
    this.$bus.$on('procurement-plan-edit-variant', (current:any) => {
      this.initForm()
      this.currentAddVariant = Object.assign({}, this.currentAddVariant, current)
    }, this)
  }
}
</script>
