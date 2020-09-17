import Axios from 'axios'
<%_ if (useTypeScript) { _%>
import { Result, parseResult } from './index'

export interface Example {
  id: number,
  name: string,
  sex: 'male' | 'female',
  age: number
}
<%_ } else { _%>
import { parseResult } from './index'
<%_ } _%>

export async function queryExamples()<%- useTypeScript ? ': Promise<Example[]>' : '' %> {
  return parseResult(await Axios.get<%- useTypeScript ? '<Result<Example[]>>' : '' %>('/example'), [])
}
