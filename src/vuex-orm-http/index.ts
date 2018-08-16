import VuexORMHttp from './vuex-orm-http'
import { Components } from '@vuex-orm/core/lib/plugins/use'
import { Options } from './support/interfaces'

/**
 * Plugin class. This just provides a static install method for Vuex-ORM and stores the instance of the model
 * within this.instance.
 */
export default class VuexORMHttpPlugin {
  /**
   * Contains the instance of VuexORMHttp
   */
  public instance!: VuexORMHttp;

  /**
   * This is called, when VuexORM.install(VuexOrmHttp, options) is called.
   *
   * @param {Components} components The Vuex-ORM Components collection
   * @param {Options} options The options passed to VuexORM.install
   * @returns {VuexORMHttp}
   */
  public static install (components: Components, options: Options): VuexORMHttp {
    const plugin = new VuexORMHttpPlugin()
    plugin.instance = new VuexORMHttp(components, options)

    return plugin.instance
  }
}
