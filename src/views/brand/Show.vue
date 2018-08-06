<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12
            sm
            12
            md12
            lg8
            xl8>
      <name-card v-bind="attrs">
        <v-list slot="after-card-text" two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">phone</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{attrs.name}}</v-list-tile-title>
              <v-list-tile-sub-title>品牌名称</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mail</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{attrs.description}}</v-list-tile-title>
              <v-list-tile-sub-title>品牌描述</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </name-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Base from './mixins/Base'
import { Brand } from '@/store/modules/brand'
import NameCard from '@/components/card/NameCard.vue'

@Component({
  components:{
  'name-card':NameCard
  }
  })
export default class BrandShow extends mixins(Base) {
  loaded = false

  item:any|null = null

  include = ['avatars']

  async viewInit () {
    const {data} = await Brand.getInstance.with(this.include).show({id: +this.$route.params.id})
    this.item = data
  }

  get attrs () {
    const avatar = _.get(this.item, 'avatars.data[0].thumb.url', null)
    const cardBgImage = _.get(this.item, 'avatars.data[0].url', null)
    return Object.assign({}, this.item, {avatar}, {cardBgImage})
  }

  async created () {
    this.$nextTick(async () => {
      await this.viewInit()
      this.loaded = true
    })
  }
}
</script>

<style lang="stylus" scoped>
  .mt-45
    margin-top: -45px
  .mt-56
    margin-top: -56px
</style>
