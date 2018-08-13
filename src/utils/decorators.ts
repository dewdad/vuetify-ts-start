// 为api类添加请求端点
export function Path (path: string) {
  return function <T extends {new (...args:any[]):{}}>(constructor:T) {
    const Class = class extends constructor {
      path = path;
    }
    // Class.instance = BrandApi;
    return Class
  }
}

interface SingletonInterface<T>{
  new (...args:any[]):{};
  getInstance?:(...args:any[])=>T;
  instance:T|undefined;
}

export function Singleton<T> (constructor: new ()=> T): T {
  return new constructor()
}

interface VuexHelperParams<S, M, A, G>{
  state?:S;
  mutations?:M;
  actions?:A;
  getters?:G;
}

type Constructor<T> = { new(...args: any[]): T }

export function VuexHelper<S, M, A, G> (params:VuexHelperParams<S, M, A, G>) {
  return function <T extends { new (...args: any[]): {} }> (constructor:T) {
    return class extends constructor {
      actions = params.actions
      state = params.state
      mutations = params.mutations
      getters = params.getters
    }
  }
}

/**
 * 为查询添加关联关系
 * @param  {string[]} include
 */
export function With (include:string[]) {
  return function (target:any, property:string, descriptor:PropertyDescriptor) {
    // save original value, which is method (function)
    let originalMethod = descriptor.value
    // replace method implementation
    descriptor.value = function (...args:any[]) {
      if (args.length>0 && include.length>0) {
        args[0].include = include
      }
      // here, call original method
      // `this` points to the instance
      return originalMethod.call(this, ...args)
    }
    return descriptor
  }
}
/**
 * 解析include
 * @param  {any} target
 * @param  {string} property
 * @param  {PropertyDescriptor} descriptor
 */
export function ParseInclude (target:any, property:string, descriptor:PropertyDescriptor) {
  let originalMethod = descriptor.value
  // replace method implementation
  descriptor.value = function (...args:any[]) {
    if (args.length>0 && args[0].include) {
      const include = args[0].include
      args[0].include = [...new Set(include)].join(',')
    }
    // here, call original method
    // `this` points to the instance
    return originalMethod.call(this, ...args)
  }
  return descriptor
}
