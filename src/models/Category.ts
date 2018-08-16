import { Model } from '@vuex-orm/core'
import Product from '@/models/Product'
import ProductCategory from '@/models/ProductCategory'

export default class Category extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'categories'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      icon: this.attr(null),
      avatar: this.attr(null),
      description: this.attr(null),
      parent_id: this.attr(null),
      products: this.belongsToMany(Product, ProductCategory, 'category_id', 'product_id')
    }
  }
}
