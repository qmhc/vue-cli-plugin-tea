<%_ if (useAxios) { _%>
import Axios from 'axios'
<%_ } _%>

let address

if (process.env.NODE_ENV === 'development') {
  const PROTOCOL = 'http:'
  const HOST = 'localhost'
  const PORT = '80'

  address = `${PROTOCOL}//${HOST}:${PORT}`
} else {
  address = '/'
}

export const API_BASE_URL = address

<%_ if (useAxios) { _%>
Axios.defaults.baseURL = API_BASE_URL
<%_ } _%>
