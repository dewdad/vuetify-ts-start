import { QueryBuild, Show, FormData, Update } from '@/api/types'
import {Module, VuexModule, CacheAction, Action, Mutation} from '@/../vuex-module-decorators/src'

@Module({namespaced:true, name:'cache'})
export default class CacheModule extends VuexModule {
  cachelist = new Map()

  @Mutation
  setList (payload:{response:any, key:string}) {
    if (!this.cachelist.has(payload.key)) {
      this.cachelist.set(payload.key, payload.response)
    }
  }
}
