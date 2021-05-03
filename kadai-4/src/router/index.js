/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import register from '../pages/register'
import login from '../pages/login'
import dashboard from '../pages/dashboard'
import firebase from 'firebase'
// import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  { name: 'register',
    path: '/register',
    component: register,
  },
  { name: 'login',
    path: '/login',
    component: login,
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
    firebase.auth().onAuthStateChanged(function (user) {
      console.log('呼び出し')
      if (user) {
        next()
        // next()
      } else {
        next({
          path: '/login',
        })
      }
    })
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router
