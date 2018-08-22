<template>
<div>
  <v-data-table
    :headers="headers"
    :items="value"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.variant.name }}</td>
      <td class="text-xs-right">{{ props.item.variant.attribute_key }}</td>
      <td class="text-xs-right">{{ props.item.price }}</td>
      <td class="text-xs-right">{{ props.item.provider.name }}</td>
      <td class="text-xs-right">{{ props.item.provider.pivot.price }}</td>
      <td class="text-xs-right">{{ props.item.offerPrice }}</td>
      <td class="text-xs-right">{{ props.item.pcs }}</td>
      <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="openForm(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
          >
            delete
          </v-icon>
        </td>
    </template>
  </v-data-table>
  <add-variant-form title="修改采购明细" v-model="dialogForm" @procurement-plan-save-variant="save"></add-variant-form>
</div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component({
  components:{
  'add-variant-form':()=>import('@/views/procurementPlan/components/AddVariantForm.vue'),
  }
  })
export default class SelectedTable extends Vue {
  @Model('input', {type: Array, default: () => []}) value!:any[]
  headers = [
    {
      text: '产品名称',
      value: 'variant.name',
      align: 'left'
    },
    {
      text: '变体属性',
      value: 'variant.attribute_key',
      align: 'right'
    },
    {
      text: '建议价格',
      value: 'price',
      align: 'right'
    },
    {
      text: '供应商',
      value: 'provider.name',
      align: 'right'
    },
    {
      text: '供应商报价',
      value: 'provider.pivot.price',
      align: 'right'
    },
    {
      text: '采购价格',
      value: 'offerPrice',
      align: 'right'
    },
    {
      text: '采购数量',
      value: 'pcs',
      align: 'right'
    },
    { text: '操作', value: 'name', sortable: false }
  ]

  dialogForm = false

  openForm (item:any) {
    this.$bus.$emit('procurement-plan-edit-variant', item)
    this.dialogForm = true
  }

  async save (currentAddVariant:any) {
    const providerId = _.get(currentAddVariant, 'provider.id')
    const variantId = _.get(currentAddVariant, 'variant.id')
    const index = this.findIndex(providerId, variantId)
    if (index>=0) {
      const value = _.cloneDeep(this.value)
      value.splice(index, 1, currentAddVariant)
      this.$emit('input', value)
      this.$success({text: '修改成功'})
    }
    this.dialogForm = false
    // this.value.findIndex(item=>item===)
    //   this.$success({text: '添加成功'})
    //   return
    // }
    // this.$fail({text: '请勿重复添加'})
  }

  findIndex (providerId:number, variantId:number) {
    return this.value.findIndex(item => item.provider.id === providerId && item.variant.id === variantId)
  }
}
</script>
