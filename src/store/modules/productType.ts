import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as ProductTypeApi from '@/api/productType'

export const ROUTE_NAME = 'product-type'

interface State{

}
export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await ProductTypeApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
    try {
      let {data} = await ProductTypeApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await ProductTypeApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await ProductTypeApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await ProductTypeApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class ProductType extends Base {
  protected static instance:ProductType;

  public static get getInstance ():ProductType {
    if (!this.instance) {
      this.instance = new ProductType()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('productType/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('productType/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('productType/store', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('productType/update', payload)
  }

  destory (id:number|string):Promise<any> {
    return store.dispatch('productType/destory', id)
  }
}
