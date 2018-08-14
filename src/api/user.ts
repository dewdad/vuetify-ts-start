import BaseRequest from '@/api/BaseRequest'
import { AxiosPromise } from 'axios'
import request from '@/utils/request'

export default new class {
  get http () {
    return request
  }

  login (payload:{email: string, password: string}) {
    return this.http.post('/login', payload)
  }

  me () {
    return this.http.get('/me')
  }

  logout () {
    return this.http.post('/logout')
  }
}()
