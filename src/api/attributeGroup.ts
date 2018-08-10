import request from '@/utils/request'
import { QueryBuild, Show, Update, FormData } from '@/api/types'

const END_POINT = 'attribute-groups'

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

export function update ({ id, ...formData }:Update) {
  return request({
    url: `${END_POINT}/${id}`,
    method: 'put',
    data: {...formData}
  })
}

export function destroy (id:string|number) {
  return request({
    url: `${END_POINT}/${id}`,
    method: 'delete'
  })
}
