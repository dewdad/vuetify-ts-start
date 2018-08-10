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
import { Component, Vue, Model, Mixins } from 'vue-property-decorator'
import InjectValidator from '@/components/form/mixins/InjectValidator'

@Component
export default class BaseCheckBoxGroup extends Mixins(InjectValidator) {
  @Model('input') propField!:FormInterface.Field
}
</script>
