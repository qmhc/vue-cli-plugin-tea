import Axios from 'axios'
<%_ if (useTypeScript) { _%>
import { Result } from './index'

export interface Person {
  id: number
  name: string
  sex: 'male' | 'female'
  age: number
}
<%_ } _%>

export async function queryPersons()<%- useTypeScript ? ': Promise<Person[]>' : '' %> {
  const result = await Axios.get<%- useTypeScript ? ': <Result<Person[]>>' : '' %>('/person')
  
  if (result.status) {
    return result.data
  }

  return []
}
