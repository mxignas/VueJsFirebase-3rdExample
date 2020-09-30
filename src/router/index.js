import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/Home/GMap'
import Signup from '@/components/auth/Signup' 
import Login from '@/components/auth/Login'
import ViewProfile from '@/components/profile/ViewProfile'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  
  routes: [
    {
      path: '/',
      name: 'GMap',
      component: GMap,
      // requiring this route to require auth to enter
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// route guard. It calls a functions before enter each route

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)) { // look where we going to -> match and check if it requires auth
    // check auth state of user
    let user = firebase.auth().currentUser
    if(user) {
      // user signed in, proceed to route
      next() // next route
    } else {
      // no user is signed in, redirect to login
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router