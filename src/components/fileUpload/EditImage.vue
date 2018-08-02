<template>
  <v-dialog lazy
            :value="editFile.show"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition">
    <v-card tile>
      <v-toolbar card
                 dark
                 color="primary">
        <v-btn icon
               dark
               @click.native="sendEmit({show:false})">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>图片编辑</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark
                 flat
                 @click.native="sendEmit({show:false})">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'">
        <v-list three-line
                subheader>
          <v-subheader>Edit Image</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>图片名称</v-list-tile-title>
              <v-list-tile-sub-title>{{editFile.name}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-container fluid
                     fill-height>
          <v-layout align-center
                    justify-center>
            <v-flex>
              <v-card>
                <v-toolbar dense>
                  <v-overflow-btn :items="dropdownFont"
                                  label="Select font"
                                  hide-details></v-overflow-btn>

                  <v-divider vertical></v-divider>

                  <v-overflow-btn :items="dropdownEdit"
                                  editable
                                  label="Select size"
                                  hide-details
                                  overflow></v-overflow-btn>

                  <v-divider class="mr-2"
                             vertical></v-divider>

                  <v-btn-toggle v-model="toggleMultiple"
                                class="transparent"
                                multiple>
                    <v-btn :value="1"
                           flat>
                      <v-icon>format_bold</v-icon>
                    </v-btn>

                    <v-btn :value="2"
                           flat>
                      <v-icon>format_italic</v-icon>
                    </v-btn>

                    <v-btn :value="3"
                           flat>
                      <v-icon>format_underlined</v-icon>
                    </v-btn>

                    <v-btn :value="4"
                           flat>
                      <v-icon>format_color_fill</v-icon>
                    </v-btn>
                  </v-btn-toggle>

                  <v-divider class="mx-2"
                             vertical></v-divider>

                  <v-btn-toggle v-model="toggleExclusive"
                                class="transparent">
                    <v-btn :value="1"
                           flat>
                      <v-icon>format_align_left</v-icon>
                    </v-btn>

                    <v-btn :value="2"
                           flat>
                      <v-icon>format_align_center</v-icon>
                    </v-btn>

                    <v-btn :value="3"
                           flat>
                      <v-icon>format_align_right</v-icon>
                    </v-btn>

                    <v-btn :value="4"
                           flat>
                      <v-icon>format_align_justify</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-toolbar>
                <v-card-text>
                  <vue-cropper ref='editImage'
                               :guides="true"
                               :view-mode="2"
                               drag-mode="crop"
                               :auto-crop-area="0.5"
                               :min-container-width="250"
                               :min-container-height="180"
                               :background="true"
                               :rotatable="true"
                               :src="editFile.blob"
                               alt="Source Image"
                               :img-style="{ 'height': '500px' }">
                  </vue-cropper>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey lighten-1">取消</v-btn>
                  <v-btn color="primary" @click="cropImage">确定</v-btn>
                </v-card-actions>
              </v-card>
              <!-- <img :src="editFile.blob" ref="editImage"> -->

            </v-flex>
          </v-layout>
        </v-container>

      </v-card-text>

      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch } from 'vue-property-decorator'
import VueCropper from 'vue-cropperjs'

@Component({
  components:{
  'vue-cropper':VueCropper
  }
  })
export default class EditImage extends Vue {
  public $refs!:{
    'editImage':any
  }
  @Model('input', {type: Object, default: () => ({show: false, name: '', id: '', error: ''})}) editFile!:object

  @Watch('editFile.show')
  onEditShowChange (newValue:boolean, oldValue:boolean) {
    if (newValue) {
      this.$nextTick(function () {
        // if (!this.$refs.editImage) {
        //   return
        // }
        // let cropper = new Cropper(this.$refs.editImage, {
        //   autoCrop: false
        // })
        // const obj = {
        //   ...this.editFile,
        //   cropper
        // }
        // console.log(obj)
        // this.sendEmit(obj)
      })
    }
  }

  cropImg:string = ''

  dropdownFont = [
    { text: 'Arial' },
    { text: 'Calibri' },
    { text: 'Courier' },
    { text: 'Verdana' }
  ]

  dropdownEdit= [
    { text: '100%' },
    { text: '75%' },
    { text: '50%' },
    { text: '25%' },
    { text: '0%' }
  ]

  toggleExclusive= 2
  toggleMultiple= [1, 2, 3]

  sendEmit (arg:any) {
    this.$emit('input', Object.assign({}, this.editFile, arg))
  }

  cropImage () {
    // get image data for post processing, e.g. upload or setting image src
    this.$refs.editImage.getCroppedCanvas().toBlob((blob:any) => {
      this.sendEmit({blob})
    })
  }
}
</script>

<style scoped>
.edit-image img {
  max-width: 100%;
}
</style>
