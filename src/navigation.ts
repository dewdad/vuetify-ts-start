export default [
  {name: 'home', meta: {title: '首页', icon: 'home'}},
  {meta: {title: '产品管理', icon: 'home'},
    routes: [
      {name: 'brand.index', meta: {title: '品牌管理'}},
      {name: 'product-type.index', meta: {title: '产品类型管理'}},
      {name: 'attribute-group.index', meta: {title: '属性组管理'}},
      {name: 'attribute.index', meta: {title: '属性值管理'}},
      {name: 'category.index', meta: {title: '分类管理'}},
      {name: 'product.index', meta: {title: '产品管理'}}
    ]
  },
  {meta: {title: '供应商管理', icon: 'home'},
    routes: [
      {name: 'product-provider.index', meta: {title: '供应商管理'}}
    ]
  },
  {meta: {title: '采购管理', icon: 'event'},
    routes: [
      {name: 'procurement.index', meta: {title: '采购管理'}}
    ]
  }
]
