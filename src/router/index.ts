import Vue, { VueConstructor } from 'vue'
import store from '@/store'
import Meta from 'vue-meta'
import routes from '@/router/routers'
import Router, { Route, RouteRecord, RawLocation } from 'vue-router'
import { sync } from 'vuex-router-sync'
import { PositionResult, RouteConfig, Position, NavigationGuard } from 'vue-router/types/router'
import { getToken } from '@/auth' // getToken from cookie

Vue.use(Meta)
Vue.use(Router)

/**
 * Redirect to login if guest.
 *
 * @param  {RouteConfig[]} routes
 * @return {Array}
 */
type Guard = (arg: RouteConfig[]) => RouteConfig[]

const authGuard: Guard = routes => beforeEnter(routes, (to, from, next) => {
  if (!getToken()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

/**
 * Redirect home if authenticated.
 *
 * @param  {RouteConfig[]} routes
 * @return {Array}
 */
const guestGuard: Guard = routes => beforeEnter(routes, (to, from, next) => {
  if (getToken()) {
    next({ name: 'home' })
  } else {
    next()
  }
})

const router = make(routes({ authGuard, guestGuard }))

sync(store, router)

export default router

/**
 * Create a new router instance.
 *
 * @param  {RouteConfig[]} routes
 * @return {Router}
 */
function make (routes: RouteConfig[]) {
  const router = new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })

  // Register before guard.
  router.beforeEach(async (to, from, next) => {
    // if (!store.getters['auth/authCheck'] && store.getters['auth/authToken']) {
    //   try {
    //     await store.dispatch('auth/fetchUser')
    //   } catch (e) { }
    // }

    setLayout(router, to)
    next()
  })

  // Register after hook.
  router.afterEach((to, from) => {
    router.app.$nextTick(() => {
      router.app.$bus.$emit('linear:finish')
    })
  })

  return router
}

/**
 * Set the application layout from the matched page component.
 *
 * @param {Router} router
 * @param {Route} to
 */
export type SetLayout = (router: Router, to: Route) => void

function setLayout (router: Router, to: Route) {
  // Get the first matched component.

  router.onReady(() => {
    const [component] = router.getMatchedComponents({ ...to })
    if (component) {
      router.app.$nextTick(() => {
      // Start the page loading bar.
        if ((component as any).loading !== false) {
          router.app.$bus.$emit('linear:start')
        }
        // Set application layout.
        let layout = 'app'
        if (component.hasOwnProperty('options')) {
          layout = (component as any).options.layout
        }
        if (component.hasOwnProperty('resolved')) {
          layout = (component as any).resolved.options.layout
        }
        router.app.$bus.$emit('setLayout', layout)
      })
    }
  })
}

/**
 * Apply beforeEnter guard to the routes.
 *
 * @param  {RouteConfig[]} routes
 * @param  {Function} beforeEnter
 * @return {Array}
 */
function beforeEnter (routes: RouteConfig[], beforeEnter: NavigationGuard): RouteConfig[] {
  return routes.map(route => ({ ...route, beforeEnter }))
}

/**
 * @param  {Route} to
 * @param  {Route} from
 * @param  {Object|undefined} savedPosition
 * @return {Object}
 */

type ScrollBehavior = (
    to: Route,
    from: Route,
    savedPosition: Position | void,
  ) => PositionResult | Promise<PositionResult>

// tslint:disable-next-line:max-line-length
const scrollBehavior: ScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  }

  const position: any = {}

  if (to.hash) {
    position.selector = to.hash
  }

  if (to.matched.some(m => m.meta.scrollToTop)) {
    position.x = 0
    position.y = 0
  }

  return position
}
