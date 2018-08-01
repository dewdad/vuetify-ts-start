<template>
  <v-form>
    <base-form-item  v-model="propFields" ref="formItem"></base-form-item>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import BaseFormItem from './BaseFormItem.vue'
@Component({
  components:{
  'base-form-item':BaseFormItem
  }
  })
export default class BaseFormV extends Vue {
  public $refs!: {
    'formItem':BaseFormItem
  };
  @Model('input') propFields!:FormInterface.Field[]

  async submit () {
    const res = await this.$refs.formItem.submit()
    return res
  }
}
</script>
