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

  {path: '/brands', name: 'brand.index', meta: {title: '品牌管理'}, component: () => import('@/views/brand/Index.vue')},
  {path: '/brands/create', name: 'brand.create', meta: {title: '创建品牌'}, component: () => import('@/views/brand/Create.vue')},
  {path: '/brands/:id', name: 'brand.show', meta: {title: '品牌详情'}, component: () => import('@/views/brand/Show.vue')},
  {path: '/brands/:id/update', name: 'brand.update', meta: {title: '品牌修改/更新'}, component: () => import('@/views/brand/Update.vue')},

  {path: '/product-types', name: 'product-type.index', meta: {title: '产品类型管理'}, component: () => import('@/views/productType/Index.vue')},
  {path: '/product-types/create', name: 'product-type.create', meta: {title: '创建产品类型'}, component: () => import('@/views/productType/Create.vue')},
  {path: '/product-types/:id', name: 'product-type.show', meta: {title: '产品类型详情'}, component: () => import('@/views/productType/Show.vue')},
  {path: '/product-types/:id/update', name: 'product-type.update', meta: {title: '产品类型修改/更新'}, component: () => import('@/views/productType/Update.vue')},

  {path: '/attribute-groups', name: 'attribute-group.index', meta: {title: '属性组管理'}, component: () => import('@/views/attributeGroup/Index.vue')},
  {path: '/attribute-groups/create', name: 'attribute-group.create', meta: {title: '创建属性组'}, component: () => import('@/views/attributeGroup/Create.vue')},
  {path: '/attribute-groups/:id', name: 'attribute-group.show', meta: {title: '属性组详情'}, component: () => import('@/views/attributeGroup/Show.vue')},
  {path: '/attribute-groups/:id/update', name: 'attribute-group.update', meta: {title: '属性组修改/更新'}, component: () => import('@/views/attributeGroup/Update.vue')},

  {path: '/attributes', name: 'attribute.index', meta: {title: '属性值管理'}, component: () => import('@/views/attribute/Index.vue')},
  {path: '/attributes/create', name: 'attribute.create', meta: {title: '创建属性值'}, component: () => import('@/views/attribute/Create.vue')},
  {path: '/attributes/:id', name: 'attribute.show', meta: {title: '属性值详情'}, component: () => import('@/views/attribute/Show.vue')},
  {path: '/attributes/:id/update', name: 'attribute.update', meta: {title: '属性值修改/更新'}, component: () => import('@/views/attribute/Update.vue')},

  { path: '*', name: 'error404', component: () => import('@/views/error/404.vue'), hidden: true }

]
