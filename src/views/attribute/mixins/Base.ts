import { ROUTE_NAME, Attribute } from '@/store/modules/attribute'
import Vue from 'vue'
import Component from 'vue-class-component'
import { AttributeGroup } from '@/store/modules/attributeGroup'
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
  translation = 'attribute'

  vuexModel = Attribute

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    const {data} = await AttributeGroup.index({per_page: 999})

    return [
      { name: '基本',
        fields: [
          { field: 'group_id',
            label: '属性组',
            type: 'select',
            items: data,
            rule: 'required',
            itemText: 'name',
            itemValue: 'id'
          },
          { field: 'value',
            label: '属性值',
            type: 'input',
            rule: 'required',
            props: { clearable: true }
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
  @With([])
  updateApi (payload:Update) {
    return this.vuexModel.update(payload)
  }

  // 详情
  @With([])
  showApi (payload:Show) {
    return this.vuexModel.show(payload)
  }

  // 创建
  @With([])
  createApi (payload:Create) {
    return this.vuexModel.create(payload)
  }

  // 删除
  deleteApi (payload:Delete) {
    return this.vuexModel.destroy(payload)
  }
}
