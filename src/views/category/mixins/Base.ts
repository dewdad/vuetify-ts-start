import { ROUTE_NAME, Category } from '@/store/modules/category'
import Vue from 'vue'
import Component from 'vue-class-component'
import { RouteName } from '@/store/modules/app'

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

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    const {data: category} = await Category.getInstance.index()
    return [
      { name: '基本',
        fields: [
          { field: 'name',
            label: '分类名称',
            type: 'input',
            rule: 'required',
            props: { clearable: true }},
          { field: 'parent_id',
            label: '父分类',
            type: 'select',
            items: category,
            itemText: 'name',
            itemValue: 'id',
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
}
