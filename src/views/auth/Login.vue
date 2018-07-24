<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Login form</v-toolbar-title>
          <v-spacer></v-spacer>

        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field prepend-icon="person" name="email" label="Email" type="text" v-model="formData.email"></v-text-field>
            <v-text-field id="password"  prepend-icon="lock" name="password" label="Password" type="password" v-model="formData.password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {User} from '@/store/modules/user'
@Component({
  layout: 'default',
  middleware:'guest'
  })
export default class Login extends Vue {
  public drawer = null;
  formData:{email:string, password:string} = {
    email: '',
    password: ''
  }

  async login () {
    this.$loading({show: true, text: '登录中'})
    await User.login(this.formData)
    this.$loading({show: false})
    this.$router.push({name: 'home'})
  }
}
</script>
