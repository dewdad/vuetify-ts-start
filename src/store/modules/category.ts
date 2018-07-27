import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as CategoryApi from '@/api/category'

export const ROUTE_NAME = 'category'

interface State{

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
      let {data} = await CategoryApi.show(payload)
      return data
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

  update (payload:Update):Promise<any> {
    return store.dispatch('category/update', payload)
  }

  destory (id:number|string):Promise<any> {
    return store.dispatch('category/destory', id)
  }
}
