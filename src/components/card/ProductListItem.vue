<template>
  <v-list-tile :key="product.id"
               avatar>

    <v-list-tile-avatar tile
                        size="48"
                        color="indigo"
                        class="headline font-weight-light white--text">
      <v-img v-if="avatar"
             :src="product.avatars.data[0].thumb.url"
             alt=""></v-img>
      <template v-else>
        {{ product.name.charAt(0) }}
      </template>
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>{{product.name}}</v-list-tile-title>
      <v-list-tile-sub-title>
        <v-layout row
                  wrap>
          <v-flex>
            <v-chip outline
                    small
                    color="primary">{{product.type.data.name}}</v-chip>

            <v-chip color="secondary"
                    text-color="white"
                    small>{{product.brand.data.name}}</v-chip>
            {{product.name_en}}
          </v-flex>

        </v-layout>
      </v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>

          <v-tooltip bottom v-if="relationed.includes(product.id)">
            <v-btn icon
                   @click="$emit('detach',product)"
                   slot="activator"
                   ripple>
              <v-icon color="red lighten-1">cancel</v-icon>
            </v-btn>
            <span>移除关联</span>
          </v-tooltip>

          <v-tooltip bottom v-else>
            <v-btn icon
                   @click="$emit('attach',product)"
                   slot="activator"
                   ripple>
              <v-icon color="grey lighten-1">info</v-icon>
            </v-btn>
            <span>加入关联</span>
          </v-tooltip>

    </v-list-tile-action>

  </v-list-tile>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  })
export default class ProductListItem extends Vue {
  @Prop({type: Object, default: () => {}}) product!:ApiResponse.ProductData

  @Prop({type: Array, default: () => []}) relationed!:number[]

  get avatar () {
    return this.product.avatars && this.product.avatars.data.length>0 && this.product.avatars.data[0].thumb.url
  }
}
</script>
