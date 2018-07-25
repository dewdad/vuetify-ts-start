import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as AttributeGroupApi from '@/api/attributeGroup'

export const ROUTE_NAME = 'attribute-group'

export interface AttributeGroupItem{
  'can_upload'?:boolean;
  'created_at'?:string;
  customized:boolean;
  id?:number;
  name:string;
  required:boolean;
  type:string;
  'updated_at'?:string;
  variant:boolean
}
interface State{

}
export const actions = {
  async index (ctx: ActionContext<State, any>, payload:QueryBuild) {
    try {
      let {data} = await AttributeGroupApi.index(payload)
      return data
    } catch (error) {

    }
  },
  async show (ctx: ActionContext<State, any>, payload:Show) {
    try {
      let {data} = await AttributeGroupApi.show(payload)
      return data
    } catch (error) {

    }
  },
  async store (ctx: ActionContext<State, any>, payload:FormData) {
    try {
      let {data} = await AttributeGroupApi.store(payload)
      return data
    } catch (error) {

    }
  },
  async update (ctx: ActionContext<State, any>, payload:Update) {
    try {
      const { data } = await AttributeGroupApi.update(payload)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async destroy (ctx: ActionContext<State, any>, id:string|number) {
    try {
      const { data } = await AttributeGroupApi.destroy(id)
      return data
    } catch (error) {
      console.error(error)
    }
  }
}

export class AttributeGroup extends Base {
  protected static instance:AttributeGroup;

  public static get getInstance ():AttributeGroup {
    if (!this.instance) {
      this.instance = new AttributeGroup()
    }
    return this.instance
  }

  index (payload:QueryBuild|null = null):Promise<any> {
    return store.dispatch('attributeGroup/index', this.assignQueryBuild(payload))
  }

  show (payload:Show):Promise<any> {
    return store.dispatch('attributeGroup/show', this.assignQueryBuild(payload))
  }

  create (payload:FormData):Promise<any> {
    return store.dispatch('attributeGroup/store', payload)
  }

  update (payload:Update):Promise<any> {
    return store.dispatch('attributeGroup/update', payload)
  }

  destory (id:number|string):Promise<any> {
    return store.dispatch('attributeGroup/destory', id)
  }
}
