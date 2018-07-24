import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as ProductProviderApi from '@/api/productProvider'
import { Base } from './app'

export const ROUTE_NAME = 'product-provider'

interface State{

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
      let {data} = await ProductProviderApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await ProductProviderApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await ProductProviderApi.update(payload)
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

export class ProductProvider extends Base {
  static index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('productProvider/index', this.assignQueryBuild(payload))
  }

  static show (payload:Show):Promise<any> {
    console.log(this.assignQueryBuild(payload))
    return store.dispatch('productProvider/show', this.assignQueryBuild(payload))
  }

  static create (payload:FormData):Promise<any> {
    return store.dispatch('productProvider/store', payload)
  }

  static update (payload:Update):Promise<any> {
    return store.dispatch('productProvider/store', payload)
  }

  static destory (id:number|string):Promise<any> {
    return store.dispatch('productProvider/destory', id)
  }
}
