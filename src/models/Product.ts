import { Model, Attribute } from '@vuex-orm/core'
import Brand from '@/models/Brand'
import ProductType from '@/models/ProductType'
import Category from '@/models/Category'
import ProductCategory from '@/models/ProductCategory'

export default class Product extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'products'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields ():any {
    return {
      id: this.attr(null),
      code: this.attr(''),
      name: this.attr(''),
      name_cn: this.attr(''),
      name_en: this.attr(''),
      enabled: this.attr(true),
      body: this.attr(''),

      brand_id: this.attr(null),
      brand: this.belongsTo(Brand, 'brand_id', 'id'),

      type_id: this.attr(null),
      type: this.belongsTo(ProductType, 'type_id'),

      categories: this.belongsToMany(Category, ProductCategory, 'product_id', 'category_id')
    }
  }
}
