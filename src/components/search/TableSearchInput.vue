<template>
  <v-flex>
    <v-switch :label="$t('searchInput.fuzzyMatching')"
              v-model="like"></v-switch>
    <v-text-field v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details>
    </v-text-field>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class SearchiNPUT extends Vue {
  @Prop({default: true}) liked!:boolean
  search:string = ''
  like:boolean = true

  @Watch('search')
  onSearchChange (val: string, oldVal: string) { this.searchHandle() }

  searchHandle () {
    _.throttle(() => {
      this.$emit('searchChangeEvent', this.$data)
    }, 300)
  }

  created () {
    this.like = this.liked
  }
}
</script>
