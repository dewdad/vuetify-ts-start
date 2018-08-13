import BaseRequest from './BaseRequest'

const END_POINT = 'categories'

export default new class extends BaseRequest {
  toTree () {
    const url = `${this.path}/tree`
    return this.http.get(url)
  }

  products ({id, productIds}:{id:number, productIds:number[]|number}) {
    const url = `${this.path}/${id}/products`
    return this.http.post(url, {product_ids: productIds})
  }

  attachProducts ({id, productIds}:{id:number, productIds:number[]|number}) {
    const url = `${this.path}/${id}/products/attach`
    return this.http.post(url, {product_ids: productIds})
  }

  detachProducts ({id, productIds}:{id:number, productIds:number[]|number}) {
    const url = `${this.path}/${id}/products/detach`
    return this.http.post(url, {product_ids: productIds})
  }
}(END_POINT)
