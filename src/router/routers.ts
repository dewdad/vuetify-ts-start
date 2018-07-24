import { RouteConfig } from 'vue-router/types/router'

type Guard = (arg: RouteConfig[]) => RouteConfig[]

export type LocalRouterConfig = ({ authGuard, guestGuard }: ({authGuard: Guard, guestGuard: Guard})) => RouteConfig[]

export default ({ authGuard, guestGuard }: {authGuard: Guard, guestGuard: Guard }) => [
  // Authenticated routes.
  ...authGuard([

  ]),

  // Guest routes.
  ...guestGuard([

  ]),
  {path: '/', name: 'home', component: () => import('@/views/Home.vue')},
  {path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue')},
  {path: '/product-providers', name: 'product-provider.index', meta: {title: '供应商管理'}, component: () => import('@/views/productProvider/Index.vue')},
  {path: '/product-providers/create', name: 'product-provider.create', meta: {title: '创建供应商管理'}, component: () => import('@/views/productProvider/Create.vue')},
  {path: '/product-providers/:id', name: 'product-provider.show', meta: {title: '供应商详情'}, component: () => import('@/views/productProvider/Show.vue')},
  {path: '/product-providers/:id/update', name: 'product-provider.update', meta: {title: '供应商修改/更新'}, component: () => import('@/views/productProvider/Update.vue')},

  { path: '*', name: 'error404', component: () => import('@/views/error/404.vue'), hidden: true }

]
