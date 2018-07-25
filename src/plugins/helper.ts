import Vue from 'vue'
function tipsParamsPaser (params:any) {
  let obj:any = {}
  if (_.isObject(...params)) {
    obj = params
  } else {
    obj.text = params[0]
    if (params[1]) {
      obj.position = params[1]
    }
  }
  return obj
}
Vue.mixin({
  methods: {
    $loading ({ show = false, text = '' }) {
      this.$store.commit('app/SET_LOADING', {show, text})
    },

    /**
     * @description 成功提示
     *
     */
    $success (params:{text:string, position:number}) {
      this.$store.commit('app/TOGGLE_SNACKBAR', { status: true, color: 'success', ...params })
    },
    /**
     * @description 失败提示
     *
     */
    $fail (params:{text:string, position:number}) {
      this.$store.commit('app/TOGGLE_SNACKBAR', { status: true, color: 'error', ...params })
    }

  }
})
