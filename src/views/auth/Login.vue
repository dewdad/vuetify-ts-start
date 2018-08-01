<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-form @keyup.native.enter="submit" @submit.prevent="submit">
      <v-card class="elevation-12">
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Login form</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>

            <base-form-item  v-model="formSchema" ref="form"></base-form-item>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit">Login</v-btn>
          <!-- <submit-button color="primary" block="true" label="Login"></submit-button> -->
        </v-card-actions>
      </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {User} from '@/store/modules/user'
import BaseFormItem from '@/components/form/BaseFormItem.vue'
@Component({
  layout: 'default',
  middleware:'guest',
  components:{
  'base-form-item':BaseFormItem
  }
  })
export default class Login extends Vue {
  public $refs!: {
    'form':BaseFormItem
  };

  public drawer = null;

  onPasswordClickAppendIcon (e:MouseEvent, item:FormInterface.Field) {
    item.appendIcon = item.appendIcon ==='visibility_off' ? 'visibility' : 'visibility_off'
    item.type = item.appendIcon ==='visibility_off' ? 'password' : 'text'
  }

  formSchema:FormInterface.Field[] = [
    {
      field: 'email',
      label: 'Email',
      value: '',
      type: 'text',
      fieldType: 'text',
      rule: 'required|email',
      requeired: true,
      prependIcon: 'person'
    },
    {
      field: 'password',
      label: 'Password',
      value: '',
      type: 'password',
      fieldType: 'text',
      rule: 'required|min:6',
      requeired: true,
      prependIcon: 'lock',
      appendIcon: 'visibility_off',
      itemEvent: {'click:append': (e:MouseEvent) => this.onPasswordClickAppendIcon(e, this.formSchema[1])}
    }
  ]

  async submit () {
    if (await this.$refs.form.submit()) {
      await this.login()
    }
  }

  paserFormData () {
    return this.formSchema.reduce((formData:any, field) => {
      formData[field.field] = field.value
      return formData
    }, {})
  }

  async login () {
    this.$loading({show: true, text: '登录中'})
    let res = await User.getInstance.login(this.paserFormData())
    if (res.status === 200) {
      this.$router.push({name: 'home'})
      this.$success({text: 'Welcome back!'})
    } else {
      this.$refs.form.$setErrorsFromResponse(res.data)
      this.$fail({text: res.data.message})
    }
    this.$loading({show: false})
  }

  // mounted () {
  //   window.document.addEventListener('keydown', (event) => {
  //     if (event.key === 'Enter' || event.keyCode === 13) {
  //       console.log('enter')
  //     }
  //   })
  // }
}
</script>
