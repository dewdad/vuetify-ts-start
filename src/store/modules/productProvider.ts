import { List, Show, Create, Update, Delete } from '@/api/types'
import { Commit, ActionContext } from 'vuex'
import ProductProviderApi from '@/api/productProvider'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'product-provider'

export const VUEX_MOUDLE_NAME = 'productProvider'

// interface
type delProductParams = {providerId:number, variantId:number}
type addProductParams = {providerId:number, variantId:number, price:number}
export interface RelationProducts{
  [propName:string]:{[propName:string]:{price:number}}
}
interface State{
  providers:{[propName:string]:{data:ApiResponse.ProductProviderData}}
  products:RelationProducts
}

interface Actions{
  index(ctx: ActionContext<State, any>, payload?:List):any;
  show(ctx: ActionContext<State, any>, payload:Show):any;
  store(ctx: ActionContext<State, any>, payload:Create):any
  update(ctx: ActionContext<State, any>, payload:Update):any
  destroy(ctx: ActionContext<State, any>, id:Delete):any
  products (ctx: ActionContext<State, any>, payload:{providerId:number, products:RelationProducts}):any
  cancelProducts (ctx: ActionContext<State, any>, payload:{providerId:number, variantId:number}):any
}

interface Getters {
  products: (state:State) => (id:number) => any;
  productIds: (state:State) => (id:number) => any;
  provider: (state:State) => (id:number) => any;
}

// state
export const state: State = {
  providers: {},
  products: {}
}

// mutations
export const mutations = {
  SET_PROVIDER: (state:State, payload:{data:ApiResponse.ProductProviderData}) => {
    state.providers[payload.data.id] = payload
    state.products[payload.data.id] = {}
  },
  SET_PRODUCT: (state:State, payload:{data:ApiResponse.ProductProviderData}) => {
    state.products[payload.data.id] = {}
    state.providers[payload.data.id].data.products.data.forEach(variant => {
      const price = variant.pivot ? variant.pivot.price : 0
      state.products[payload.data.id][variant.id] = {price}
    })
  },
  DEL_PROVIDER: (state:State, id:number) => {
    delete state.providers[id]
    delete state.products[id]
  },
  ADD_PRODUCT: (state:State, {providerId, variantId, price}:addProductParams) => (state.products[providerId] = Object.assign({}, state.products[providerId], {variantId: {price}})),
  DEL_PRODUCT: (state:State, {providerId, variantId}:delProductParams) => delete state.products[providerId][variantId],
  SYNC_PRODUCT: (state:State, {res, payload, providerId}:any) => {
    const {attached, detached, updated} =res
    // add
    attached.forEach((id:number) => {
      if (payload[id]) {
        state.products[providerId][id] = payload[id]
      }
    })
    // del
    detached.forEach((id:number) => {
      delete state.products[providerId][id]
    })
    // updated
    updated.forEach((id:number) => {
      if (payload[id]) {
        state.products[providerId][id] = payload[id]
      }
    })
  }
}

// actions
export const actions:Actions = {
  async index (ctx, payload) {
    try {
      let {data} = await ProductProviderApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx, payload) {
    try {
      if (!ctx.state.providers[payload.id]) {
        let {data} = await ProductProviderApi.show(payload)
        const {include} = payload
        ctx.commit('SET_PROVIDER', data)
        include && include.includes('products') && ctx.commit('SET_PRODUCT', data)
      }

      return ctx.state.providers[payload.id]
    } catch (error) {
      console.error(error)
    }
  },
  async store (ctx, payload) {
    try {
      let data = await ProductProviderApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async products (ctx, payload) {
    try {
      let {data} = await ProductProviderApi.products({id: payload.providerId, products: {...payload.products, ...ctx.state.products[payload.providerId]}} as any)
      ctx.commit('SYNC_PRODUCT', {res: data.data, payload: payload.products, providerId: payload.providerId})
      return data
    } catch (error) {

    }
  },

  async cancelProducts (ctx, payload) {
    try {
      const products = _.cloneDeep(ctx.state.products[payload.providerId])
      delete products[payload.variantId]
      let {data} = await ProductProviderApi.products({id: payload.providerId, products} as any)
      ctx.commit('SYNC_PRODUCT', {res: data.data, payload: payload.variantId, providerId: payload.providerId})
      return data
    } catch (error) {

    }
  },

  async update (ctx, payload) {
    try {
      const data = await ProductProviderApi.update(payload)
      ctx.commit('DEL_PROVIDER', payload.id)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx, id) {
    try {
      const { data } = await ProductProviderApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

// getters
export const getters = {
  products: (state:State) => (id:number) => state.providers[id].data.products.data,
  productIds: (state:State) => (id:number) => state.products[id],
  provider: (state:State) => (id:number) => state.providers[id].data
}

// Helper Vuex

export const ProductProvider = new class extends Helpers<Actions, Getters> {
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

  products <T> (payload:T, cancel = false):Promise<any> {
    if (cancel) {
      return this.dispatch('cancelProducts', payload)
    }
    return this.dispatch('products', payload)
  }

  getProducts (id:number):ApiResponse.ProductVariantData {
    return this.getters('products')(id)
  }

  productIds (id:number) {
    return this.getters('productIds')(id)
  }

  provider (id:number) {
    return this.getters('provider')(id)
  }
}(VUEX_MOUDLE_NAME)
