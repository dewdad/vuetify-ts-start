import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as CategoryApi from '@/api/category'

export const ROUTE_NAME = 'category'

interface State{
  categories:{[propName:string]:ApiResponse.Category}
}

export const state:State = {
  categories: {}
}

export interface AddProductPayload{
  id:number,
  product:ApiResponse.ProductData
}

interface SetCategoryPayload{
  id:number,
  category:ApiResponse.Category
}

export const mutations = {
  ADD_PRODUCT: (state:State, {id, product}:AddProductPayload) => {
    (state.categories[id].data.products as ApiResponse.Products).data.includes(product) || (state.categories[id].data.products as ApiResponse.Products).data.push(product)
  },
  DEL_PRODUCT: (state:State, {id, product}:AddProductPayload) => {
    const products =state.categories[id].data.products as ApiResponse.Products
    const index = products.data.indexOf(product)
    products.data.splice(index, 1)
  },
  SET_CATEGORY: (state:State, {id, category}:SetCategoryPayload) => {
    state.categories[id] = category
  },
  SYNC_PRODUCT: (state:State, {res, payload}:{res:any, payload:AddProductPayload}) => {
    const {id, product} = payload
    const {attached, detached} = res

    attached.forEach((element:number) => {
      if (product.id === element) {
        (state.categories[id].data.products as ApiResponse.Products).data.push(product)
      }
    })

    detached.forEach((element:number) => {
      if (product.id === element) {
        const products =state.categories[id].data.products as ApiResponse.Products
        const index = products.data.indexOf(product)
        products.data.splice(index, 1)
      }
    })
  }

}

export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await CategoryApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
    try {
      if (!ctx.state.categories[payload.id]) {
        let {data} = await CategoryApi.show(payload)
        ctx.commit('SET_CATEGORY', {id: payload.id, category: data})
      }
      return ctx.state.categories[payload.id]
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await CategoryApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async products (ctx: ActionContext<State, any>, payload:AddProductPayload) {
    try {
      // const productIds = ctx.getters.productIds(payload.id)
      // productIds.push(payload.product.id)
      let {data} = await CategoryApi.attachProducts({id: payload.id, productIds: payload.product.id})
      ctx.commit('ADD_PRODUCT', payload)
      return data
    } catch (error) {

    }
  },

  async cancelProducts (ctx: ActionContext<State, any>, payload:AddProductPayload) {
    try {
      let {data} = await CategoryApi.detachProducts({id: payload.id, productIds: payload.product.id})
      ctx.commit('DEL_PRODUCT', payload)
      return data
    } catch (error) {
      console.log(error)
    }
  },

  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await CategoryApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await CategoryApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

interface Getters{
  productIds:(state:State)=>(id:number)=>void
}

export const getters:Getters = {
  productIds: (state:State) => (id:number) => (state.categories[id].data.products as ApiResponse.Products).data.map(product => product.id)
}

export class Category extends Base {
  protected static instance:Category;

  public static get getInstance ():Category {
    if (!this.instance) {
      this.instance = new Category()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('category/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('category/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('category/store', payload)
  }

  products (payload:AddProductPayload, cancel = false):Promise<any> {
    console.log(payload)
    console.log(cancel)
    if (cancel) {
      return store.dispatch('category/cancelProducts', payload)
    }
    return store.dispatch('category/products', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('category/update', payload)
  }

  destroy (id:number|string):Promise<any> {
    return store.dispatch('category/destroy', id)
  }

  productIds (id:number) {
    return store.getters['category/productIds'](id)
  }
}
