import { RouteConfig, PositionResult, RouterOptions } from 'vue-router/types/router'
import Router, {Route} from 'vue-router'
export type Guard = (arg: RouteConfig[]) => RouteConfig[]
export type SetLayout = (router: Router, to: Route) => void
export type ScrollBehavior = RouterOptions['scrollBehavior']
