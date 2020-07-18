import Axios from 'axios'

<%_ if (useTypeScript) { _%>
export interface Result<T> {
  status: 0 | 1
  message: string
  data: T
}
<%_ } _%>

let address

if (process.env.NODE_ENV === 'development') {
  const PROTOCOL = 'http:'
  const HOST = 'localhost'
  const PORT = '80'

  address = `${PROTOCOL}//${HOST}:${PORT}`
} else {
  address = ''
}

export const API_BASE_URL = address

Axios.defaults.baseURL = API_BASE_URL
Axios.defaults.withCredentials = true

Axios.interceptors.response.use(response => {
  if (response.status !== 200) {
    return Promise.resolve({ status: 0 })
  }

  const data = response.data

  return Promise.resolve(data)
}, error => Promise.reject(error))
