/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import register from '../pages/register'
import login from '../pages/login'
import dashboard from '../pages/dashboard'
import firebase from 'firebase'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  { name: 'register',
    path: '/register',
    component: register,
    meta: { requiresAuth: true },
  },
  { name: 'login',
    path: '/login',
    component: login,
    meta: { requiresAuth: true },
  },
  { name: 'dashboard',
    path: '/dashboard',
    component: dashboard,
    props: true,
    meta: { requiresAuth: true },
   }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    try {
      firebase.auth().onAuthStateChanged(function (user) {
        console.log(user)
        if (user) {
          next({
            params: { user: user }
          })
          // next()
          // console.log('user',user)
          // console.log(next)
        } else {
          next({
            path: '/login',
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router
