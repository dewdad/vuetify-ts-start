import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as BrandApi from '@/api/brand'
import {Module, VuexModule, CacheAction, Action, Mutation} from '@/../vuex-module-decorators/src'

export const ROUTE_NAME = 'brand'

interface State{
  list:ApiResponse.BrandData[]
}

@Module({namespaced:true, name:'brand'})
export default class BrandModule extends VuexModule {
  @CacheAction({cache:true})
  async index (payload:QueryBuild) {
    try {
      let {data} = await BrandApi.index(payload)
      return data
    } catch (error) {

    }
  }

  @CacheAction({cache:true})
  async show (payload:Show) {
    try {
      let {data} = await BrandApi.show(payload)
      console.log(payload)
      console.log(data)
      return data
    } catch (error) {

    }
  }

  @CacheAction
  async store (payload:FormData) {
    try {
      let data = await BrandApi.store(payload)
      return data
    } catch (error) {

    }
  }

  @CacheAction
  async update (payload:Update) {
    try {
      const data = await BrandApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  @CacheAction
  async destroy (id:string|number) {
    try {
      const { data } = await BrandApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class Brand extends Base {
  protected static instance:Brand;

  public static get getInstance ():Brand {
    if (!this.instance) {
      this.instance = new Brand()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('brand/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('brand/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('brand/store', this.assignQueryBuild(payload))
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('brand/update', this.assignQueryBuild(payload))
  }

  destroy (id:number|string):Promise<any> {
    return store.dispatch('brand/destroy', id)
  }
}
