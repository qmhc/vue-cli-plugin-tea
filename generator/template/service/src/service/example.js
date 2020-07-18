import Axios from 'axios'
<%_ if (useTypeScript) { _%>
import { Result } from './index'

export interface Example {
  id: number
  name: string
  sex: 'male' | 'female'
  age: number
}
<%_ } _%>

export async function queryExamples()<%- useTypeScript ? ': Promise<Example[]>' : '' %> {
  const result = await Axios.get<%- useTypeScript ? ': <Result<Example[]>>' : '' %>('/example')
  
  if (result.status) {
    return result.data
  }

  return []
}
