import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as PaymentApi from '@/api/payment'
import { Base } from '@/store/modules/app'

export const ROUTE_NAME = 'payment'

interface State{

}
export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await PaymentApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
    try {
      let {data} = await PaymentApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await PaymentApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await PaymentApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await PaymentApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class Payment extends Base {
  protected static instance:Payment;

  public static get getInstance ():Payment {
    if (!this.instance) {
      this.instance = new Payment()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('payment/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('payment/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('payment/store', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('payment/update', payload)
  }

  destory (id:number|string):Promise<any> {
    return store.dispatch('payment/destory', id)
  }
}
