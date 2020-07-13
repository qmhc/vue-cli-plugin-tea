import Axios from 'axios'

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

Axios.interceptors.response.use(response => {
  if (response.status !== 200) {
    return Promise.resolve({ status: 0 })
  }

  const data = response.data

  return Promise.resolve(data)
}, error => Promise.reject(error))
