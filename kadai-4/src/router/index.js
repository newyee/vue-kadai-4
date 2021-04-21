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
    beforeEnter: (to, from, next) => {
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requiresAuth) {
        // このルートはログインされているかどうか認証が必要です。
        // もしされていないならば、ログインページにリダイレクトします。
        try {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              console.log('ログイン状態の取得')
              user = user ? user : {}
              let loginFlag = false
              const db = firebase.firestore()
              console.log('データベース情報取得')
              if (user.uid){
                commit('setUserUid', user.uid)
                console.log('ユーザーIDの保存')
                loginFlag = true
                db
                .collection('user-data')
                .doc(user.uid)
                .get()
                .then(doc => {
                  const userName = doc.data().userName
                  const wallet = doc.data().wallet
                  const payload = {
                    userName: userName,
                    wallet: wallet,
                    loggedIn:true
                  }
                  commit('saveUserData', payload)
                  console.log('ユーザー情報保存')
                })
                .catch(error => {
                  console.log('エラー',error)
                })
              }
              next({
                path: '/dashboard',
              })
              // console.log('user',user)
              // console.log(next)
            } else {
              next()
            }
          })
        } catch (error) {
          console.log(error)
        }
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
        try {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              console.log('ログイン状態の取得')
              user = user ? user : {}
              let loginFlag = false
              const db = firebase.firestore()
              console.log('データベース情報取得')
              if (user.uid){
                store.commit('setUserUid', user.uid)
                console.log('ユーザーIDの保存')
                loginFlag = true
                db
                .collection('user-data')
                .doc(user.uid)
                .get()
                .then(doc => {
                  const userName = doc.data().userName
                  const wallet = doc.data().wallet
                  const payload = {
                    userName: userName,
                    wallet: wallet,
                    loggedIn:true
                  }
                  store.commit('saveUserData', payload)
                  console.log('ユーザー情報保存')
                })
                .catch(error => {
                  console.log('エラー',error)
                })
              }
              next({
                path: '/dashboard',
              })
              // console.log('user',user)
              // console.log(next)
            } else {
              next()
            }
          })
        } catch (error) {
          console.log(error)
        }
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
      console.log('to',to)
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requiresAuth) {
        try {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              console.log('ログイン状態の取得')
              user = user ? user : {}
              let loginFlag = false
              const db = firebase.firestore()
              console.log('データベース情報取得')
              if (user.uid){
                store.commit('setUserUid', user.uid)
                console.log('ユーザーIDの保存')
                loginFlag = true
                db
                .collection('user-data')
                .doc(user.uid)
                .get()
                .then(doc => {
                  const userName = doc.data().userName
                  const wallet = doc.data().wallet
                  const payload = {
                    userName: userName,
                    wallet: wallet,
                    loggedIn:true
                  }
                  store.commit('saveUserData', payload)
                  console.log('ユーザー情報保存')
                })
                .catch(error => {
                  console.log('エラー',error)
                })
              }
              next()
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
