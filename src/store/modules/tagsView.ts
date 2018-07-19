import { RouteConfig } from 'vue-router/types/router';
import { Commit } from 'vuex';
interface State {
		visitedViews: RouteConfigEx[];
		cachedViews: any[];
}
export interface RouteConfigEx extends RouteConfig {
 title?: string;
}
export const state: State = {
	visitedViews: [],
	cachedViews: [],
};

export const mutations = {
		ADD_VISITED_VIEWS: (state: State, view: RouteConfigEx) => {
			if (state.visitedViews.some((v) => v.path === view.path)) { return; }
			state.visitedViews.push({
				name: view.name,
				path: view.path,
				title: view.meta.title || 'no-name',
			});
			if (!view.meta.noCache) {
				state.cachedViews.push(view.name);
			}
		},
		DEL_VISITED_VIEWS: (state: State, view: RouteConfigEx) => {
			for (const [i, v] of state.visitedViews.entries()) {
				if (v.path === view.path) {
					state.visitedViews.splice(i, 1);
					break;
				}
			}
			for (const i of state.cachedViews) {
				if (i === view.name) {
					const index = state.cachedViews.indexOf(i);
					state.cachedViews.splice(index, 1);
					break;
				}
			}
		},
		DEL_OTHERS_VIEWS: (state: State, view: RouteConfigEx) => {
			for (const [i, v] of state.visitedViews.entries()) {
				if (v.path === view.path) {
					state.visitedViews = state.visitedViews.slice(i, i + 1);
					break;
				}
			}
			for (const i of state.cachedViews) {
				if (i === view.name) {
					const index = state.cachedViews.indexOf(i);
					state.cachedViews = state.cachedViews.slice(index, i + 1);
					break;
				}
			}
		},
		DEL_ALL_VIEWS: (state: State) => {
			state.visitedViews = [];
			state.cachedViews = [];
		},
	};

export const actions = {
		addVisitedViews({ commit }: {commit: Commit}, view: RouteConfigEx) {
			commit('ADD_VISITED_VIEWS', view);
		},
		delVisitedViews({ commit, state }: {commit: Commit, state: State}, view: RouteConfigEx) {
			return new Promise((resolve) => {
				commit('DEL_VISITED_VIEWS', view);
				resolve([...state.visitedViews]);
			});
		},
		delOthersViews({ commit, state }: {commit: Commit, state: State}, view: RouteConfigEx) {
			return new Promise((resolve) => {
				commit('DEL_OTHERS_VIEWS', view);
				resolve([...state.visitedViews]);
			});
		},
		delAllViews({ commit, state }: {commit: Commit, state: State}) {
			return new Promise((resolve) => {
				commit('DEL_ALL_VIEWS');
				resolve([...state.visitedViews]);
			});
		},
};

