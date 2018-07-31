import Vue from 'vue'
import Vuex from 'vuex'

import getters from '@/store/getters'

Vue.use(Vuex)

const mergeModule = (module:any) => module.default ? module.default : {...module, namespaced: true}

const requireContext = require.context('./modules', false, /.*\.ts$/)
interface VuexModule {[propName: string]: any; }
const modules: VuexModule = requireContext.keys()
  .map(file => [file.replace(/(^.\/)|(\.ts$)/g, ''), requireContext(file)])
  // tslint:disable-next-line:max-line-length
  .reduce((moduless: VuexModule, [name, module]) => ({ ...moduless, ...{ [name]: mergeModule(module) } }), {})

export default new Vuex.Store({
  modules,
  getters
  // plugins: [createPersistedState({ storage: window.sessionStorage })]
})
