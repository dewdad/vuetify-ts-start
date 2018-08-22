<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12>
      <v-form ref="vform"
              @submit.prevent="submit">
        <form-body-card title="创建采购计划">
          <v-btn small depressed slot="title-btn" @click="showProductList = true">选择产品</v-btn>
          <v-card-text>
            <base-form-item v-model="formSchema"
                            ref="form">
              <selected-table v-model="variants"></selected-table>
            </base-form-item>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="clear"
                   flat>清空</v-btn>
            <v-btn color="primary"
                   type="submit">提交</v-btn>
            <!-- <submit-button color="primary" block="true" label="Login"></submit-button> -->
          </v-card-actions>
        </form-body-card>
      </v-form>
    </v-flex>
    <v-navigation-drawer
      v-model="showProductList"
      right
      temporary
      fixed
      width="600"
    >
       <select-products class="px-3 py-3" v-model="variants"></select-products>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
import FormBodyCard from '@/components/card/FormBodyCard.vue'
import { ProductType } from '@/store/modules/productType'
import Base from './mixins/Base'
import FormMixin from '@/components/form/mixins/Form'
import { AttributeGroup } from '@/store/modules/attributeGroup'
import { With } from '@/utils/decorators'
import { CurrentAddVariant } from '@/views/procurementPlan/components/AddVariantForm.vue'

@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard,
  'select-products':()=>import('@/views/procurementPlan/components/SelectProducts.vue'),
  'selected-table':()=>import('@/views/procurementPlan/components/SelectedTable.vue'),
  }
  })
export default class ProcurementPlanCreate extends mixins(Base, FormMixin) {
  public $refs!: {
    form:BaseFormItem,
    vform:any
  };

  @Provide() parentValidator = this.$validator

  variants:CurrentAddVariant[] = []

  showProductList = false

  paserMapping = {
    'group_ids': {handle: (item:ApiResponse.AttributeGroupData[]) => item.map(group => group.id)}
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'description',
      label: '采购计划描述',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required',
      requeired: true,
      clearable: true
    }
  ]

  clear () {
    this.$refs.vform.reset()
  }

  onFileComponentClear (e:MouseEvent, item:FormInterface.Field) {
    item.value = []
  }

  async submit () {
    if (await this.$validator.validateAll()) {
      await this.create()
    }
  }

  async create () {
    this.$loading({show: true, text: '提交中'})
    let res = await this.createApi(this.paserFormData())
    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: res.data.data.id}})
      this.$success({text: 'create success!'})
    } else {
      this.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  async created () {

  }
}
</script>
