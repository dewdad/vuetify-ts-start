<template>
  <v-toolbar
      color="blue darken-3"
      dark
      dense
      app
      fixed
      tabs
    >
      <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>

      <v-spacer></v-spacer>

      <!-- 全屏 -->
      <!-- <screenfull></screenfull> -->

      <!-- 多语言 -->
      <!-- <lang-select></lang-select> -->

      <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      transition="slide-y-transition"
      offset-x
      offset-y
      offset-overflow
    >
      <v-btn icon slot="activator" large>
        <v-avatar size="32px">
          <img
            :src="avatar"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="avatar" alt="John">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{name}}</v-list-tile-title>
              <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn
                :class="fav ? 'red--text' : ''"
                icon
                @click="fav = !fav"
              >
                <v-icon>favorite</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable messages</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable hints</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-title>首页</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-title>登出</v-list-tile-title>
          </v-list-tile>

        </v-list>

        <!-- <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" flat @click="menu = false">Save</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-menu>
    <tabs slot="extension"></tabs>
    </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tabs from './Tabs.vue'
@Component({
  components: {
  tabs: Tabs,
  },
  })
export default class ToolBar extends Vue {
    public fav: boolean = true;
    public menu: boolean = false;
    public message: boolean = false;
    public hints: boolean = true;
    public name: string = 'zhouchang';
    public avatar: string = 'https://sfault-avatar.b0.upaiyun.com/264/637/2646379122-59fc9a1534754_huge256';
    public toggleDrawer () {
      this.$store.dispatch('app/toggleDrawer')
    }

    get drawer () {
      return this.$store.getters.drawer
    }
}
</script>
