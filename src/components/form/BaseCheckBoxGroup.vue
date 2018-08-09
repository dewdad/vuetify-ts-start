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
import BaseForm from '@/components/form/mixins/BaseForm'

@Component
export default class BaseCheckBoxGroup extends Mixins(BaseForm) {
  @Model('input') propField!:FormInterface.Field
}
</script>
