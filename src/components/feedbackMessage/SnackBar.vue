<template>
  <v-snackbar
      v-model="vuexSnackbar.status"
      :color="vuexSnackbar.color"
      :multi-line="vuexSnackbar.mode === 'multi-line'"
      :timeout="vuexSnackbar.timeout"
      :vertical="vuexSnackbar.mode === 'vertical'"

      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :right="x === 'right'"
      :top="y === 'top'"
    >
      {{ vuexSnackbar.text }}
      <v-btn
        dark
        flat
        @click="clickHandle"
      >
        Close
      </v-btn>
    </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SnackBar extends Vue {
  snackbar = {
    status: false,
    color: '',
    mode: '',
    timeout: 3000,
    text: null,
    position: 2
  }
  get vuexSnackbar () {
    return this.$store.getters.snackbar
  }

  get x () {
    if (([1, 4, 7] as any).includes(this.vuexSnackbar.position)) {
      return 'left'
    }
    if (([3, 6, 9] as any).includes(this.vuexSnackbar.position)) {
      return 'right'
    }
  }

  get y () {
    if (([7, 8, 9] as any).includes(this.vuexSnackbar.position)) {
      return 'top'
    }
    if (([1, 2, 3] as any).includes(this.vuexSnackbar.position)) {
      return 'botton'
    }
  }

  clickHandle () {
    this.$store.commit('app/TOGGLE_SNACKBAR', this.snackbar)
  }
}
</script>
