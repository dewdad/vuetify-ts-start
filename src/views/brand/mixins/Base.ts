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

  formSchema:FormInterface.Field[] = [
    {
      field: 'name',
      label: '品牌名称',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required',
      requeired: true
    },
    {
      field: 'avatars',
      label: '品牌LOGO',
      fieldType: 'file',
      rule: 'required',
      value: [],
      itemEvent: {'clear': (e:MouseEvent) => this.onFileComponentClear(e, this.formSchema[1])}
    },
    {
      field: 'description',
      label: '品牌描述',
      fieldType: 'textarea',
      rule: 'max:200',
      counter: true
    }
  ]

  onFileComponentClear (e:MouseEvent, item:FormInterface.Field) {
    item.value = []
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
