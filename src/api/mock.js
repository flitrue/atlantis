import { RESTful } from '@/utils/request'

// const mockUrl = 'http://api-doc.fiiish.cn/mock/272/atlantis'
const mockUrl = ''
const baseUri = `${mockUrl}/mock/base`

export default new RESTful(baseUri)
