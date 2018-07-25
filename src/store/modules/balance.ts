import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as BalanceApi from '@/api/balance'

export const ROUTE_NAME = 'balance'

interface State{

}
export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await BalanceApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
    try {
      let {data} = await BalanceApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await BalanceApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await BalanceApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await BalanceApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class Balance extends Base {
  protected static instance:Balance;

  public static get getInstance ():Balance {
    if (!this.instance) {
      this.instance = new Balance()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('balance/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('balance/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('balance/store', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('balance/update', payload)
  }

  destory (id:number|string):Promise<any> {
    return store.dispatch('balance/destory', id)
  }
}
