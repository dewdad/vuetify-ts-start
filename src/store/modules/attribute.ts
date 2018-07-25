import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as AttributeApi from '@/api/attribute'

export const ROUTE_NAME = 'attribute'

interface State{

}
export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await AttributeApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
    try {
      let {data} = await AttributeApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await AttributeApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await AttributeApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await AttributeApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class Attribute extends Base {
  protected static instance:Attribute;

  public static get getInstance ():Attribute {
    if (!this.instance) {
      this.instance = new Attribute()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('attribute/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('attribute/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('attribute/store', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('attribute/update', payload)
  }

  destory (id:number|string):Promise<any> {
    return store.dispatch('attribute/destory', id)
  }
}
