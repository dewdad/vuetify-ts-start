<template>
  <v-dialog
      v-model="loading.show"
      persistent
      width="300"
      style="z-index:5000"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{loading.text}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Progress extends Vue {
  get loading () {
    return this.$store.getters.loading
  }
}
</script>
