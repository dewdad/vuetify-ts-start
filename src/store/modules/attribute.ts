import { List, Show, Create, Update, Delete } from '@/api/types'
import { Commit, ActionContext } from 'vuex'
import AttributeApi from '@/api/attribute'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'attribute'

export const VUEX_MOUDLE_NAME = 'attribute'

// interface
export interface AttributeItem extends LocalAttributeItem{
  'created_at':string|null;
  id:number;
  'updated_at':string|null;
  variant:boolean
}

export interface LocalAttributeItem{
  'group_id':number;
  value:string;
}
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
  async index (ctx, payload) {
    try {
      let {data} = await AttributeApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx, payload) {
    try {
      let {data} = await AttributeApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx, payload) {
    try {
      let {data} = await AttributeApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx, payload) {
    try {
      const { data } = await AttributeApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx, id) {
    try {
      const { data } = await AttributeApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export const Attribute = new class extends Helpers<Actions> {
  /**
   * 获取列表
   * @param  {List|null} payload
   */
  index (payload:List|null) {
    return this.dispatch('index', payload)
  }
  /**
   * 获取详情
   * @param  {Show} payload
   */
  show (payload:Show):Promise<any> {
    return this.dispatch('show', payload)
  }
  /**
   * 创建
   * @param  {Create} payload
   */
  create (payload:Create):Promise<any> {
    return this.dispatch('store', payload)
  }
  /**
   * 更新
   * @param  {Update} payload
   */
  update (payload:Update):Promise<any> {
    return this.dispatch('update', payload)
  }
  /**
   * 删除
   * @param  {number|string} id
   */
  destroy (id:number|string):Promise<any> {
    return this.dispatch('destroy', id)
  }
}(VUEX_MOUDLE_NAME)
