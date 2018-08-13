import { ROUTE_NAME, AttributeGroup } from '@/store/modules/attributeGroup'
import Vue from 'vue'
import Component from 'vue-class-component'
import { With } from '@/utils/decorators'
import { Update, Show, List, Create, Delete } from '@/api/types'
// You can declare a mixin as the same style as components.
@Component
export default class BaseMixin extends Vue {
  routeName:{[propName:string]:string} = {
    index: `${ROUTE_NAME}.index`,
    show: `${ROUTE_NAME}.show`,
    update: `${ROUTE_NAME}.update`,
    create: `${ROUTE_NAME}.create`
  }
  translation = 'attributeGroup'

  vuexModel = AttributeGroup

  async createSchema () {
    return [
      { name: '基本',
        fields: [
          { field: 'name',
            label: '属性组名称',
            type: 'input',
            rule: 'required',
            props: { clearable: true }
          },
          { field: 'variant',
            label: '是否为销售属性',
            type: 'switch',
            rule: 'required',
            default: false,
            props: {falseValue: false}
          },
          { field: 'type',
            label: '选择方式',
            type: 'select',
            // items: ['text', 'textarea', 'select', 'radio', 'richtext', 'checkbox', 'date', 'time', 'checkbox_group', 'radio_group', 'toggle'],
            items: [{type: 'text', name: '输入框'}, {type: 'textarea', name: '文本域'}, {type: 'select', name: '下拉列表'}, {type: 'checkbox_group', name: '复选组'}, {type: 'radio_group', name: '单项选择'}, {type: 'toggle', name: '开关'}],
            default: 'text',
            itemText: 'name',
            itemValue: 'type',
            rule: 'required',
            onChange: (this as any).onTypeChange
          },
          { field: 'required',
            label: '是否必填',
            type: 'switch',
            default: false,
            rule: 'required'
          },
          { field: 'customized',
            label: '是否支持自定义',
            type: 'switch',
            default: false,
            rule: 'required'
          }
        ]
      }
    ]
  }

  showItem (id:any) {
    return this.$router.push(
      {name: this.routeName.show, params: {id}}
    )
  }

  editItem (id:any) {
    return this.$router.push(
      {name: this.routeName.update, params: { id }}
    )
  }

  // 列表
  @With([])
  listApi (payload?:List|null) {
    return this.vuexModel.index(payload)
  }

  // 更新方法
  @With(['values'])
  updateApi (payload:Update) {
    return this.vuexModel.update(payload)
  }

  // 详情
  @With(['values'])
  showApi (payload:Show) {
    return this.vuexModel.show(payload)
  }

  // 创建
  @With(['values'])
  createApi (payload:Create) {
    return this.vuexModel.create(payload)
  }

  // 删除
  deleteApi (payload:Delete) {
    return this.vuexModel.destroy(payload)
  }
}
