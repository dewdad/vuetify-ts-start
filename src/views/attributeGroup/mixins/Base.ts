import { ROUTE_NAME } from '@/store/modules/attributeGroup'
import Vue from 'vue'
import Component from 'vue-class-component'

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

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

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
            items: ['text', 'textarea', 'select', 'radio', 'richtext', 'checkbox', 'date', 'time', 'checkbox_group', 'radio_group', 'toggle'],
            default: 'text',
            rule: 'required'
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
}
