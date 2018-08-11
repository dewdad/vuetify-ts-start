import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext, Payload, CommitOptions } from 'vuex'
import * as ProductApi from '@/api/product'

export const ROUTE_NAME = 'product'

interface State{
  item:ApiResponse.Product| null
}

export const state:State = {
  // 当前浏览/编辑商品
  item: null
}

interface Mutations {
  'SET_ITEM':(state:State, payload:ApiResponse.Product)=>void
}

export const mutations:Mutations = {
  SET_ITEM: (state, payload) => { state.item = payload }
}

interface Getters{
  current:(state:State)=>State['item']
}

export const getters:Getters = {
  current: (state) => state.item
}
export interface Commit {
  (type: keyof Mutations, payload?: any, options?: CommitOptions): void;
  <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}
interface Context extends ActionContext<State, any> {
  commit:Commit;
  getters:Getters
}

export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await ProductApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: Context, payload:Show) {
    if (!ctx.getters.current) {
      try {
        let {data} = await ProductApi.show(payload)
        ctx.commit('SET_ITEM', data)
      } catch (error) {

      }
    }
    return ctx.getters.current
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let data = await ProductApi.store(payload)
      return data
    } catch (error) {
      console.log(error)
    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await ProductApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await ProductApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class Product extends Base {
  protected static instance:Product;

  public static get getInstance ():Product {
    if (!this.instance) {
      this.instance = new Product()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('product/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('product/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('product/store', this.assignQueryBuild(payload))
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('product/update', this.assignQueryBuild(payload))
  }

  destroy (id:number|string):Promise<any> {
    return store.dispatch('product/destroy', id)
  }

  current () {
    return store.getters('product/current')
  }
}
