import Vue from 'vue'

const handleSymbol: unique symbol = Symbol('handleSymbol')
const eventsMap: unique symbol = Symbol('eventsMap')
export class EventBus {
  private Vue: Vue;
  private [handleSymbol]: any;
  private [eventsMap]: any;
  constructor (vue: Vue) {
    if (!this[handleSymbol]) {
      Object.defineProperty(this, handleSymbol, {
        value: {},
        enumerable: false
      })
    }
    this.Vue = vue
    this[eventsMap] = {}
  }
  public mapEventsToUid (uid: any, eventName: string) {
    this[eventsMap][uid] = this[eventsMap][uid] || []
    this[eventsMap][uid].push(eventName)
  }
  /**
   *
   * @param {string} eventName
   * @param {() => void} callback
   * @param {Vue} vm
   * @memberof EventBus
   * 第三个参数vm传入当前组件 this
 */
  public $on (eventName: string, callback: (args: any) => void, vm: Vue) {
    this[handleSymbol][eventName] = this[handleSymbol][eventName] || []
    this[handleSymbol][eventName].push(callback)
    this.mapEventsToUid((vm as any)._uid, eventName)
  }
  public $emit (...args: any[]) {
    const [eventName, ...params] = args
    const eventHandlers = this[handleSymbol][eventName] || []
    eventHandlers.forEach((fn: any) => {
      fn(...params)
    })
  }
  public $offByUid (uid: number) {
    const currentEvents = this[eventsMap][uid] || []
    currentEvents.forEach((event: string) => {
      this.$off(event)
    })
    delete this[eventsMap][uid]
  }
  public $off (eventName: string) {
    delete this[handleSymbol][eventName]
  }
}

const $EventBus: any = {}

$EventBus.install = (Vue: Vue|any, option: any) => {
  Vue.prototype.$bus = new EventBus(Vue)
  Vue.mixin({
    beforeDestroy () {
      this.$bus.$offByUid(this._uid)
    }
  })
}

Vue.use($EventBus)

export default $EventBus
