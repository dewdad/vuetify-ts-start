import BaseRequest from './BaseRequest'
const END_POINT = 'assets'

export default new class extends BaseRequest {
  upload (file:File) {
    const url = `${this.path}/upload`
    return this.http.post(url, file)
  }
}(END_POINT)
