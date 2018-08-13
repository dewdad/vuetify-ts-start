import store from '@/store'
import { Store } from 'vuex'
import { RootState } from '@/store/types'

interface VuexHelperParams<S, M, A, G>{
  state?:S;
  mutations?:M;
  actions?:A;
  getters?:G;
}

export abstract class Helpers<A = any, G = any> {
  protected namespace:string|null = null

  constructor (namespace:string) {
    this.namespace = namespace
  }

  private getActionName (name:string) {
    return this.namespace ? `${this.namespace}/${name}` : name
  }

  get store () {
    return store
  }

  protected dispatch<T> (action:keyof A & string, payload?:T) {
    return this.store.dispatch(this.getActionName(action), payload)
  }

  protected getters<T> (getterName:keyof G & string, payload?:T) {
    return payload
      ? this.store.getters[this.getActionName(getterName)](payload)
      : this.store.getters[this.getActionName(getterName)]
  }
}
