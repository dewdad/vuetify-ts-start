<template>
<div class="name-card">
  <v-card flat :color="color" ref="card" :dark="dark" :img="cardBgImage">
    <v-card-media v-if="showTopNav">
      <v-layout row justify-space-between class="ma-0">
        <v-flex xs2>
          <v-icon color="pink">favorite</v-icon>
        </v-flex>
        <v-flex xs2 class="text-sm-right">
          <v-icon>more_vert</v-icon>
        </v-flex>
      </v-layout>
    </v-card-media>
    <v-card-text>
      <div class="layout ma-0 align-center" :class="computeCardLayout">
        <v-avatar :size="computeAvatarSize" color="primary">
          <img v-bind:src="avatar" v-bind:alt="name" v-if="showAvatar">
          <span v-else class="white--text headline">{{ name.charAt(0) }}</span>
        </v-avatar>
        <div class="flex" :class="computeTextAlgin">
          <div class="white--text subheading">{{name}}</div>
          <span class="white--text caption">{{description}}</span>
        </div>
      </div>
      <slot name="card-text"></slot>
    </v-card-text>
  </v-card>
  <slot name="after-card-text"></slot>
  <v-bottom-nav :value="true" color="transparent" :height="64" v-if="showBottomNav">
    <v-btn flat color="teal" value="recent">
      <span>Recent</span>
      <v-icon>history</v-icon>
    </v-btn>
    <v-btn flat color="teal" value="favorites">
      <span>Favorites</span>
      <v-icon>favorite</v-icon>
    </v-btn>
    <v-btn flat color="teal" value="nearby">
      <span>Nearby</span>
      <v-icon>place</v-icon>
    </v-btn>
  </v-bottom-nav>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  })
export default class NameCard extends Vue {
  @Prop({type: String, default: ''}) name!:string

  @Prop({type: String, default: null}) avatar!:null|string

  @Prop({type: String, default: ''}) description!:string

  @Prop({type: String, default: ''}) cardBgImage!:string

  @Prop({type: String, default: ''}) color!:string

  @Prop({type: Boolean, default: false}) dark!:boolean

  @Prop({type: Boolean, default: false}) bottomNav!:boolean

  @Prop({type: Boolean, default: false}) topNav!:boolean

  @Prop({type: Boolean, default: false}) mini!:boolean

  get computeCardLayout () {
    return (this.mini) ? 'row' : 'column'
  }
  get computeTextAlgin () {
    return (this.mini) ? 'text-sm-right' : 'text-sm-center'
  }
  get computeAvatarSize () {
    return (this.mini) ? '48' : '96'
  }
  get showAvatar () {
    return this.avatar
  }
  get showBottomNav () {
    return (this.mini === false && this.bottomNav)
  }
  get showTopNav () {
    return (this.mini === false && this.topNav)
  }
}
</script>

<style lang="stylus" scoped>
  .caption, .subheading {
    font-weight:200;
  }
</style>
