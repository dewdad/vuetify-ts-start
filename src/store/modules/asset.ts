import { Base } from '@/store/modules/app'
import { QueryBuild, Show, FormData, Update } from '@/api/types'
import store from '@/store'
import { Commit, ActionContext } from 'vuex'
import * as AssetApi from '@/api/asset'

export const ROUTE_NAME = 'asset'

interface State{

}
export const actions = {

  async upload (ctx: ActionContext<State, any>, file:string) {
    try {
      let {data} = await AssetApi.upload(file)
      return data
    } catch (error) {

    }
  }
}
