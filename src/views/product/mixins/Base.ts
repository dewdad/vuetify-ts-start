import { RouteName } from '@/store/modules/app'
import { ROUTE_NAME } from '@/store/modules/product'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Brand } from '@/store/modules/brand'

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

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    const {data: brands} = await Brand.getInstance.index()
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
}
