import store from '@/store'
import { getToken, setToken } from '@/auth'
import { Commit } from 'vuex'
import * as UserApi from '@/api/user'

interface UserInterface {
  [propNmae:string]:any
}
interface State {
  user:UserInterface|null;
  token:string|undefined;
}

export const state:State = {
  user: null,
  token: getToken()
}

export const mutations = {
  SET_TOKEN: (state:State, token:string) => {
    setToken(token)
    state.token = token
  },
  SET_USER: (state:State, user:UserInterface) => {
    state.user = user
  }
}

export const actions = {
  /**
   * @description 用户登录方法
   *
   * @param {({commit: Commit})} {commit}
   * @param {{email:string, password:string}} payload
   */
  async login ({commit}: ({commit: Commit}), payload:{email:string, password:string}) {
    try {
      let {data} = await UserApi.login(payload)
      commit('SET_TOKEN', data.access_token)
    } catch (error) {

    }
  },

  /**
   * @description 获取用户信息
   *
   * @param {({commit: Commit})} {commit}
   */
  async me ({commit}: ({commit: Commit})) {
    try {
      let {data} = await UserApi.me()
      commit('SET_USER', data)
    } catch (error) {

    }
  }
}

export class User {
  /**
   *
   * 用户登录
   * @static
   * @param {{email:string, password:string}} formData
   * @returns {Promise<any>}
   * @memberof User
   */
  static login (formData:{email:string, password:string}):Promise<any> {
    return store.dispatch('user/login', formData)
  }

  /**
   *
   * 获取用户信息
   * @static
   * @returns {Promise<User>}
   * @memberof User
   */
  static me ():Promise<User> {
    return store.dispatch('user/me')
  }
}
