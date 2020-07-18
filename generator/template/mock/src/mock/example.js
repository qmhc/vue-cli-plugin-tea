<%_ if (useTypeScript) { _%>
import { mock, Random } from 'mockjs'
import { API_BASE_URL } from '../service'

mock(API_BASE_URL + '/example', {
  status: 1,
  message: 'ok',
  'data|5-10': [{
    'id:+1': 1,
    name: () => Random.name(),
    'sex|1': ['male', 'female'],
    age: () => Random.integer(20, 60)
  }]
})
<%_ } else { _%>
import Mockjs from 'mockjs'
import { API_BASE_URL } from '../service'

const Random = Mockjs.Random

Mockjs.mock(API_BASE_URL + '/person', {
  status: 1,
  message: 'ok',
  'data|5-10': [{
    'id:+1': 1,
    name: () => Random.name(),
    'sex|1': ['male', 'female'],
    age: () => Random.integer(20, 60)
  }]
})
<%_ } _%>
