import { Base } from '@/store/modules/app'
import { Commit, ActionContext } from 'vuex'
import AssetApi from '@/api/asset'
import { Helpers } from '@/store/helpers/Helpers'

export const ROUTE_NAME = 'asset'

export const VUEX_MOUDLE_NAME = 'asset'

// interface
interface State{

}

interface Actions {
  upload(ctx: ActionContext<State, any>, file:File):any
}

// actions
export const actions:Actions = {

  async upload (ctx, file) {
    try {
      let {data} = await AssetApi.upload(file)
      return data
    } catch (error) {

    }
  }
}

export const Asset = new class extends Helpers<Actions> {

}(VUEX_MOUDLE_NAME)
