import request from '@/utils/request'
import { QueryBuild, Show, Update, FormData } from '@/api/types'

const END_POINT = 'assets'

export function upload (file:string) {
  return request({
    url: `${END_POINT}/upload`,
    method: 'post',
    data: file
  })
}
