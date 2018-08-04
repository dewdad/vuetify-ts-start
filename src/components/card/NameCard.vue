<template>
<div class="name-card">
  <v-card flat :color="color" ref="card"  :dark="dark">
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
    <v-img
      :src="bigBgImg"
      aspect-ratio="2.75"
      id="bg_image"
      :lazy-src="lazyBigBgImg"
      class="grey lighten-2"
    >
      <avatar v-bind="$props"></avatar>
    </v-img>
    <v-card-text>

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
  components:{
  'avatar':()=>import('./NameCardAvatar.vue')
  }
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

  get bigBgImg () {
    return this.cardBgImage || 'https://photo.tuchong.com/280776/f/484573381.jpg'
  }

  get lazyBigBgImg () {
    return this.avatar || 'https://photo.tuchong.com/280776/f/484573381.jpg'
  }
}
</script>

<style lang="stylus" scoped>
  .caption, .subheading {
    font-weight:200;
  }
  .blur {
    filter:blur(3px);
  }
  .no-blur {
    filter:blur(0);
  }

</style>
