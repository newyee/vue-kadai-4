import Vue from 'vue'
import VueRouter from 'vue-router'
import register from '../pages/register'
import login from '../pages/login'
import dashboard from '../pages/dashboard'
Vue.use(VueRouter)

const routes = [
  { name: 'register', path: '/register', component: register },
  { name: 'login', path: '/login', component: login },
  { name: 'dashboard', path: '/dashboard', component: dashboard, props: true }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
