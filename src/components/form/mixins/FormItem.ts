import { Component, Vue, Watch, Prop, Model } from 'vue-property-decorator'

// You can declare a mixin as the same style as components.
@Component({
  inheritAttrs:true
  })
export default class FormItemMixin extends Vue {
  @Model('input') value!:any

  @Prop(Object) propField!:FormInterface.Field

  @Prop({type: Boolean, default: false}) loading!:boolean

  get filterFieldAttrs () {
    _.set(this.propField, 'loading', _.get(this.propField, 'loading', this.loading))
    const {fieldType, props, value, itemEvent, ...arg} = this.propField
    return {...props, ...arg}
  }

  get listeners () {
    const {itemEvent} = this.propField
    return itemEvent
  }
}
