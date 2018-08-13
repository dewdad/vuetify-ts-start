import { List, Show, Create, Update, Delete } from '@/api/types'
import { Commit, ActionContext } from 'vuex'
import CategoryApi from '@/api/category'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'category'

export const VUEX_MOUDLE_NAME = 'category'

// interface
interface State{
  categories:{[propName:string]:ApiResponse.Category}
}

interface Getters{
  productIds:(state:State)=>(id:number)=>void
}
export interface AddProductPayload{
  id:number,
  product:ApiResponse.ProductData
}

interface SetCategoryPayload{
  id:number,
  category:ApiResponse.Category
}

interface Actions{
  toTree(ctx: ActionContext<State, any>):any;
  index(ctx: ActionContext<State, any>, payload?:List):any;
  show(ctx: ActionContext<State, any>, payload:Show):any;
  store(ctx: ActionContext<State, any>, payload:Create):any
  update(ctx: ActionContext<State, any>, payload:Update):any
  destroy(ctx: ActionContext<State, any>, id:Delete):any
  products (ctx: ActionContext<State, any>, payload:AddProductPayload):any
  cancelProducts (ctx: ActionContext<State, any>, payload:AddProductPayload):any
}

// state
export const state:State = {
  categories: {}
}

// mutations
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

// actions
export const actions:Actions = {
  async toTree (ctx) {
    try {
      let {data} = await CategoryApi.toTree()
      return data
    } catch (error) {

    }
  },
  async index (ctx, payload) {
    try {
      let {data} = await CategoryApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx, payload) {
    try {
      if (!ctx.state.categories[payload.id]) {
        let {data} = await CategoryApi.show(payload)
        ctx.commit('SET_CATEGORY', {id: payload.id, category: data})
      }
      return ctx.state.categories[payload.id]
    } catch (error) {

    }
  },
  async store (ctx, payload) {
    try {
      let {data} = await CategoryApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async products (ctx, payload) {
    try {
      // const productIds = ctx.getters.productIds(payload.id)
      // productIds.push(payload.product.id)
      let {data} = await CategoryApi.attachProducts({id: payload.id, productIds: payload.product.id})
      ctx.commit('ADD_PRODUCT', payload)
      return data
    } catch (error) {

    }
  },

  async cancelProducts (ctx, payload) {
    try {
      let {data} = await CategoryApi.detachProducts({id: payload.id, productIds: payload.product.id})
      ctx.commit('DEL_PRODUCT', payload)
      return data
    } catch (error) {
      console.log(error)
    }
  },

  async update (ctx, payload) {
    try {
      const { data } = await CategoryApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx, id) {
    try {
      const { data } = await CategoryApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

// getters
export const getters:Getters = {
  productIds: (state:State) => (id:number) => (state.categories[id].data.products as ApiResponse.Products).data.map(product => product.id)
}

// Helper Vuex

export const Category = new class extends Helpers<Actions, Getters> {
  /**
   * 获取列表
   */
  index (payload?:List|null) {
    return this.dispatch('index', payload)
  }
  /**
   * 获取详情
   */
  show (payload:Show):Promise<any> {
    return this.dispatch('show', payload)
  }
  /**
   * 创建
   */
  create (payload:Create):Promise<any> {
    return this.dispatch('store', payload)
  }
  /**
   * 更新
   */
  update (payload:Update):Promise<any> {
    return this.dispatch('update', payload)
  }
  /**
   * 删除
   */
  destroy (id:Delete):Promise<any> {
    return this.dispatch('destroy', id)
  }

  toTree ():Promise<any> {
    return this.dispatch('toTree')
  }

  products (payload:AddProductPayload, cancel = false):Promise<any> {
    if (cancel) {
      return this.dispatch('cancelProducts', payload)
    }
    return this.dispatch('products', payload)
  }

  productIds (id:number) {
    return this.getters('productIds')(id)
  }
}(VUEX_MOUDLE_NAME)
