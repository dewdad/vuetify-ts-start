import Vue from 'vue'
import Component from 'vue-class-component'

export interface Mapping{
  [propName:string]:{key:string, handle:(item:any)=>any}
}

export interface PaserMapping{
  [propName:string]:{key?:string, handle:(item:any)=>any}
}

// You can declare a mixin as the same style as components.
@Component
export default class FormMixin extends Vue {
  mapping:Mapping = {
  }

  paserMapping:PaserMapping = {
  }

  formSchema:FormInterface.Field[] = [

  ]

  paserFormData () {
    return this.formSchema.reduce((formData:any, field) => {
      if (_.has(this.paserMapping, field.field)) {
        const {key, handle} = _.get(this.paserMapping, field.field)
        const fieldName = key || field.field
        formData[fieldName] = handle(field.value)
      } else {
        formData[field.field] = field.value
      }
      return formData
    }, {})
  }

  // 表单赋值
  assignmentFormSchema<T> (item:T) {
    this.formSchema.forEach(row => {
      if (_.has(this.mapping, row.field)) {
        const {key, handle} = _.get(this.mapping, row.field)
        row.value = handle(_.get(item, key))
      } else {
        row.value =_.get(item, row.field)
      }
    })
  }
}
