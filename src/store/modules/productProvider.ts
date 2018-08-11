import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as ProductProviderApi from '@/api/productProvider'
import { Base } from './app'
import { products } from '../../api/productProvider'

export const ROUTE_NAME = 'product-provider'

type delProductParams = {providerId:number, variantId:number}
type addProductParams = {providerId:number, variantId:number, price:number}
export interface RelationProducts{
  [propName:string]:{[propName:string]:{price:number}}
}
interface State{
  providers:{[propName:string]:{data:ApiResponse.ProductProviderData}}
  products:RelationProducts
}

export const state: State = {
  providers: {},
  products: {}
}

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
export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await ProductProviderApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
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
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await ProductProviderApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async products (ctx: ActionContext<State, any>, payload:{providerId:number, products:RelationProducts}) {
    try {
      let {data} = await ProductProviderApi.products({id: payload.providerId, products: {...payload.products, ...ctx.state.products[payload.providerId]}} as any)
      ctx.commit('SYNC_PRODUCT', {res: data.data, payload: payload.products, providerId: payload.providerId})
      return data
    } catch (error) {

    }
  },

  async cancelProducts (ctx: ActionContext<State, any>, payload:{providerId:number, variantId:number}) {
    try {
      const products = _.cloneDeep(ctx.state.products[payload.providerId])
      console.log(products)
      delete products[payload.variantId]
      console.log(products)
      let {data} = await ProductProviderApi.products({id: payload.providerId, products} as any)

      ctx.commit('SYNC_PRODUCT', {res: data.data, payload: payload.variantId, providerId: payload.providerId})
      return data
    } catch (error) {

    }
  },

  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await ProductProviderApi.update(payload)
      ctx.commit('DEL_PROVIDER', payload.id)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await ProductProviderApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export const getters = {
  products: (state:State) => (id:number) => state.providers[id].data.products.data,
  productIds: (state:State) => (id:number) => state.products[id],
  provider: (state:State) => (id:number) => Base.getInstance.filterData(state.providers[id].data)
}

export class ProductProvider extends Base {
  protected static instance:ProductProvider;

  public static get getInstance ():ProductProvider {
    if (!this.instance) {
      this.instance = new ProductProvider()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('productProvider/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('productProvider/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('productProvider/store', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('productProvider/update', payload)
  }

  destroy (id:number|string):Promise<any> {
    return store.dispatch('productProvider/destroy', id)
  }

  products <T> (payload:T, cancel = false):Promise<any> {
    if (cancel) {
      return store.dispatch('productProvider/cancelProducts', payload)
    }
    return store.dispatch('productProvider/products', payload)
  }

  /**
   * 获取供应商 关联产品
   *
   * @param {(number|string)} id
   * @returns {ApiResponse.ProductVariantData}
   * @memberof ProductProvider
   */
  getProducts (id:number|string):ApiResponse.ProductVariantData {
    return store.getters['productProvider/products'](id)
  }

  productIds (id:number|string) {
    return store.getters['productProvider/productIds'](id)
  }

  provider (id:number|string) {
    return store.getters['productProvider/provider'](id)
  }
}
