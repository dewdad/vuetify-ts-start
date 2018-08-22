import { List, Show, Create, Update, Delete } from '@/api/types'

import { Commit, GetterTree, MutationTree, ActionTree, Module, Dispatch } from 'vuex'
import ProcurementApi from '@/api/procurement'
import { AxiosPromise } from 'axios'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'procurement'

export const VUEX_MOUDLE_NAME = 'procurement'

// interface
interface State{
  list:ApiResponse.BrandData[]
}

interface Actions{
  index(ctx: ActionContext<State, any>, payload?:List):any;
  show(ctx: ActionContext<State, any>, payload:Show):any;
  store(ctx: ActionContext<State, any>, payload:Create):any
  update(ctx: ActionContext<State, any>, payload:Update):any
  destroy(ctx: ActionContext<State, any>, id:Delete):any
}

export interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}

// state
export const state:State = {
  list: []
}

// mutations
export const mutations ={

}

// actions
export const actions:Actions = {
  async index (ctx, payload) {
    try {
      // payload maybe has include prop = {includ:['']}
      let {data} = await ProcurementApi.index<any>(payload)
      // console.log(payload)
      // console.log(data)
      return data
    } catch (error) {

    }
  },
  async show (ctx, payload) {
    try {
      let {data} = await ProcurementApi.show<any>(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx, payload) {
    try {
      let data = await ProcurementApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx, payload) {
    try {
      const data = await ProcurementApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx, id) {
    try {
      const { data } = await ProcurementApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

// getters

// Helper Vuex

export const Procurement = new class extends Helpers<Actions> {
  /**
   * 获取列表
   */
  index (payload?:List|null):AxiosPromise<any> {
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
