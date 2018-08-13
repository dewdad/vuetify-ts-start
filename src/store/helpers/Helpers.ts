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

  filterData (items:any[]|{[propName:string]:any}, orgin = {}) {
    return _.reduce(items, (res:any, item, key) => {
      if (_.isObject(item)) {
        if (_.has(item, 'data')) {
          res[key] = this.filterData(item.data, _.isArray(item.data) ? [] : {})
        } else {
          if (_.isArray(res)) {
            res.push(this.filterData(item))
          } else {
            res[key] = this.filterData(item)
          }
        }
      } else {
        res[key] = item
      }
      return res
    }, orgin)
  }
}
