<template>
  <v-list>
    <v-list-group v-bind="attr" v-if="item.children.length>0">
      <v-list-tile slot="activator">
        <v-list-tile-title>{{item.name}}</v-list-tile-title>

      </v-list-tile>

      <template v-for="child in item.children">
        <v-list-tile v-if="child.children.length===0" :key="child.name" :class="`ml-${deep+2}`">
          <v-list-tile-action></v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{child.name}}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
              <v-flex>
                <v-btn icon ripple>
                  <v-icon small color="grey lighten-1">add</v-icon>
                </v-btn>
                <v-btn icon ripple>
                  <v-icon small color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-flex>

          </v-list-tile-action>
        </v-list-tile>

        <base-list-item v-else :key="child.name" :deep="deep+1" :item="child" ></base-list-item>

      </template>

    </v-list-group>
    <v-list-tile  v-else>
      <v-list-tile-action>
        <v-icon  color="pink">star</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>{{item.name}}</v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name:'base-list-item'
  })
export default class BaseListItem extends Vue {
  @Prop({type: Object, default: () => {}}) item!:object

  @Prop({type: Number, default: 0}) deep!:number

  get attr () {
    const bind:{[propName:string]:any} = {
      'sub-group': this.deep>1,
      class: this.deep>1 ? `ml-${this.deep+1}` : ''
    }
    if (this.deep<=1) {
      bind['prepend-icon'] = 'star'
    }
    return bind
  }
}
</script>
