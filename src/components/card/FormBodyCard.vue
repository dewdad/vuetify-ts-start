<template functional>
  <v-card class="mb-3">
    <v-progress-linear
          :value="props.percent"
          class="my-0"
          height="3"
          :color="props.color"
    ></v-progress-linear>
    <v-card-title>
      <div class="title">{{props.title}}</div>
      <v-spacer></v-spacer>
       <slot name="title-btn"></slot>
    </v-card-title>
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
    },
    color: {
      type: String,
      default: 'primary'
    },
    percent: {
      type: Number,
      default: 50
    }
  }
}
</script>
