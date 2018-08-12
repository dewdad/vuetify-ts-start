import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'

import getters from '@/store/getters'
import { RootState } from './types'

Vue.use(Vuex)

const mergeModule = (module:any) => module.default ? module.default : {...module, namespaced: true}

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
  getters
}

export default new Vuex.Store<RootState>(store)
