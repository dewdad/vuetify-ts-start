import BaseRequest from './BaseRequest'
import { RelationProductPayload } from '../store/modules/productProvider'
const END_POINT = 'product_providers'

export default new class extends BaseRequest {
  products ({id, product}:{id:number, product:RelationProductPayload['product']}) {
    const url =`${this.path}/${id}/products`
    return this.http.post(url, {product})
  }

  attachProducts ({id, product}:{id:number, product:RelationProductPayload['product']}) {
    const url = `${this.path}/${id}/products/attach`
    return this.http.post(url, {product})
  }

  detachProducts ({id, productIds}:{id:number, productIds:RelationProductPayload['product_ids']}) {
    const url = `${this.path}/${id}/products/detach`
    return this.http.post(url, {product_ids: productIds})
  }
}(END_POINT)
