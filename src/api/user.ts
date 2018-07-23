import request from '@/utils/request'

export function login (payload:{email: string, password: string}) {
  return request({
    url: '/login',
    method: 'post',
    data: payload
  })
}

export function me () {
  return request({
    url: '/me',
    method: 'get'
  })
}
