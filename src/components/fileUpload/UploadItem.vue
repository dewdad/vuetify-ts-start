
<template>
  <v-card flat tile @contextmenu="show" >
    <v-card-media
      :style="progress(file.progress)"
      class="white--text"
      v-if="file.thumb"
      :src="file.thumb"
      height="120px"
    >
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      transition="scale-transition"

    >
      <v-list>

        <v-list-tile disabled @click="onEditFileShow(file)">
          <v-list-tile-title>编辑</v-list-tile-title>
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile @click="deleteItem(file)">
          <v-list-tile-title>删除</v-list-tile-title>
          <v-list-tile-action>
            <v-icon>cancel</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-menu>
      <v-container fill-height fluid v-if="file.active || file.progress !== '0.00'">
        <v-layout align-center justify-center>
          <v-flex xs12  text-xs-center >
            <v-progress-circular
              v-if="file.active"
              :rotate="-90"
              :size="100"
              :width="15"
              :value="+file.progress"
              color="primary"
            >
              {{ file.progress +'%' }}
            </v-progress-circular>
            <v-icon x-large color="error" v-if="file.error">info</v-icon>
            <v-icon x-large color="success" v-if="file.success">check_circle</v-icon>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-media>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components:{

  }
  })
export default class UploadItem extends Vue {
  @Prop(Object) file!:object

  showMenu = false
  x = 0
  y = 0

  items = [
    { title: '编辑' },
    { title: '取消' },
    { title: '重新上传' }
  ]

  onEditFileShow (file:any) {
    this.$emit('image-edit', file)
  }

  deleteItem (file:any) {
    this.$emit('image-remove', file)
  }

  show (e:MouseEvent) {
    e.preventDefault()
    this.showMenu = false
    this.x = e.clientX
    this.y = e.clientY
    this.$nextTick(() => {
      this.$emit('active-menu', this)
      this.showMenu = true
    })
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
