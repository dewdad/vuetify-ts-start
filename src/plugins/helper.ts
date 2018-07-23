import Vue from 'vue'

Vue.mixin({
  methods: {
    $loading ({ show = false, text = '' }) {
      this.$store.commit('app/SET_LOADING', {show, text})
    }
  }
})
