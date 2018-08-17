import { List, Show, Create, Update, Delete } from '@/api/types'
import { Commit, ActionContext, GetterTree } from 'vuex'
import ProductProviderApi from '@/api/productProvider'
import { Helpers } from '@/store/helpers/Helpers'
import { RootState } from '@/store/types'

export const ROUTE_NAME = 'product-provider'

export const VUEX_MOUDLE_NAME = 'productProvider'

// interface
type delProductParams = {providerId:number, variantId:number}
type addProductParams = {providerId:number, variantId:number, price:number}
export interface RelationProductPayload{
  id:number;
  product?:{id:number, attribute:{price:number}};
  'product_ids'?:number[]|number;
}
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
  attachProduct (ctx: ActionContext<State, any>, payload:RelationProductPayload):any
  detachProduct (ctx: ActionContext<State, any>, payload:RelationProductPayload):any
}

interface Getters {
  products: (state:State) => (id:number) => ApiResponse.ProductVariantData[];
  productIds: (state:State) => (id:number) => any;
  provider: (state:State) => (id:number) => any;
  providerOffer: (state:State, getters:Getters) => (id:number) => ApiResponse.ProductVariantData['pivot'];
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
  ADD_OR_UPDATE_PROVIDER_PRODUCT: (state:State, payload:{id:number, product:ApiResponse.ProductVariantData}) => {
    const provider = state.providers[payload.id].data
    const products = provider.products ? provider.products.data : Object.assign({}, provider.products, {data: []})
    // 确认是否已存在
    const index = products.findIndex(item => item.id === payload.product.id)
    index ? products.splice(index, 1, payload.product) : products.push(payload.product)
  },
  // 提取当前供应商管理产品报价
  SET_PRODUCT: (state:State, payload:{data:ApiResponse.ProductProviderData}) => {
    state.products[payload.data.id] = {}
    const products = state.providers[payload.data.id].data.products
    if (products) {
      products.data.forEach(variant => {
        const price = variant.pivot ? variant.pivot.price : 0
        state.products[payload.data.id][variant.id] = {price}
      })
    }
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
  },

  async attachProduct (ctx, payload) {
    try {
      let {data} = await ProductProviderApi.attachProducts({id: payload.id, product: payload.product})
      ctx.commit('ADD_OR_UPDATE_PROVIDER_PRODUCT', {id: payload.id, product: data.data})
    } catch (error) {

    }
  },

  async detachProduct (ctx, payload) {
    try {
      let {data} = await ProductProviderApi.detachProducts({id: payload.id, productIds: payload.product_ids})
      // ctx.commit('DEL_PRODUCT', payload)
      return data
    } catch (error) {
      console.log(error)
    }
  }
}

// getters
export const getters:GetterTree<State, RootState> = {
  // 供应商id获取对应产品
  products: state => (id:number) => {
    const provider = state.providers[id]
    if (provider) {
      return provider.data.products ? provider.data.products.data : []
    }
    return []
  },
  // 获取供应商产品报价
  providerOffer: (state, getters) => (id:number) => getters['products'](id).map((item:ApiResponse.ProductVariantData) => item.pivot),
  productIds: state => (id:number) => state.products[id],
  provider: state => (id:number) => state.providers[id].data
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

  providerOffer (id:number):ApiResponse.ProductVariantData['pivot'][] {
    return this.getters('providerOffer')(id)
  }

  attach (payload:RelationProductPayload) {
    return this.dispatch('attachProduct', payload)
  }

  detach (payload:RelationProductPayload) {
    return this.dispatch('detachProduct', payload)
  }
}(VUEX_MOUDLE_NAME)
