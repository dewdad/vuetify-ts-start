<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12>
      <v-form ref="vform"
              @submit.prevent="submit">
        <form-body-card title="创建属性组">
          <v-card-text>
            <base-form-item v-model="formSchema"
                            ref="form">
              <base-form-auto slot="attributes"
                              slot-scope="{propField}"
                              :propField="propField"
                              v-model="propField.value"></base-form-auto>
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
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins, Provide } from 'vue-property-decorator'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
import FormBodyCard from '@/components/card/FormBodyCard.vue'
import { ProductType } from '@/store/modules/productType'
import Base from './mixins/Base'
import FormMixin from '@/components/form/mixins/Form'
import { AttributeGroup } from '@/store/modules/attributeGroup'
import BaseFormAutoComplete from '@/components/form/BaseFormAutoComplete.vue'
@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard,
  'base-form-auto':BaseFormAutoComplete
  }
  })
export default class AttributeGroupCreate extends Mixins(Base, FormMixin) {
  public $refs!: {
    form:BaseFormItem,
    vform:any
  };

  @Provide() parentValidator = this.$validator

  include = ['values']

  @Watch('formSchema.2.value', {immediate:true})
  onTypeValueChange (val:string) {
    const disabled = ['text', 'textarea', 'toggle'].includes(val)
    this.setAttributeDisabled(disabled)
  }

  setAttributeDisabled (disabled:boolean) {
    _.set(this.formSchema, '[4].disabled', disabled)
    if (disabled) {
      _.set(this.formSchema, '[4].value', [])
    }
  }

  paserMapping = {
    'group_ids': {handle: (item:ApiResponse.AttributeGroupData[]) => item.map(group => group.id)}
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '属性组名称',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required',
      requeired: true,
      clearable: true
    },
    {
      field: 'variant',
      label: '是否为销售属性',
      fieldType: 'switch',
      value: false,
      rule: 'required',
      requeired: true
    },
    {
      field: 'type',
      label: '选择方式',
      fieldType: 'select',
      items: [{type: 'text', name: '输入框'}, {type: 'textarea', name: '文本域'}, {type: 'select', name: '下拉列表'}, {type: 'checkbox_group', name: '复选组'}, {type: 'radio_group', name: '单项选择'}, {type: 'toggle', name: '开关'}],
      value: 'text',
      itemText: 'name',
      itemValue: 'type',
      rule: 'required'
    },
    {
      field: 'required',
      label: '是否必填',
      fieldType: 'switch',
      value: false,
      rule: 'required',
      requeired: true
    },
    {
      field: 'attributes',
      slotName: 'attributes',
      label: '设置属性值',
      fieldType: 'any',
      disabled: true,
      value: [],
      hint: '可以为属性值创建或修改属性值'
    }
  ]

  clear () {
    this.$refs.vform.reset()
  }

  async submit () {
    if (await this.$validator.validateAll()) {
      await this.create()
    }
  }

  async create () {
    this.$loading({show: true, text: '提交中'})
    let res = await AttributeGroup.getInstance.with(this.include).create(this.paserFormData())
    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: res.data.data.id}})
      this.$success({text: 'create success!'})
    } else {
      this.$refs.form.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  async created () {

  }
}
</script>
