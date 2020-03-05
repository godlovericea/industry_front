import Vue from 'vue'
import Router from 'vue-router'

import dashboard from '../views/dashboard'
import jurong from '../views/jurong'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard
    },
    {
      path: '/jurong',
      name: 'jurong',
      component: jurong
    }
  ]
}
)
