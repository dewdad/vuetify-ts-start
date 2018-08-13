import request from '@/utils/request'
import { List, Show, Update, Create, Delete } from '@/api/types'
import { AxiosInstance } from '../../node_modules/axios'
import { ParseInclude } from '@/utils/decorators'

export default abstract class BaseRequest {
  constructor (path?:string) {
    // if (!path) {
    //   throw new Error('API端点未指定')
    // }
    this.path = path || ''
    this.http = request
  }

  protected http!:AxiosInstance

  /**
   *
   * Api端点
   * @protected
   * @type {(string|null)}
   * @memberof BaseRequest
   */
  protected path:string|null = null

  /**
   *
   * 获取列表
   * @param {(QueryBuild|null)} [payload=null]
   * @returns
   * @memberof BaseRequest
   */
  @ParseInclude
  public index<T> (payload:List|null = null) {
    const url = `${this.path}`
    const params = payload
    return this.http.get<T>(url, {params})
  }

  /**
   *
   * 通过id获取详情
   * @param {Show} { id, ...queryBuild }
   * @returns
   * @memberof BaseRequest
   */
  @ParseInclude
  public show<T> ({ id, ...payload }:Show) {
    const url = `${this.path}/${id}`
    const params = payload
    return this.http.get<T>(url, {params})
  }

  /**
   *
   * 数据库里插入一条新的记录
   * @param {FormData} formData
   * @returns
   * @memberof BaseRequest
   */
  @ParseInclude
  public store<T> (formData:Create) {
    const url = `${this.path}`
    const data = formData
    return this.http.post<T>(url, data)
  }

  /**
   *
   * 通过id，更新数据
   * @param {Update} { id, ...formData }
   * @returns
   * @memberof BaseRequest
   */
  @ParseInclude
  public update<T> ({ id, ...formData }:Update) {
    const url = `${this.path}/${id}`
    const data = {...formData}
    return this.http.put<T>(url, data)
  }

  /**
   *
   * 通过id删除记录
   * @param {(string|number)} id
   * @returns
   * @memberof BaseRequest
   */
  public destroy (id:Delete) {
    const url = `${this.path}/${id}`
    return this.http.delete(url)
  }
}
