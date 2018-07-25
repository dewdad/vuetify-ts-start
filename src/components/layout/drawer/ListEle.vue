<template>
  <v-list>

    <template v-for="item in items">
      <v-list-group v-if="item.routes"
                    :key="item.meta.title + Math.random()"
                    :prepend-icon="item.meta.icon"
                    no-action>
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.meta.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-for="subItem in item.routes"
                     :key="subItem.name"
                     :to="{name:subItem.name}">
          <v-list-tile-content>
            <v-list-tile-title>{{ subItem.meta.title }}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-icon>{{ subItem.meta.action }}</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>

      <v-list-tile v-else
                   :key="item.name+Math.random()"
                   exact
                   :to="{name:item.name}">
        <v-list-tile-action>
          <v-icon>{{item.meta.icon}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{item.meta.title}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </template>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class ListItem extends Vue {
  get items () {
    return this.$store.getters.drawers
  }
}
</script>
