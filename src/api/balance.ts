import request from '@/utils/request'
import { QueryBuild, Show, Update, FormData } from './types'

export function index (payload:QueryBuild|null = null) {
  return request({
    url: '/balances',
    method: 'get',
    params: payload
  })
}

export function show ({ id, queryBuild = null }:Show) {
  return request({
    url: `/balances/${id}`,
    method: 'get',
    params: queryBuild
  })
}

export function store (formData:FormData) {
  return request({
    url: `/balances`,
    method: 'post',
    data: formData
  })
}

export function update ({ formData, id }:Update) {
  return request({
    url: `/balances/${id}`,
    method: 'put',
    data: formData
  })
}

export function destroy (id:string|number) {
  return request({
    url: `/balances/${id}`,
    method: 'delete'
  })
}
