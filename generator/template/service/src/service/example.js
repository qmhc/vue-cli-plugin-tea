import Axios from 'axios'

export function queryExample()<%- useTypeScript ? ': Promise<any>' : '' %> {
  return Axios.get('/example').then(result => {
    if (result.status) {
      return result.data
    }

    return []
  })
}
