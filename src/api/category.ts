import request from '@/utils/request'
import { QueryBuild, Show, Update, FormData } from './types'

const END_POINT = 'categories'

export function toTree () {
  return request({
    url: `${END_POINT}/tree`,
    method: 'get'
  })
}

export function index (payload:QueryBuild|null = null) {
  return request({
    url: `${END_POINT}`,
    method: 'get',
    params: payload
  })
}

export function show ({ id, ...queryBuild }:Show) {
  return request({
    url: `${END_POINT}/${id}`,
    method: 'get',
    params: queryBuild
  })
}

export function store (formData:FormData) {
  return request({
    url: `${END_POINT}`,
    method: 'post',
    data: formData
  })
}

export function update ({ formData, id }:Update) {
  return request({
    url: `${END_POINT}/${id}`,
    method: 'put',
    data: formData
  })
}

export function destroy (id:string|number) {
  return request({
    url: `${END_POINT}/${id}`,
    method: 'delete'
  })
}

export function products ({id, productIds}:{id:number, productIds:number[]|number}) {
  return request({
    url: `${END_POINT}/${id}/products`,
    method: 'post',
    data: {product_ids: productIds}
  })
}

export function attachProducts ({id, productIds}:{id:number, productIds:number[]|number}) {
  return request({
    url: `${END_POINT}/${id}/products/attach`,
    method: 'post',
    data: {product_ids: productIds}
  })
}

export function detachProducts ({id, productIds}:{id:number, productIds:number[]|number}) {
  return request({
    url: `${END_POINT}/${id}/products/detach`,
    method: 'post',
    data: {product_ids: productIds}
  })
}
