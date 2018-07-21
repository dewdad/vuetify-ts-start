import { RouteConfig } from 'vue-router/types/router'
import Route from './route'

export const route = new Route()
route.view('/', 'Home.vue').name('home').meta({ title: 'home', icon: 'home', noCache: true })
route.view('/about', 'About.vue').name('about').meta({ title: 'about', icon: 'apps', noCache: true })

type Guard = (arg: RouteConfig[]) => RouteConfig[]

export type LocalRouterConfig = ({ authGuard, guestGuard }: ({authGuard: Guard, guestGuard: Guard})) => RouteConfig[]

export default ({ authGuard, guestGuard }: {authGuard: Guard, guestGuard: Guard }) => [
  // Authenticated routes.
  ...authGuard([

  ]),

  // Guest routes.
  ...guestGuard([

  ]),

  ...route.routes
]
