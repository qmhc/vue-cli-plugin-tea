import Vue from 'vue'
import VueRouter<%- useTypeScript ? ', { RouteConfig }' : '' %> from 'vue-router'
import Homepage from '../views/homepage.vue'

Vue.use(VueRouter)

const routes<%- useTypeScript ? ': Array<RouteConfig>' : '' %> = [
  {
    path: '/',
    name: 'Homepage',
    component: Homepage,
    props: true
  }
]

const router = new VueRouter({
  <%_ if (routerHistoryMode) { _%>
  mode: 'history',
  base: process.env.BASE_URL,
  <%_ } _%>
  routes
})

export default router
