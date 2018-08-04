<template>
  <v-card>
    <v-progress-linear
          :value="50"
          class="my-0"
          height="3"
    ></v-progress-linear>
    <!-- <v-card-title>{{label}}</v-card-title>
    <v-divider></v-divider> -->
    <v-container  fluid grid-list-xs v-if="urls.length>0">
      <v-layout row wrap>
        <v-flex
          v-for="url in urls"
          :key="url"
          v-bind="{'xs3':urls.length>2}"
        >
          <uploaded-item
            :url="url"
            @active-menu="activeMenu"
            @image-remove="onImageRemove"
          ></uploaded-item>
        </v-flex>
      </v-layout>
    </v-container>
    <v-divider></v-divider>
    <v-container  fluid grid-list-xs>
      <v-layout row wrap>
        <v-alert
          v-if="files.length === 0"
          :value="true"
          color="info"
          icon="priority_high"
          outline
        >
          暂无图片
        </v-alert>

        <v-flex
          v-for="file in files"
          :key="file.id"
          xs3
        >
          <upload-item
            :file="file"
            @active-menu="activeMenu"
            @image-edit="onEditFileShow"
            @image-remove="onImageRemove"
          ></upload-item>
        </v-flex>
      </v-layout>
    </v-container>

    <v-card-actions>
      <v-btn flat @click="clear">清空</v-btn>
      <v-spacer></v-spacer>
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
        选择图片
        </div>
    </file-upload>
      <v-btn v-show="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
        开始上传
        <v-icon right dark>cloud_upload</v-icon>
      </v-btn>
      <v-btn v-show="$refs.upload && $refs.upload.active" @click.prevent="$refs.upload.active = false">
        停止上传
        <v-icon right dark>check_circle</v-icon>
      </v-btn>
    </v-card-actions>
    <edit-image v-model="editFile"></edit-image>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator'
import VueUploadComponent from 'vue-upload-component'
import { getToken } from '@/auth'
import UploadItem from './UploadItem.vue'
import EditImage from './EditImage.vue'
import UploadedItem from './UploadedItem.vue'

@Component({
  components:{
  'file-upload':VueUploadComponent,
  'upload-item':UploadItem,
  'edit-image':EditImage,
  'uploaded-item':UploadedItem
  }
  })
export default class Upload extends Vue {
  public $refs!: {
    'upload':VueUploadComponent
  }

  @Model('input', {type: Array, default: () => []}) urls!:string[]

  @Prop({default: 'avatar', type: String})
  name!:string

  @Prop({default: () => ({ path: 'product' }), type: Object})
  data!:{}

  @Prop({type: String, default: '图片上传'}) label!:string

  @Watch('editFile.show')
  onEditShowChange (newValue:boolean, oldValue:boolean) {
    // 关闭了 自动删除 error
    if (!newValue && oldValue) {
      // this.$emit('image-uploaded')
      this.$refs.upload.update(this.editFile.id, { error: this.editFile.error || '' })
    }
  }

  uploadAuto = false

  showMenuStacks:any[] = []

  header = {
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': getToken()
  }

  // 选择上传图片
  open () {
    this.$refs.upload.$el.dispatchEvent(new MouseEvent('click'))
  }

  files:any[] = []

  editFile= {
    id: '',
    error: '',
    show: false,
    name: ''
  }

  // 激活编辑页面
  onEditFileShow (file:any) {
    this.editFile = { ...file, show: true }
    this.$refs.upload.update(file, { error: 'edit' })
  }

  // 图片删除事件
  onImageRemove (file:any) {
    this.$refs.upload.remove(file)
  }

  inputFile (newFile:any, oldFile:any) {
    if (newFile && oldFile) {
      // update

      if (newFile.active && !oldFile.active) {
        // beforeSend

        // min size
        // if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
        //   this.$refs.upload.update(newFile, { error: 'size' })
        // }
      }

      if (newFile.progress !== oldFile.progress) {
        // progress
      }

      if (newFile.error && !oldFile.error) {
        // error
      }

      if (newFile.success && !oldFile.success) {
        // success
      }

      if (newFile.xhr) {
        //  获得响应状态码
        if (newFile.xhr.status === 200) {
          if (!this.urls.includes(newFile.response.data.url)) {
            this.$emit('input', [...this.urls, newFile.response.data.url])
          }
        }
      }
    }

    if (!newFile && oldFile) {
      // remove
      if (oldFile.success && oldFile.response.id) {
        // $.ajax({
        //   type: 'DELETE',
        //   url: '/upload/delete?id=' + oldFile.response.id,
        // })
      }
    }

    // Automatically activate upload
    if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
      if (this.uploadAuto && !this.$refs.upload.active) {
        this.$refs.upload.active = true
      }
    }
  }

  inputFilter (newFile:any, oldFile:any, prevent:any) {
    // 添加文件
    if (newFile && !oldFile) {
      // 过滤不是图片后缀的文件
      if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
        return prevent()
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || (window as any).webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }

        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    }
  }

  // 鼠标右键状态栈
  activeMenu (vm:any) {
    const id = vm._uid
    const current = this.showMenuStacks.find(item => item._uid===vm._uid)
    if (!current) this.showMenuStacks.push(vm)

    this.showMenuStacks.forEach(item => {
      if (item._uid!==id) item.showMenu = false
    })
  }

  clear () {
    this.$emit('clear')
    this.$refs.upload.clear()
  }
}
</script>

<style scoped>
.upload-btn {
  cursor: pointer;
}
</style>
