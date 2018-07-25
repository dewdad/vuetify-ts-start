import { ROUTE_NAME } from '@/store/modules/attribute'
import Vue from 'vue'
import Component from 'vue-class-component'
import { AttributeGroup } from '@/store/modules/attributeGroup'

// You can declare a mixin as the same style as components.
@Component
export default class BaseMixin extends Vue {
  routeName:{[propName:string]:string} = {
    show: `${ROUTE_NAME}.show`,
    update: `${ROUTE_NAME}.update`,
    create: `${ROUTE_NAME}.create`
  }
  translation = 'attribute'

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async createSchema () {
    const {data} = await AttributeGroup.getInstance.index({per_page: 999})

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
}
