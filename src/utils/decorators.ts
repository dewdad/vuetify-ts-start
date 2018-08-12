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
  return function <T extends { new (...args: any[]): {} }> (constructor:T):T & Constructor<VuexHelperParams<S, M, A, G>> {
    return class extends constructor implements VuexHelperParams<S, M, A, G> {
      actions = params.actions
    }
  }
}
