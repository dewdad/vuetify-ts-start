<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12>
      <v-card v-if="loaded">
        <v-img src="https://cdn.vuetifyjs.com/images/lists/ali.png"
               height="300px">
          <v-layout column
                    fill-height>
            <v-card-title>

              <v-spacer></v-spacer>

              <v-btn dark
                     :to="{name:'product-type.update',params:{id:item.id}}"
                     icon
                     class="mr-3">
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn dark
                     icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-card-title>

            <v-spacer></v-spacer>

            <v-card-title class="white--text pl-5 pt-5">
              <div class="display-1 pl-5 pt-5">{{item.name}}</div>
            </v-card-title>
          </v-layout>
        </v-img>

        <v-list two-line>

          <template v-for="(group,index) in attributeGroups">

            <v-list-tile :key="group.id">
              <v-list-tile-action>
                <v-icon color="primary" v-if="group.variant">add_shopping_cart</v-icon>
                <v-icon color="grey" v-else>bookmark_border</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{group.name}}</v-list-tile-title>
                <v-list-tile-sub-title>{{ group.variant ? '销售属性' : '非销售属性' }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon color="grey">info</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider inset :key="group.name + group.id" v-if="index < attributeGroups.length-1"></v-divider>

          </template>

        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import Form from '@/components/form/BaseForm.vue'
import { ProductType } from '@/store/modules/productType'
import AttributeGroupForm from '@/components/productType/AttributeGroupForm.vue'

@Component({
  components:{
  'base-form':Form,
  'attribute-group-form':AttributeGroupForm
  }
  })
export default class ProductTypeShow extends mixins(Base) {
  public $refs!: {
    form: Form,
  }

  loaded = false

  item = {} as ApiResponse.ProductTypeData

  selected:number[] = []

  async viewInit () {
    const { data } = await this.showApi({id: this.$route.params.id})
    this.item = data
  }

  get attributeGroups () {
    if (this.item) {
      const groups = this.item.attributeGroups
      if (groups) {
        return groups.data
      }
    }
    return []
  }

  async created () {
    this.$nextTick(async () => {
      await Promise.all([this.viewInit()])
      this.loaded = true
    })
  }
}
</script>
