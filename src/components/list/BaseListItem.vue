<template>
  <v-list-group v-bind="attr"
                v-if="item.children.length>0">
    <v-list-tile slot="activator" @click="active(item)" :class="classObject(item.name)">
      <v-list-tile-content>
      <v-list-tile-title>
        {{item.name}}
      </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <template v-for="child in item.children">
      <v-list-tile v-if="child.children.length===0"
                   :key="child.name"
                   @click="active(child)"
                   :class="[`ml-${deep+2}`,classObject(child.name)]">
        <v-list-tile-action></v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title >{{child.name}}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>

            <v-btn icon
                   ripple>
              <v-icon small
                      color="grey lighten-1">delete</v-icon>
            </v-btn>

        </v-list-tile-action>
      </v-list-tile>

      <base-list-item v-else
                      :key="child.name"
                      :deep="deep+1"
                      :item="child"
                      v-on="$listeners"
                      :actived="actived"
                      ></base-list-item>

    </template>

  </v-list-group>
  <v-list-tile v-else @click="active(item)" :class="classObject(item.name)">
    <v-list-tile-action>
      <v-icon color="pink">star</v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{item.name}}</v-list-tile-title>
    </v-list-tile-content>
    <v-list-tile-action>

        <v-btn icon
               ripple>
          <v-icon small
                  color="grey lighten-1">delete</v-icon>
        </v-btn>

    </v-list-tile-action>
  </v-list-tile>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'

@Component({
  name:'base-list-item'
  })
export default class BaseListItem extends Vue {
  @Prop({type: Object, default: () => {}}) item!:object

  @Prop({type: Number, default: 0}) deep!:number

  @Model('active', {type: Object, default: () => null}) actived!:any

  activeClass = 'primary--text lighten-1'

  active (item :any) {
    this.$emit('active', item)
  }

  add (item:any) {
    alert(item.name)
  }

  get isActive () {
    return (name:string) => name === this.actived.name
  }

  get classObject () {
    return (name:string) => ({
      'primary--text lighten-1': this.isActive(name)
    })
  }

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
