import { Model } from '@vuex-orm/core'
import Product from '@/models/Product'

export default class Brand extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'brands'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      description: this.attr(''),
      products: this.hasMany(Product, 'brand_id', 'id')
    }
  }
}
