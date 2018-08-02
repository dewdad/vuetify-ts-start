<template>
  <v-layout row>
    <v-flex xs4>
      <v-subheader>{{label}}</v-subheader>
    </v-flex>
    <v-flex xs8>
      <slot></slot>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name:'base-form-item',
  components:{
  'file-upload':()=>import('@/components/fileUpload/Upload.vue')
  }
  })
export default class BaseFormItemWrap extends Vue {
  @Prop(String) label!:string;
}
</script>
