import { RouteConfig, PositionResult, RouterOptions } from 'vue-router/types/router'
import Router, {Route, RawLocation} from 'vue-router'
import Vue from 'vue'
export type Guard = (arg: RouteConfig[]) => RouteConfig[]
export type SetLayout = (router: Router, to: Route) => void
export type ScrollBehavior = RouterOptions['scrollBehavior']
export interface middlewareFun{
  app:Vue;
  to:Route;
  from:Route;
  next:(to?: RawLocation | false | ((vm: Vue) => any) | void) => void;
}
