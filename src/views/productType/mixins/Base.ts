import { ROUTE_NAME, ProductType } from '@/store/modules/productType'
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
  translation = 'productType'

  vuexModel = ProductType

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    return [
      { name: '基本',
        fields: [
          { field: 'name',
            label: '产品类型',
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
  @With(['attributeGroups'])
  listApi (payload:List) {
    return this.vuexModel.index(payload)
  }

  // 更新方法
  @With(['attributeGroups'])
  updateApi (payload:Update) {
    return this.vuexModel.update(payload)
  }

  // 详情
  @With(['attributeGroups'])
  showApi (payload:Show) {
    return this.vuexModel.show(payload)
  }

  // 创建
  @With(['attributeGroups'])
  createApi (payload:Create) {
    return this.vuexModel.create(payload)
  }

  // 删除
  deleteApi (payload:Delete) {
    return this.vuexModel.destroy(payload)
  }
}
