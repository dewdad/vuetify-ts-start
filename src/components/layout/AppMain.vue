<template>
  <v-container fluid fill-height grid-list-lg>
      <transition name="fade-transform" mode="out-in">
        <!-- <keep-alive :include="cachedViews"> -->
          <router-view></router-view>
        <!-- </keep-alive> -->
      </transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Main extends Vue {
  get cachedViews () {
    return this.$store.state.tagsView.cachedViews
  }

  get key () {
    return this.$route.fullPath
  }
}
</script>
