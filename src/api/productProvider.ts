import BaseRequest from './BaseRequest'
import { RelationProducts } from '@/store/modules/productProvider'
const END_POINT = 'product_providers'

export default new class extends BaseRequest {
  products ({id, products}:{id:number, products:RelationProducts}) {
    const url =`${this.path}/${id}/products`
    return this.http.post(url, {products})
  }
}(END_POINT)
