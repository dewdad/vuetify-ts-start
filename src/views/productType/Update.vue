<template>
  <v-layout fill-height
            justify-center>
    <v-flex xs12>
      <v-form ref="vform"
              @keyup.native.enter="submit"
              @submit.prevent="submit">
        <form-body-card title="编辑/更新产品类型">
          <v-card-text>
            <base-form-item v-model="formSchema"
                            ref="form">
              <div class="mt-3"
                   slot="attribute-group"
                   slot-scope="{propField}">

                <v-subheader>
                  可包含属性
                  <v-spacer></v-spacer>
                  <v-icon color="primary">add_shopping_cart</v-icon>
                  销售属性
                  <v-icon>bookmark_border</v-icon>
                  普通属性
                </v-subheader>
                <v-divider></v-divider>
                <v-layout row
                          wrap>
                  <v-flex xs6
                          sm3
                          md3
                          v-for="group in propField.values"
                          :key="group.id">
                    <v-checkbox v-model="propField.value"
                                :label="group.name"
                                :value="group">
                      <v-tooltip slot="prepend"
                                 fixed
                                 bottom>
                        <v-icon v-if="group.variant"
                                slot="activator"
                                color="primary">add_shopping_cart</v-icon>
                        <v-icon v-else
                                slot="activator">bookmark_border</v-icon>
                        <div>
                          <ul>
                            <li v-for="(item,key) in group"
                                :key="key">
                              <i>{{key}}</i>
                              <i>:{{item}}</i>
                            </li>
                          </ul>
                        </div>
                      </v-tooltip>
                    </v-checkbox>

                  </v-flex>
                </v-layout>
              </div>
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
import { Component, Vue, Mixins, Provide } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
import FormBodyCard from '@/components/card/FormBodyCard.vue'
import { ProductType } from '@/store/modules/productType'
import Base from './mixins/Base'
import FormMixin from '@/components/form/mixins/Form'
import { AttributeGroup } from '@/store/modules/attributeGroup'

@Component({
  components:{
  'base-form-item':BaseFormItem,
  'form-body-card':FormBodyCard
  }
  })
export default class ProductTypeUpdate extends mixins(Base, FormMixin) {
  public $refs!: {
    form:BaseFormItem,
    vform:any
  };

  @Provide() parentValidator = this.$validator

  item = {} as ApiResponse.ProductTypeData

  groups = [] as ApiResponse.AttributeGroupItem[]

  mapping = {
    'group_ids': {key: 'attributeGroups', handle: (item:ApiResponse.AttributeGroups) => item.data}
  }

  paserMapping = {
    'group_ids': {handle: (item:ApiResponse.AttributeGroupData[]) => item.map(group => group.id)}
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '类型名称',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required',
      requeired: true,
      clearable: true
    },
    {
      field: 'group_ids',
      label: '属性组',
      value: [],
      itemText: 'name',
      itemValue: (item:any) => item,
      fieldType: 'checkbox_group',
      values: [],
      custom: true,
      slotName: 'attribute-group'
    }
  ]

  setGroups (groups:ApiResponse.AttributeGroupItem[]) {
    this.formSchema[1].values = groups
  }

  async fetchGroups () {
    const {data} = await AttributeGroup.index()
    this.groups = data
  }

  clear () {
    this.$refs.vform.reset()
  }

  onFileComponentClear (e:MouseEvent, item:FormInterface.Field) {
    item.value = []
  }

  async submit () {
    if (await this.$validator.validateAll()) {
      await this.update()
    }
  }

  async update () {
    this.$loading({show: true, text: '提交中'})
    let res = await this.updateApi({id: +this.$route.params.id, ...this.paserFormData()})
    if (res.status === 201) {
      this.$router.push({name: this.routeName.show, params: {id: res.data.data.id}})
      this.$success({text: 'update success!'})
    } else {
      this.$refs.form.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  async viewInit () {
    const {data} = await this.showApi({id: +this.$route.params.id})
    this.item = data
    this.assignmentFormSchema(this.item)
  }

  async created () {
    await this.viewInit()
    await this.fetchGroups()
    this.setGroups(this.groups)
  }
}
</script>
