import { Model } from '@vuex-orm/core'
import Product from '@/models/Product'

export default class Asset extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'assets'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      url: this.attr(''),
      height: this.number(0),
      width: this.number(0),
      size: this.number(0),
      type: this.attr(''),
      thumb: this.attr(null)
      // assetable_type
    }
  }
}
