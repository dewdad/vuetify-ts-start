<template>
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
    >
    <v-badge overlap slot="activator">
      <span slot="badge" v-if="images.length>0">{{images.length}}</span>
      <v-btn
        flat
        color="indigo"
        dark
      >
        回收站
      </v-btn>
    </v-badge>
      <v-card>
        <v-container grid-list-sm fluid>
          <v-layout row wrap>
            <v-alert
              v-if="images.length === 0"
              :value="true"
              color="info"
              icon="priority_high"
              outline
            >
              is Empty
            </v-alert>
            <v-flex
              v-for="image in images"
              :key="image.src"
              xs4
              d-flex
            >
              <v-card flat tile class="d-flex">
                <v-img
                  :src="image.src"
                  :lazy-src="image.thumb || image.src"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <v-layout

                    fill-height
                    align-center
                    justify-center
                    ma-0
                  >
                    <v-btn flat icon @click="restore(image)">
                      <v-icon color="grey lighten-5">replay</v-icon>
                    </v-btn>
                  </v-layout>
                </v-img>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" flat @click="menu = false">Save</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component({
  })
export default class RecycleBtn extends Vue {
  @Model('input', {type: Array, default: () => []}) images!:ApiResponse.UploadEdItemUrl[]

  fav = true
  menu = false
  message = false
  hints = true

  restore (image:ApiResponse.UploadEdItemUrl) {
    const img = _.cloneDeep(this.images)
    const index = this.images.findIndex(item => item === image)
    img.splice(index, 1)
    this.$emit('input', img)
    this.$emit('upload-image-restore', image)
  }
}
</script>
