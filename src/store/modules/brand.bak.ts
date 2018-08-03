import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as BrandApi from '@/api/brand'

export const ROUTE_NAME = 'brand'

function funcDec () {
  /**
  * @param target 被装饰方法所在类的prototype的值，比如 function a() {};a.prototype.func = function()   {},target就是a.prototype，所以可以给类追加方法
  * @param key 被修饰function的名称字符串
  * @param PropertyDescriptor 被修饰的方法的属性和值 configurable:true，enumerable:true，value:function () { … }，writable:true
  */
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    console.log(arguments)
    console.log(target)
    console.log(key)
    console.log(descriptor)
  }
}

interface State{
  list:ApiResponse.BrandData[]
}

export const mutations ={

}
export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await BrandApi.index(payload)
      console.log(payload)
      console.log(data)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
    try {
      let {data} = await BrandApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await BrandApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await BrandApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await BrandApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class Brand extends Base {
  protected static instance:Brand;

  public static get getInstance ():Brand {
    if (!this.instance) {
      this.instance = new Brand()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('brand/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('brand/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('brand/store', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('brand/update', payload)
  }

  destroy (id:number|string):Promise<any> {
    return store.dispatch('brand/destroy', id)
  }
}
