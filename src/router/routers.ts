import { RouteConfig } from 'vue-router/types/router'

type Guard = (arg: RouteConfig[]) => RouteConfig[]

export type LocalRouterConfig = ({ authGuard, guestGuard }: ({authGuard: Guard, guestGuard: Guard})) => RouteConfig[]

export default ({ authGuard, guestGuard }: {authGuard: Guard, guestGuard: Guard }) => [
  // Authenticated routes.
  ...authGuard([
    {path: '/', name: 'home', component: () => import('@/views/Home.vue')}
  ]),

  // Guest routes.
  ...guestGuard([
    {path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue')}
  ]),
  { path: '*', name: 'error404', component: () => import('@/views/error/404.vue'), hidden: true }

]
