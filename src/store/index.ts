import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';

Vue.use(Vuex);

const requireContext = require.context('./modules', false, /.*\.ts$/);
interface VuexModule {[propName: string]: any; }
const modules: VuexModule = requireContext.keys()
	.map((file) => [file.replace(/(^.\/)|(\.ts$)/g, ''), requireContext(file)])
	// tslint:disable-next-line:max-line-length
	.reduce((moduless: VuexModule, [name, module]) => ({...moduless, ...{[name]: {...module, namespaced: true}} }), {});

export default new Vuex.Store({
	modules,
	getters,
	// plugins: [createPersistedState({ storage: window.sessionStorage })]
});

