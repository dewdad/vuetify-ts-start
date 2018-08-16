import { Plugin } from '@vuex-orm/core/lib/plugins/use'

export const plugin:Plugin = {
  // `components` contains Vuex ORM objects such as Model and Query.
  // The plugin author can then extend those objects to add
  // whatever features it needs.
  install (orm:any, options) {
    // Add global (static) method or property.
    // components.Actions = function () {
    //   // Logic...
    // }

    // Add an instance method or property.
    orm.Query.prototype.instanceMethod = function () {
      // Logic...
    }
  }
}
