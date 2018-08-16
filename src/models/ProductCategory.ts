import { Model } from '@vuex-orm/core'

export default class ProductCategory extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'productCategories'

  static primaryKey = ['product_id', 'category_id']
  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      product_id: this.attr(null),
      category_id: this.attr(null)
    }
  }
}
