type CallBackFunction = (arg0: Route) => void
export default class Route {
    public routes: any[] = [];
    public groups: any[] = [];

    public lastPush: any = {};
    public group (cb: CallBackFunction): Route {
      const route: Route = new Route()
      cb(route)
      const routes: any = _.cloneDeep({ routes: route.routes })

      this.initProxy(routes)

      this.routes.push(...routes.routes)

      this.groups.push(routes)
      return this
    }

    public initProxy (target: any): void|never {
      this.lastPush = new Proxy(target, {
        set: (target, prop, value) => {
          if (value !== undefined) {
            target[prop] = value
            return true
          }
          throw new TypeError(`The parameter ${(prop as string)} can not be undefined`)
        }
      })
    }

    public view (path: string, componentPath: string) {
      const component = () => import(`@/views/${componentPath}`)
      const route = {
        path,
        component
      }
      this.initProxy(route)
      this.routes.push(route)
      return this
    }

    public hidden (value: boolean) {
      this.lastPush.hidden = value
      return this
    }

    public alwaysShow (alwaysShow: boolean) {
      this.lastPush.alwaysShow = alwaysShow
      return this
    }

    public redirect (redirect: string) {
      this.lastPush.redirect = redirect
      return this
    }

    public meta (meta: {}|any) {
      this.lastPush.meta = meta

      return this
    }

    public name (name: string) {
      this.lastPush.name = name
      return this
    }

    public children (cb: CallBackFunction) {
      const route = new Route()
      cb(route)
      this.lastPush.children = route.routes
      return this
    }

    public getNavbar () {
      return this.tree(this.routes)
    }

    public tree (routes: any) {
      return _.reduce(routes, (res: any[], route) => {
        if (!_.get(route, 'hidden', false)) {
          const group = this.groups.find(group => group.routes.find((groupsRoute: any) => groupsRoute === route))
          if (group) {
            const routeGroup = res.find((item: any) => item.meta === group.meta)
            if (routeGroup) {
              (routeGroup as any).routes.push(route)
            } else {
              res.push({ routes: [route], meta: group.meta })
            }
          } else {
            res.push(route)
          }
        }
        return res
      }, [])
    }
}
