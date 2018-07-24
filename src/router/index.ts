import Vue, { VueConstructor, ComponentOptions } from 'vue'
import store from '@/store'
import Meta from 'vue-meta'
import routes from '@/router/routers'
import Router, { Route, RouteRecord, RawLocation } from 'vue-router'
import { sync } from 'vuex-router-sync'
import { PositionResult, RouteConfig, Position, NavigationGuard, Component, RouterOptions } from 'vue-router/types/router'
import { getToken } from '@/auth' // getToken from cookie
import { Guard, ScrollBehavior } from './types'

Vue.use(Meta)
Vue.use(Router)

// The middleware for every page of the application.
const globalMiddleware:any[] = []

// Load middleware modules dynamically.
const routeMiddleware = resolveMiddleware(require.context('@/middlewares', false, /.*\.ts$/))
/**
 * Redirect to login if guest.
 *
 * @param  {RouteConfig[]} routes
 * @return {Array}
 */

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

/**
 * Global router guard.
 *
 */
const beforeEach:NavigationGuard = async (to, from, next) => {
  // Get the matched components and resolve them.
  const components = await resolveComponents(router.getMatchedComponents({ ...to }))
  if (components.length === 0) {
    return next()
  }

  // Start the loading bar.
  if ((components[components.length - 1] as any).loading !== false) {
    // router.app.$nextTick(() => router.app.$loading.start())
    router.app.$nextTick(() => router.app.$bus.$emit('linear:start'))
  }

  // Get the middleware for all the matched components.
  const middleware = getMiddleware(components)

  // Call each middleware.
  callMiddleware(middleware, to, from, (...args:any[]) => {
    // Set the application layout only if "next()" was called with no args.
    if (args.length === 0) {
      router.app.$bus.$emit('setLayout', (components[0] as any).default.options.layout)
    }

    next(...args)
  })
}

/**
 * Global after hook.
 *
 */
const afterEach:(to:Route, from:Route)=>void = async (to, from) => {
  await router.app.$nextTick()
  router.app.$bus.$emit('linear:finish')
}

const router = createRouter(routes({ authGuard, guestGuard }))

sync(store, router)

export default router

/**
 * Create a new router instance.
 *
 */
function createRouter (routes: RouteConfig[]) {
  const router = new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })

  router.beforeEach(beforeEach) // before hook
  router.afterEach(afterEach) // after hook
  return router
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

/**
 * Resolve async components.
 *
 * @param  {Array} components
 * @return {Array}
 */
async function resolveComponents (components:Component[]):Promise<Component[]> {
  return await Promise.all(
    components.map(async component => {
      return typeof component === 'function' ? await (component as Function)() : component
    })
  )
}

/**
 * Call each middleware.
 *
 */
function callMiddleware (middleware:any[], to:Route, from:Route, next:(to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
  const stack = middleware.reverse()

  const _next = (...args:any[]) => {
    console.log(args)
    // Stop if "_next" was called with an argument or the stack is empty.
    if (args.length > 0 || stack.length === 0) {
      if (args.length > 0) {
        router.app.$bus.$emit('linear:finish')
      }

      return next(...args)
    }

    const middleware = stack.pop()

    if (typeof middleware === 'function') {
      middleware({app: router.app, to, from, next: _next})
    } else if (routeMiddleware[middleware]) {
      routeMiddleware[middleware]({app: router.app, to, from, next: _next})
    } else {
      throw Error(`Undefined middleware [${middleware}]`)
    }
  }

  _next()
}

/**
 * Merge the the global middleware with the components middleware.
 *
 */
function getMiddleware (components:Component[]) {
  const middleware = [...globalMiddleware]

  components.filter((c: any) => c.default.options.middleware).forEach((component:any) => {
    if (Array.isArray(component.default.options.middleware)) {
      middleware.push(...component.default.options.middleware)
    } else {
      middleware.push(component.default.options.middleware)
    }
  })

  return middleware
}

function resolveMiddleware (requireContext:any) {
  return requireContext
    .keys()
    .map((file:string) => [file.replace(/(^.\/)|(\.ts$)/g, ''), requireContext(file)])
    .reduce((guards:{[propName:string]:any}, [name, guard]:[string, any]) => ({ ...guards, [name]: guard.default }), {})
}
