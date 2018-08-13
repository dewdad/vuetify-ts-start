import BaseRequest from './BaseRequest'
import { AxiosPromise } from 'axios'

const END_POINT = ''

export default new class extends BaseRequest {
  login (payload:{email: string, password: string}):AxiosPromise<any> {
    return this.http.post('/login', payload)
  }

  me () {
    return this.http.get('/me')
  }

  logout () {
    return this.http.post('/logout')
  }
}(END_POINT)
