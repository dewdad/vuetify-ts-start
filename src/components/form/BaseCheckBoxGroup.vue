<template>
  <div>
    <v-checkbox
      v-for="(value,index) in propField.values"
      :key="index"
      v-model="propField.value"
      :label="value.name"
      :value="value">
    </v-checkbox>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component
export default class BaseCheckBoxGroup extends Vue {
  @Model('input') propField!:FormInterface.Field
}
</script>
