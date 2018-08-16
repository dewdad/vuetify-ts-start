import Context from '../common/context'
import { Store } from '../orm/store'
import { ActionParams } from '../support/interfaces'
import Action from './action'

/**
 * Fetch action for sending a query. Will be used for Model.fetch().
 */
export default class Fetch extends Action {
  public static async call ({ state, dispatch }: ActionParams, params?: ActionParams): Promise<any> {
    const context = Context.getInstance()

    const model = this.getModelFromState(state)

    // Send the request to the GraphQL API
    const data = await context.http.get('/')

    // Insert incoming data into the store
    return Store.insertData(data, dispatch)
  }
}
