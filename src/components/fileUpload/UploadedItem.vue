<template>
  <v-card flat tile @contextmenu="show">
    <v-img
      class="white--text"
      :src="url.src"
      :lazy-src="url.thumb"
      height="150px"
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
        <v-list-tile @click="deleteItem(file)">
          <v-list-tile-title>删除</v-list-tile-title>
          <v-list-tile-action>
            <v-icon>cancel</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-menu>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components:{

  }
  })
export default class UploadEdItem extends Vue {
  @Prop(Object) url!:object

  showMenu = false
  x = 0
  y = 0

  deleteItem (url:object) {
    this.$emit('uploaded-image-remove', url)
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
}
</script>
