/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import register from '../pages/register'
import login from '../pages/login'
import dashboard from '../pages/dashboard'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [
  { name: 'register',
    path: '/register',
    component: register,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requiresAuth) {
        // このルートはログインされているかどうか認証が必要です。
        // もしされていないならば、ログインページにリダイレクトします。
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            next({
              path: '/register',
            })
            console.log('user',user)
            console.log(next)
          } else {
            next()
          }
        })
      } else {
        next() // next() を常に呼び出すようにしてください!
      }
    },
  },
  { name: 'login',
    path: '/login',
    component: login,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requiresAuth) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            next({
              path: '/dashboard',
            })
            console.log('user',user)
            console.log(next)
          } else {
            next()
          }
        })
      } else {
        next() // next() を常に呼び出すようにしてください!
      }
    },
  },
  { name: 'dashboard',
    path: '/dashboard',
    component: dashboard,
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requiresAuth) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            next()
            // console.log('user',user)
            // console.log(next)
          } else {
            next({
              path: '/login',
            })
          }
        })
      } else {
        next() // next() を常に呼び出すようにしてください!
      }
    },
   }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   if (requiresAuth) {
//     // このルートはログインされているかどうか認証が必要です。
//     // もしされていないならば、ログインページにリダイレクトします。
//     firebase.auth().onAuthStateChanged(function (user) {
//       if (user) {
//         next()
//         console.log('user',user)
//         console.log(next)
//       } else {
//         next({
//           path: '/login',
//         })
//       }
//     })
//   } else {
//     next() // next() を常に呼び出すようにしてください!
//   }
// })

export default router
