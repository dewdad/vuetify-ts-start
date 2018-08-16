import ORMModel from '@vuex-orm/core/lib/model/Model'
import Database from '@vuex-orm/core/lib/database/Database'
import RootState from '@vuex-orm/core/lib/modules/contracts/RootState'
import { AxiosInstance } from 'axios'

export type DispatchFunction = (action: string, data: any) => Promise<any>

export interface Options {
  database: Database;
  http:AxiosInstance;
}

export interface ActionParams {
  commit: any;
  dispatch: DispatchFunction;
  getters: any;
  rootGetters: any;
  rootState: any;
  state: RootState;
}

export class PatchedModel extends ORMModel {
  static async fetch (payload:any): Promise<any> { return undefined }
  static async mutate (params: ActionParams): Promise<any> { return undefined }
  static async customQuery (params: ActionParams): Promise<any> { return undefined }
}
