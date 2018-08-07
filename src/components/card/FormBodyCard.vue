<template functional>
  <v-card class="mb-3">
    <v-progress-linear
          :value="50"
          class="my-0"
          height="3"
    ></v-progress-linear>
    <v-card-title class="headline">{{props.title}}</v-card-title>
    <v-divider></v-divider>
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  functional: true,
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
