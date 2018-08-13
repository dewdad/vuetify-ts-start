import { RouteName } from '@/store/modules/app'
import { ROUTE_NAME, Product } from '@/store/modules/product'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Brand } from '@/store/modules/brand'
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
  translation = 'product'

  vuexModel = Product

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    const {data: brands} = await Brand.index()
    return [
      { name: '基本',
        fields: [
          { field: 'name',
            label: '产品名称',
            type: 'input',
            rule: 'required',
            props: { clearable: true }
          },
          { field: 'name_cn',
            label: '产品中文名称',
            type: 'input',
            rule: 'required',
            props: { clearable: true }
          },
          { field: 'name_en',
            label: '产品英文名称',
            type: 'input',
            rule: 'required',
            props: { clearable: true }
          },
          { field: 'code',
            label: '产品编码',
            type: 'input',
            rule: 'required',
            props: { clearable: true }
          },
          { field: 'brand_id',
            label: '产品品牌',
            type: 'select',
            items: brands,
            itemText: 'name',
            itemValue: 'id'
          },
          { field: 'enabled',
            label: 'ENABLED',
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
  @With(['brand', 'type'])
  listApi (payload:List) {
    return this.vuexModel.index(payload)
  }

  // 更新方法
  @With(['avatars', 'brand', 'type', 'attributes.group', 'attributes.value', 'variants.attributes.group', 'variants.attributes.value'])
  updateApi (payload:Update) {
    return this.vuexModel.update(payload)
  }

  // 详情
  @With(['avatars', 'brand', 'type', 'attributes.group', 'attributes.value', 'variants.attributes.group', 'variants.attributes.value'])
  showApi (payload:Show) {
    return this.vuexModel.show(payload)
  }

  // 创建
  @With(['avatars', 'brand', 'type', 'attributes.group', 'attributes.value', 'variants.attributes.group', 'variants.attributes.value'])
  createApi (payload:Create) {
    return this.vuexModel.create(payload)
  }

  // 删除
  deleteApi (payload:Delete) {
    return this.vuexModel.destroy(payload)
  }
}
