import { List, Show, Create, Update, Delete } from '@/api/types'
import { Commit, ActionContext } from 'vuex'
import PaymentApi from '@/api/payment'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'payment'

export const VUEX_MOUDLE_NAME = 'payment'

// interface
interface State{

}

interface Actions{
  index(ctx: ActionContext<State, any>, payload?:List):any;
  show(ctx: ActionContext<State, any>, payload:Show):any;
  store(ctx: ActionContext<State, any>, payload:Create):any
  update(ctx: ActionContext<State, any>, payload:Update):any
  destroy(ctx: ActionContext<State, any>, id:Delete):any
}

// actions
export const actions:Actions = {
  async index (ctx, payload = {}) {
    try {
      let {data} = await PaymentApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx, payload) {
    try {
      let {data} = await PaymentApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx, payload) {
    try {
      let {data} = await PaymentApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx, payload) {
    try {
      const { data } = await PaymentApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx, id) {
    try {
      const { data } = await PaymentApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

// Helper Vuex

export const Payment = new class extends Helpers<Actions> {
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
}(VUEX_MOUDLE_NAME)
