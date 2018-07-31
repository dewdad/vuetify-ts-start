import Vue from 'vue'
// import zh from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'
import { mapGetters } from 'vuex'

// 自定义字典
const dictionary = {
  zh_CN: {
    // attributes and messages
    messages: {
      // username: field => `请输入正确的${field}`
    },
    attributes: {
      password: '密码',
      username: '账号'
    }
  }
}

// Validator.localize('zh_CN', zh)
Vue.use(VeeValidate, {
  delay: 100,
  events: 'input|blur',
  dictionary: {
    ...dictionary
  }
})

// 自定义规则扩展
Validator.extend('username', {
  getMessage (field:any, params:any, data:any) {
    return (data && data.message) || 'Something went wrong'
  },
  validate (value:string) {
    const phone = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|4|5|6|7|8|9])\d{8}$/
    const email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return new Promise(resolve => {
      resolve({
        valid: phone.test(value) || email.test(value),
        data: phone.test(value) || email.test(value) ? undefined : { message: '请输入正确的手机号码或邮箱' }
      })
    })
  }
})

Validator.extend('categroyNameNotEqParentId', {
  getMessage: (field:string) => `当前分类不能与父分类一致`,
  validate: (value:any, [otherValue]:any) => value.name !== otherValue
},
{
  hasTarget: true
})

Vue.mixin({
  $_veeValidate: {
    validator: 'new'
  },
  methods: {
    $setErrorsFromResponse (errorResponse) {
      if (!this.hasOwnProperty('$validator')) {
        return
      }

      // clear errors
      this.$validator.errors.clear()

      // check if errors exist
      if (!errorResponse.hasOwnProperty('errors')) {
        return
      }

      const errorFields = Object.keys(errorResponse.errors)

      // insert laravel errors
      errorFields.map(field => {
        const errorString = errorResponse.errors[field].join(', ')
        this.$validator.errors.add({field, msg: errorString})
      })
    }
  }
})
