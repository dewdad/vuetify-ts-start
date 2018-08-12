import request from '@/utils/request'
import { QueryBuild, Show, Update, FormData } from '@/api/types'
import { AxiosInstance } from '../../node_modules/axios'

export default abstract class BaseRequest {
  constructor (path:string) {
    if (!path) {
      throw new Error('API端点未指定')
    }
    this.path = path
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
   * 关联关系查询
   * @protected
   * @type {string[]}
   * @memberof BaseRequest
   */
  protected _include:string[] = []

  public with (arg:string[]):this {
    this._include.push(...arg)
    return this
  }

  parseInclude () {
    return [...new Set(this._include)].join(',')
  }

  get include () {
    return { include: this.parseInclude() }
  }

  assignQueryBuild (queryBuild:QueryBuild|null) {
    return Object.assign({}, this.include, queryBuild)
  }

  /**
   *
   * 获取列表
   * @param {(QueryBuild|null)} [payload=null]
   * @returns
   * @memberof BaseRequest
   */
  public index<T> (payload:QueryBuild|null = null) {
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
  public store<T> (formData:FormData) {
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
  public destroy (id:string|number) {
    const url = `${this.path}/${id}`
    return this.http.delete(url)
  }
}
