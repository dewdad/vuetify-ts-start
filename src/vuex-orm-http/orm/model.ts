import ORMModel from '@vuex-orm/core/lib/model/Model'
import Context from '../common/context'
const inflection = require('inflection')

/**
 * Wrapper around a Vuex-ORM model with some useful methods
 */
export default class Model {
  /**
   * The singular name of a model like `blogPost`
   * @type {string}
   */
  public readonly singularName: string;

  /**
   * The plural name of a model like `blogPosts`
   * @type {string}
   */
  public readonly pluralName: string;

  /**
   * The original Vuex-ORM model
   */
  public readonly baseModel: ORMModel;

  /**
   * The fields of the model
   * @type {Map<string, Field>}
   */

  /**
   * @constructor
   * @param {Model} baseModel The original Vuex-ORM model
   */
  public constructor (baseModel: ORMModel) {
    this.baseModel = baseModel

    // Generate name variants
    this.singularName = inflection.singularize(this.baseModel.entity)
    this.pluralName = inflection.pluralize(this.baseModel.entity)
  }

  /**
   * Adds $isPersisted and other meta fields to the model by overwriting the fields() method.
   * @todo is this a good way to add fields?
   * @param {Model} model
   */
  public static augment (model: Model) {
    const originalFieldGenerator = model.baseModel.fields.bind(model.baseModel)

    model.baseModel.fields = () => {
      const originalFields = originalFieldGenerator()

      originalFields['$isPersisted'] = model.baseModel.boolean(false)

      return originalFields
    }
  }
}
