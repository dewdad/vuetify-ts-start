import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';

Vue.use(Vuex);

const requireContext = require.context('./modules', false, /.*\.ts$/);

const modules: any = requireContext.keys()
	.map((file) =>
		[file.replace(/(^.\/)|(\.ts$)/g, ''), requireContext(file)],
	)
	.reduce((moduless, [name, module]) => {
		(moduless as any)[name] = module;
		(moduless as any)[name].namespaced = true;
		return modules;
	}, {});

export default new Vuex.Store({
	modules,
	getters,
	// plugins: [createPersistedState({ storage: window.sessionStorage })]
});

