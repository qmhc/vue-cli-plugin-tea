<%_ if (useTypeScript) { _%>
import Axios, { AxiosRequestConfig }  from 'axios'

export interface Result<T> {
  status: 0 | 1,
  message: string,
  data: T
}
<%_ } else { _%>
import Axios from 'axios'
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

const pendingMap = new Map()

<%_ if (useTypeScript) { _%>
function removePending(config: AxiosRequestConfig): void {
<%_ } else { _%>
function removePending(config) {
<%_ } _%>
  const token = `${config.method}:${config.url}`
  const canceler = pendingMap.get(token)

  if (typeof canceler === 'function') {
    canceler()
    pendingMap.delete(token)
  }
}

Axios.defaults.baseURL = API_BASE_URL
Axios.defaults.withCredentials = true

Axios.interceptors.request.use(
  config => {
    removePending(config)

    const token = `${config.method}:${config.url}`

    config.cancelToken = new Axios.CancelToken(canceler => {
      pendingMap.set(token, canceler)
    })

    return config
  },
  error => Promise.reject(error)
)

Axios.interceptors.response.use(
  response => {
    removePending(response.config)

    if (response.status !== 200) {
      return Promise.resolve({ status: 0 })
    }

    const data = response.data

    return Promise.resolve(data)
  },
  error => Promise.reject(error)
)

<%_ if (useTypeScript) { _%>
export function parseResult<T>(
  result: Result<T>,
  defaultValue: T,
  callback?: (data: T) => T
): T {
<%_ } else { _%>
export function parseResult(result, defaultValue, callback) {
<%_ } _%>
  if (result.status) {
    if (typeof callback === 'function') {
      return callback(result.data)
    }

    return result.data
  }

  return defaultValue
}
