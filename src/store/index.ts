import Vue from 'vue'
import Vuex, {StoreOptions, Module} from 'vuex'

import VuexORM from '@vuex-orm/core'
import database from './database'
import VuexORMHttp from '@/vuex-orm-http'
import getters from '@/store/getters'
import { RootState } from './types'
import http from '@/utils/request'
// VuexORM.use(VuexORMHttp, { database, http })
Vue.use(Vuex)
const mergeModule = (module:any) => {
  const {actions, getters, mutations, state} = module
  return module.default ? module.default : {...{actions, getters, mutations, state}, namespaced: true}
}

const requireContext = require.context('./modules', false, /.*\.ts$/)
interface VuexModule {[propName: string]: any; }
const modules: VuexModule = requireContext.keys()
  .map(file => [file.replace(/(^.\/)|(\.ts$)/g, ''), requireContext(file)])
  // tslint:disable-next-line:max-line-length
  .reduce((moduless: VuexModule, [name, module]) => ({ ...moduless, ...{ [name]: mergeModule(module) } }), {})

const store:StoreOptions<RootState> = {
  state: {
    version: 'v1.0.0'
  },
  modules,
  getters,
  plugins: [
    VuexORM.install(database)
  ]

}

export default new Vuex.Store<RootState>(store)
