import { ROUTE_NAME } from '@/store/modules/productType'
import Vue from 'vue'
import Component from 'vue-class-component'
import { AttributeGroup } from '@/store/modules/attributeGroup'

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

  groups = [] as ApiResponse.AttributeGroupItem[]

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '类型名称',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required',
      requeired: true,
      clearable: true
    },
    {
      field: 'group_ids',
      label: '属性组',
      value: [],
      itemText: 'name',
      itemValue: (item:any) => item,
      fieldType: 'checkbox_group',
      values: []
    }
  ]

  setGroups (groups:ApiResponse.AttributeGroupItem[]) {
    this.formSchema[1].values = groups
  }

  async fetchGroups () {
    const {data} = await AttributeGroup.getInstance.index()
    this.groups = data
  }

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

  async created () {
    await this.fetchGroups()
    this.setGroups(this.groups)
  }
}
