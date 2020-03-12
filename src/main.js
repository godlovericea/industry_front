import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import './assets/styles/reset.css'
// import './assets/styles/myapp.css'
// import './element-variables.scss'
// import './assets/styles/element-variables.scss'
Vue.use(Element)

import Vant from 'vant';
import 'vant/lib/index.css';

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
// Vue.material.theme.register('default', {
//   primary: 'cyan',
//   accent: 'pink'
// })
Vue.use(VueMaterial)

// import 'babel-polyfill'



Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
