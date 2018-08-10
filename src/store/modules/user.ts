import store from '@/store'
import { getToken, setToken, removeToken } from '@/auth'
import { Commit, ActionContext } from 'vuex'
import * as UserApi from '@/api/user'
import { Base } from '@/store/modules/app'

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
  REFRESH_TOKEN: (state: State, token:string) => {
    setToken(token)
    state.token = token
  },
  SET_TOKEN: (state:State, payload:({access_token:string, token_type?:string})) => {
    const type = payload.token_type || process.env.VUE_APP_TOKEN_TYPE
    const token = `${_.upperFirst(type)} ${payload.access_token}`
    setToken(token)
    state.token = token
  },
  REMOVE_TOKEN: (state:State) => {
    removeToken()
    state.token = undefined
  },
  SET_USER: (state:State, user:UserInterface) => {
    state.user = user
  },
  REMOVE_USER: (state:State) => (state.user=null)
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
      let data = await UserApi.login(payload)
      commit('SET_TOKEN', data.data)
      return data
    } catch (error) {
      return error
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
  },

  async logout ({commit}: ({commit: Commit})) {
    try {
      await UserApi.logout()
      commit('REMOVE_TOKEN')
      commit('REMOVE_USER')
      commit('app/GO', {router: {name: 'login'}, type: 'replace'}, {root: true})
    } catch (error) {

    }
  },

  unauthorized ({commit}: ({commit: Commit})) {
    commit('REMOVE_TOKEN')
    commit('REMOVE_USER')
    commit('app/GO', {router: {name: 'login'}, type: 'replace'}, {root: true})
  },

  async refreshToken ({commit}: ({commit: Commit}), token:string) {
    commit('REFRESH_TOKEN', token)
  }
}

export class User extends Base {
  protected static instance:User;

  public static get getInstance ():User {
    if (!this.instance) {
      this.instance = new User()
    }
    return this.instance
  }

  /**
   *
   * 用户登录
   * @static
   * @param {{email:string, password:string}} formData
   * @returns {Promise<any>}
   * @memberof User
   */
  public login (formData:{email:string, password:string}):Promise<any> {
    return store.dispatch('user/login', formData)
  }

  /**
   *
   * 获取用户信息
   * @static
   * @returns {Promise<User>}
   * @memberof User
   */
  public me ():Promise<User> {
    return store.dispatch('user/me')
  }

  public logout () {
    return store.dispatch('user/logout')
  }

  public unauthorized () {
    return store.dispatch('user/unauthorized')
  }
}
