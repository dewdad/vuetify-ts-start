import { List, Show, Create, Update, Delete } from '@/api/types'

import { Commit, ActionContext } from 'vuex'
import ProductTypeApi from '@/api/productType'
import { AxiosPromise, AxiosError } from 'axios'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'product-type'

export const VUEX_MOUDLE_NAME = 'productType'

// interface
export interface LocalProductTypeItem{
  config:null|{};
  name:string;
}

export interface ProductTypeItem extends LocalProductTypeItem{
  'created_at':string|null;
  id:number;
  'updated_at':string|null
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

// state

// actions
export const actions:Actions = {
  async index (ctx, payload) {
    try {
      let {data} = await ProductTypeApi.index<ApiResponse.ProductTypes>(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx, payload) {
    try {
      let {data} = await ProductTypeApi.show<ApiResponse.ProductType>(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx, payload) {
    try {
      let data = await ProductTypeApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx, payload) {
    try {
      const data = await ProductTypeApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx, id) {
    try {
      const { data } = await ProductTypeApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export const ProductType = new class extends Helpers<Actions> {
  /**
   * 获取列表
   * @param  {QueryBuild|null} payload
   */
  index (payload?:List|null):AxiosPromise<ApiResponse.Brands> {
    return this.dispatch('index', payload)
  }
  /**
   * 获取详情
   * @param  {Show} payload
   */
  show (payload:Show):AxiosPromise<ApiResponse.ProductTypeData> {
    return this.dispatch('show', payload)
  }
  /**
   * 创建
   * @param  {FormData} payload
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
  destroy (id:Delete):Promise<any> {
    return this.dispatch('destroy', id)
  }
}(VUEX_MOUDLE_NAME)
