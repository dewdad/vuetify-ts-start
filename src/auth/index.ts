import store from '@/store'
import Cookies from 'js-cookie'
import Router from 'vue-router'
import { SetLayout } from '../router/index'

const TokenKey = 'Admin-Token'

export default class Auth {
  public router: Router;
  public store: any;

  constructor (router: Router) {
    this.router = router
    this.store = store
  }

  get token () {
    return Cookies.get(TokenKey)
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

  public attempt (setLayout: SetLayout) {
    this.beforeEach(setLayout)

    this.afterEach()
  }

  public beforeEach (setLayout: SetLayout) {
    this.router.beforeEach(async (to, from, next) => {
      setLayout(this.router, to)
      next()
      // }
    })
  }

  public afterEach () {
    this.router.afterEach((to, from) => {
      const { app } = this.router
      app.$nextTick(() => {
        app.$bus.$emit('linear:start')
      })
    })
  }
}
