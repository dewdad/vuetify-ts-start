<template>
  <v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
    <v-card>
      <v-card-title>采购管理</v-card-title>
      <v-card-text>
        <upload></upload>
      </v-card-text>
    </v-card>
  </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Upload from '@/components/fileUpload/Upload.vue'
@Component({
  components:{
  'upload':Upload
  }
  })
export default class Procurement extends Vue {

}
</script>
