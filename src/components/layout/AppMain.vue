<template>
  <v-container>
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key"></router-view>
        </keep-alive>
      </transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Main extends Vue {

}
</script>