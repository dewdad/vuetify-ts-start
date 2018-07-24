import store from '@/store'
import Cookies from 'js-cookie'
import Router from 'vue-router'

const TokenKey = 'app-token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token:string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export default class Auth {
  public router: Router;
  public store: any;

  constructor (router: Router) {
    this.router = router
    this.store = store
  }

  get token () {
    return getToken()
  }

  get roles () {
    return this.store.getters.roles
  }

  get addRouters () {
    return this.store.getters.addRouters
  }

  set addRouters (routers) {
    const addRouters = routers || this.addRouters;
    (this.router as any).addRouters(addRouters)
  }

  // public attempt (setLayout: SetLayout) {
  //   this.beforeEach(setLayout)

  //   this.afterEach()
  // }

  // public beforeEach (setLayout: SetLayout) {
  //   this.router.beforeEach(async (to, from, next) => {
  //     setLayout(this.router, to)
  //     next()
  //     // }
  //   })
  // }

  public afterEach () {
    this.router.afterEach((to, from) => {
      const { app } = this.router
      app.$nextTick(() => {
        app.$bus.$emit('linear:start')
      })
    })
  }
}
