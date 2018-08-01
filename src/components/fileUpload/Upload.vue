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
            <!-- <v-progress-linear
              v-if="file.active || file.progress !== '0.00'"
              :value="file.progress"
              :color="file.progress !== '100.00' ? 'secondary' : 'success' "
              height="5"
              class="my-0"
            ></v-progress-linear> -->
            <!-- <img v-if="file.thumb" height="150px" :src="file.thumb" style="object-fit: cover;" alt=""> -->
            <v-card-media
              :style="progress(file.progress)"
              class="white--text"
              v-if="file.thumb"
              :src="file.thumb"
              height="150px"
            >
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-center flexbox>
                    <span class="headline">Top 10 Australian beaches</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>
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
      v-ripple
      class="v-btn upload-btn"
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

        <div class="v-btn__content">
        上传文件
        <v-icon right dark>cloud_upload</v-icon>
        </div>
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

  open () {
    this.$refs.upload.$el.dispatchEvent(new MouseEvent('click'))
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

  get progress () {
    return (percent:number) => {
      const num = percent || 0
      return {
        filter: `opacity(${+num+50}%)`
      }
    }
  }
}
</script>

<style scoped>
.upload-btn {
  cursor: pointer;
}
</style>
