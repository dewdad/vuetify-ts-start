<template>
  <v-card>
    <v-card-title>图片上传</v-card-title>
    <v-container grid-list-xs fluid>
      <v-layout row wrap>
        <v-flex
          v-for="file in files"
          :key="file.id"
          xs4
        >
          <v-card flat tile>
            <v-progress-linear
              v-if="file.active || file.progress !== '0.00'"
              :value="file.progress"
              :color="file.progress !== '100.00' ? 'secondary' : 'success' "
              height="5"
              class="my-0"
            ></v-progress-linear>

            <v-card-media
              contain
              v-if="file.thumb"
              :src="file.thumb"
              height="150px"
            ></v-card-media>
            <v-card-text>
              <v-flex>
                <div>Error: {{file.error}}</div>
                <div>Error: {{file.success}}</div>
              </v-flex>
            </v-card-text>
            <v-card-actions>

            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <file-upload
      ref="upload"
      :name="name"
      :data="data"
      v-model="files"
      post-action="/api/assets/upload"
      @input-file="inputFile"
      @input-filter="inputFilter"
      multiple
      :headers="header"
    >
      <v-btn>上传文件</v-btn>
    </file-upload>
    <v-card-actions>
      <v-btn v-show="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">开始上传</v-btn>
      <v-btn v-show="$refs.upload && $refs.upload.active" @click.prevent="$refs.upload.active = false">停止上传</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import VueUploadComponent from 'vue-upload-component'
import { getToken } from '@/auth'

@Component({
  components:{
  'file-upload':VueUploadComponent
  }
  })
export default class Upload extends Vue {
  public $refs!: {
    'upload':VueUploadComponent
  }

  @Prop({default: 'avatar', type: String})
  name!:string

  @Prop({default: () => ({ path: 'product' }), type: Object})
  data!:{}

  header = {
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': getToken()
  }

  files:any[] = []

  inputFile (newFile:any, oldFile:any) {
    if (newFile && oldFile && !newFile.active && oldFile.active) {
      // 获得相应数据
      console.log('response', newFile.response)
      if (newFile.xhr) {
        //  获得响应状态码
        console.log('status', newFile.xhr.status)
      }
    }
  }

  inputFilter (newFile:any, oldFile:any, prevent:any) {
    if (newFile && !oldFile) {
      // 过滤不是图片后缀的文件
      if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
        return prevent()
      }
    }

    // 创建 blob 字段 用于图片预览
    newFile.blob = ''
    let URL = window.URL || (window as any).webkitURL
    if (URL && URL.createObjectURL) {
      newFile.blob = URL.createObjectURL(newFile.file)
    }

    // Thumbnails
    newFile.thumb = ''
    if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
      newFile.thumb = newFile.blob
    }
  }

  blobToUrl (blob:Blob) {
    return URL.createObjectURL(blob)
  }
}
</script>
