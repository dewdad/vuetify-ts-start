import { DispatchFunction } from '../support/interfaces'
import Context from '../common/context'

/**
 * Provides some helper methods to interact with the Vuex-ORM store
 */
export class Store {
  /**
   * Inserts incoming data into the store. Existing data will be updated.
   *
   * @param {Data} data New data to insert/update
   * @param {Function} dispatch Vuex Dispatch method for the model
   * @return {Promise<Data>} Inserted data as hash
   */
  public static async insertData (data: any, dispatch: DispatchFunction): Promise<any> {
    let insertedData = {}

    // await Promise.all(Object.keys(data).map(async (key) => {
    //   const value = data[key]
    //   const newData = await dispatch('insertOrUpdate', { data: value })

    //   Object.keys(newData).forEach((dataKey) => {
    //     if (!insertedData[dataKey]) insertedData[dataKey] = []
    //     insertedData[dataKey] = insertedData[dataKey].concat(newData[dataKey])
    //   })
    // }))

    return insertedData
  }
}
