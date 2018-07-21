import Cookies from 'js-cookie'
import { Commit } from 'vuex'

interface State {
  snackbar: Snackbar;
  drawer: boolean;
  loading: Loading;
}

interface Snackbar {
  snackbar: boolean;
  color?: string;
  mode?: string;
  timeout?: number;
  text?: any;
}

interface Loading {
  text?: string;
  show: boolean;
}

export const state: State = {
  snackbar: {
    snackbar: false,
    color: '',
    mode: '',
    timeout: 3000,
    text: null
  },
  drawer: false,
  loading: {
    show: false,
    text: ''
  }
}

export const mutations = {
  TOGGLE_DRAWER: (state: State) => {
    state.drawer = !state.drawer
  },
  CHANGE_DRAWER: (state: State, status: boolean) => (state.drawer = status),

  // 全局底部栏通知
  TOGGLE_SNACKBAR: (state: State, payload: Snackbar) => {
    state.snackbar = Object.assign({}, state.snackbar, payload)
  },
  SET_LOADING: (state: State, { show, text = null }: ({show: boolean, text: string})) => {
    if (_.isNull(text)) {
      state.loading.text = 'Please stand by'
      state.loading.show = show
    } else {
      state.loading = Object.assign({}, state.loading, { show, text })
    }
  }
}

export const actions = {
  toggleSideBar ({ commit }: ({commit: Commit})) {
    commit('TOGGLE_SIDEBAR')
  },
  changeDrawer ({ commit }: ({commit: Commit}), status: boolean) {
    commit('CHANGE_DRAWER', status)
  },
  toggleDrawer ({ commit }: ({commit: Commit})) {
    commit('TOGGLE_DRAWER')
  }
}
