import Context from '../common/context'
import { Store } from '../orm/store'
import { DispatchFunction } from '../support/interfaces'
import Model from '../orm/model'
import RootState from '@vuex-orm/core/lib/modules/contracts/RootState'
const inflection = require('inflection')

/**
 * Base class for all Vuex actions. Contains some utility and convenience methods.
 */
export default class Action {
  /**
   * Sends a mutation.
   *
   * @param {string} name Name of the mutation like 'createUser'
   * @param {Data | undefined} variables Variables to send with the mutation
   * @param {Function} dispatch Vuex Dispatch method for the model
   * @param {Model} model The model this mutation affects.
   * @param {boolean} multiple Tells if we're requesting a single record or multiple.
   * @returns {Promise<any>}
   */
  protected static async mutation (name: string, dispatch: DispatchFunction,
    model: Model): Promise<any> {
    return true
  }

  /**
   * Convenience method to get the model from the state.
   * @param {RootState} state Vuex state
   * @returns {Model}
   */
  protected static getModelFromState (state: RootState): Model {
    return Context.getInstance().getModel(state.$name)
  }
}
