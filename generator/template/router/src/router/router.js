import Vue from 'vue'
import VueRouter<%- useTypeScript ? ', { RouteConfig }' : '' %> from 'vue-router'
import Homepage from '../views/homepage.vue'

Vue.use(VueRouter)

const routes<%- useTypeScript ? ': Array<RouteConfig>' : '' %> = [
  {
    path: '/',
    name: 'example',
    component: Homepage,
    props: true
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
