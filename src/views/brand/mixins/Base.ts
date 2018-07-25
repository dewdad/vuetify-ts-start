import { ROUTE_NAME } from '@/store/modules/brand'
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
  translation = 'brand'

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    return [
      { name: '基本',
        fields: [
          { field: 'name',
            label: '品牌名称',
            type: 'input',
            rule: 'required',
            props: { clearable: true }},
          { field: 'avatar',
            label: '品牌LOGO',
            type: 'input',

            props: { clearable: true }},
          { field: 'description',
            label: '品牌描述',
            type: 'textarea',

            props: { clearable: true }}
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
