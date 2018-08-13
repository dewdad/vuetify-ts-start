import { ROUTE_NAME, Category } from '@/store/modules/category'
import Vue from 'vue'
import Component from 'vue-class-component'
import { RouteName } from '@/store/modules/app'
import { With } from '@/utils/decorators'
import { Update, Show, List, Create, Delete } from '@/api/types'

// You can declare a mixin as the same style as components.
@Component
export default class BaseMixin extends Vue {
  routeName:RouteName = {
    index: `${ROUTE_NAME}.index`,
    show: `${ROUTE_NAME}.show`,
    update: `${ROUTE_NAME}.update`,
    create: `${ROUTE_NAME}.create`
  }
  translation = 'category'

  vuexModel = Category

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    const {data: category} = await this.listApi()

    return [
      { name: '基本',
        fields: [
          { field: 'name',
            label: '分类名称',
            type: 'input',
            rule: 'required',
            ref: 'categoryName',
            props: { clearable: true }},
          { field: 'parent_id',
            label: '父分类',
            type: 'select',
            items: category,
            itemText: 'name',
            itemValue: 'id',
            rule: 'parentNotSelf:categoryName',
            props: {default: 0},
            onChange: this.testChange }
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
  listApi (payload?:List) {
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
