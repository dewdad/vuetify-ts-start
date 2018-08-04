<template>
  <v-layout
      style="flex-direction: column;"
      reverse
      fill-height
      align-center
      justify-center
      ma-0
    >
      <v-avatar :size="size" color="primary">
        <v-img class="avatar-radius" :src="avatar" v-bind:alt="name" v-if="avatar"></v-img>
        <span v-else class="white--text headline">{{ name.charAt(0) }}</span>
      </v-avatar>
      <div  :class="computeTextAlgin">
        <div class="white--text subheading">{{name}}</div>
        <span class="white--text caption">{{description}}</span>
      </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  })
export default class NameCardAvatar extends Vue {
  @Prop(Number) size!:number
  @Prop(String) avatar!:string
  @Prop(String) name!:string
  @Prop({type: Boolean, default: true}) mini!:boolean
  @Prop(String) description!:string
  get computeTextAlgin () {
    return (this.mini) ? 'text-sm-right' : 'text-sm-center'
  }
}
</script>

<style scoped>
  .avatar-radius{
    border-radius :50%;
  }
</style>
