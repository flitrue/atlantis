import request, { RESTful } from '@/utils/request'

const mockUrl = ''
// const mockUrl = 'http://api-doc.fiiish.cn/mock/272/atlantis'
const url = `${mockUrl}/operations`

const operationRequest = new RESTful(url)

operationRequest.uploadJar = function uploadJar(item) {
  const formData = new FormData()
  formData.append('file', item.file)
  return request.post(`${url}/jar`, formData, {
    pureData: true
  })
}

export default operationRequest
