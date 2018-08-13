import BaseRequest from './BaseRequest'
import { AxiosPromise } from 'axios'

console.log(BaseRequest)
export default new class extends BaseRequest {
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
