import Vue from 'vue'
import Router from 'vue-router'

import dashboard from '../views/dashboard'
import jurong from '../views/jurong'
import fiveg from '../views/fiveg'
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
    },
    {
      path: '/fiveg',
      name: 'fiveg',
      component: fiveg
    }
  ]
}
)
