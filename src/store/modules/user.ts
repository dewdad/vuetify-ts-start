import { List, Show, Create, Update, Delete } from '@/api/types'

import store from '@/store'
import { getToken, setToken, removeToken } from '@/auth'
import { Commit, ActionContext } from 'vuex'
import UserApi from '@/api/user'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = ''
export const VUEX_MOUDLE_NAME = 'user'

// interface
interface UserInterface {
  [propNmae:string]:any
}
interface State {
  user:UserInterface|null;
  token:string|undefined;
}

interface Actions {
  login ({commit}: ({commit: Commit}), payload:{email:string, password:string}) :any
  me ({commit}: ({commit: Commit})):any
  logout ({commit}: ({commit: Commit})):any
  unauthorized ({commit}: ({commit: Commit})):any
  refreshToken ({commit}: ({commit: Commit}), token:string):any
}

// state
export const state:State = {
  user: null,
  token: getToken()
}

// mutations
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

// actions
export const actions:Actions = {
  /**
   * @description 用户登录方法
   *
   * @param {({commit: Commit})} {commit}
   * @param {{email:string, password:string}} payload
   */
  async login ({commit}, payload) {
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
  async me ({commit}) {
    try {
      let {data} = await UserApi.me()
      commit('SET_USER', data)
    } catch (error) {

    }
  },

  async logout ({commit}) {
    try {
      await UserApi.logout()
      commit('REMOVE_TOKEN')
      commit('REMOVE_USER')
      commit('app/GO', {router: {name: 'login'}, type: 'replace'}, {root: true})
    } catch (error) {

    }
  },

  unauthorized ({commit}) {
    commit('REMOVE_TOKEN')
    commit('REMOVE_USER')
    commit('app/GO', {router: {name: 'login'}, type: 'replace'}, {root: true})
  },

  async refreshToken ({commit}, token) {
    commit('REFRESH_TOKEN', token)
  }
}

export const User = new class extends Helpers<Actions> {
  login (payload:{email:string, password:string}) {
    return this.dispatch('login', payload)
  }
  me () {
    return this.dispatch('me')
  }
  logout () {
    return this.dispatch('logout')
  }

  unauthorized () {
    return this.dispatch('unauthorized')
  }
}(VUEX_MOUDLE_NAME)
