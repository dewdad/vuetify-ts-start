// 所有表单相关组件全部继承，混入最上层组件验证类
import { Component, Vue, Inject } from 'vue-property-decorator'
import { Validator } from 'vee-validate'

// You can declare a mixin as the same style as components.
@Component
export default class BaseFormMixin extends Vue {
  @Inject({ from: 'parentValidator', default: null }) parentValidator!: Validator

  created () {
    if (this.parentValidator) {
      this.$validator = this.parentValidator
    }
  }
}
