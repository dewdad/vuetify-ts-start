import { List, Show, Create, Update, Delete } from '@/api/types'
import { Commit, ActionContext, Payload, CommitOptions } from 'vuex'
import ProductApi from '@/api/product'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'product'

export const VUEX_MOUDLE_NAME = 'product'

// interface
interface State{
  item:ApiResponse.Product| null
}

interface Mutations {
  'SET_ITEM':(state:State, payload:ApiResponse.Product)=>void
}

interface Getters{
  current:(state:State)=>State['item']
}

export interface Commit {
  (type: keyof Mutations, payload?: any, options?: CommitOptions): void;
  <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}
interface Context extends ActionContext<State, any> {
  commit:Commit;
  getters:Getters
}

interface Actions{
  index(ctx: ActionContext<State, any>, payload?:List):any;
  show(ctx: ActionContext<State, any>, payload:Show):any;
  store(ctx: ActionContext<State, any>, payload:Create):any
  update(ctx: ActionContext<State, any>, payload:Update):any
  destroy(ctx: ActionContext<State, any>, id:Delete):any
}

// state
export const state:State = {
  // 当前浏览/编辑商品
  item: null
}

// mutations
export const mutations:Mutations = {
  SET_ITEM: (state, payload) => { state.item = payload }
}

// getters
export const getters:Getters = {
  current: (state) => state.item
}

// actions
export const actions:Actions = {
  async index (ctx, payload) {
    try {
      let {data} = await ProductApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx, payload) {
    if (!ctx.getters.current) {
      try {
        let {data} = await ProductApi.show(payload)
        ctx.commit('SET_ITEM', data)
      } catch (error) {

      }
    }
    return ctx.getters.current
  },
  async store (ctx, payload) {
    try {
      let data = await ProductApi.store(payload)
      return data
    } catch (error) {
      console.log(error)
    }
  },
  async update (ctx, payload) {
    try {
      const { data } = await ProductApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx, id) {
    try {
      const { data } = await ProductApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export const Product = new class extends Helpers<Actions, Getters> {
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

  current () {
    return this.getters('current')
  }
}(VUEX_MOUDLE_NAME)
