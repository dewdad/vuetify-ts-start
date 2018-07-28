import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as ProductProviderApi from '@/api/productProvider'
import { Base } from './app'
import { products } from '../../api/productProvider'

export const ROUTE_NAME = 'product-provider'

type delProductParams = {productProviderId:number, variantId:number}
type addProductParams = {productProviderId:number, variantId:number, price:number}
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
  ADD_PROVIDER: (state:State, payload:{data:ApiResponse.ProductProviderData}) => {
    state.providers[payload.data.id] = payload
    state.products[payload.data.id] = {}
    state.providers[payload.data.id].data.products.data.forEach(variant => {
      state.products[payload.data.id][variant.id] = {price: variant.pivot.price}
    })
  },
  DEL_PROVIDER: (state:State, id:number) => {
    delete state.providers[id]
    delete state.products[id]
  },
  ADD_PRODUCT: (state:State, {productProviderId, variantId, price}:addProductParams) => (state.products[productProviderId] = Object.assign({}, state.products[productProviderId], {variantId: {price}})),
  DEL_PRODUCT: (state:State, {productProviderId, variantId}:delProductParams) => delete state.products[productProviderId][variantId],
  SYNC_PRODUCT: (state:State, {res, payload, productProviderId}:any) => {
    const {attached, detached, updated} =res
    // add
    attached.forEach((id:number) => {
      if (payload[id]) {
        state.products[productProviderId][id] = payload[id]
      }
    })
    // del
    detached.forEach((id:number) => {
      delete state.products[productProviderId][id]
    })
    // updated
    updated.forEach((id:number) => {
      if (payload[id]) {
        state.products[productProviderId][id] = payload[id]
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
        ctx.commit('ADD_PROVIDER', data)
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
  async products (ctx: ActionContext<State, any>, payload:{id:number, products:RelationProducts}) {
    try {
      let {data} = await ProductProviderApi.products({id: payload.id, products: {...payload.products, ...ctx.state.products[payload.id]}} as any)
      ctx.commit('SYNC_PRODUCT', {res: data.data, payload: payload.products, productProviderId: payload.id})
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
  productIds: (state:State) => (id:number) => state.products[id]
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

  destory (id:number|string):Promise<any> {
    return store.dispatch('productProvider/destory', id)
  }

  products (payload:{id:number, products:RelationProducts}):Promise<any> {
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
}
