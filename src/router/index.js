import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// LAYOUT
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
  import layoutMain from '../layouts/master'
  import layoutAuth from '../layouts/authorization'
  import layoutLogout from '../layouts/logout'

// pages
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------

import pageList from '../pages/list'
import pageCard from '../pages/card'
import retouchUploadPage from '../pages/retouch/upload'

import pageCardList from '../pages/v1/card-list'
import pageCardEdit from '../pages/v1/card-edit'
import pageAddNewCard from '../pages/v1/add-new-card'
import pageImageShow from '../pages/v1/image-show'
import pageImageHistory from '../pages/v1/image-history'
import pageSettings from '../pages/v1/s'
import pageUploadRetouch from '../pages/v1/uploadRetouch'
import pagePerspective from '../pages/v1/perspective'

import pageRreferenceBook from '../pages/build-1/referenceBook'
import pageRreferenceBookUsers from '../pages/build-1/referenceBook/users'
import pageRreferenceBookRoles from '../pages/build-1/referenceBook/roles'

// router
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------

import store from '../store'

const ifNotAuth = (to, from, next) => {
  if (!store.getters['auth/isAuthenticated']) { next(); return; }
  next('/')
}

const ifAuth = (to, from, next) => {
  if (store.getters['auth/isAuthenticated']) { next(); return; }
  next('/auth')
}

// router.beforeEach((to, from, next) => {
//   if (to.meta.auth && userNotLoggedIn) {
//     next('/login')
//   }
//   else {
//     next()
//   }
// })

export default new Router({
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: layoutAuth
    },
    {
      path: '/logout',
      name: 'logout',
      component: layoutLogout
    },
    {
      path: '/',
      name: 'main',
      component: layoutMain,
      beforeEnter: ifAuth,
      children: [
        { name: 'card-list', path: 'card-list', component: pageCardList},
        { name: 'card-edit', path: 'card-edit/:id', component: pageCardEdit},
        { name: 'add-new-card', path: 'add-new-card', component: pageAddNewCard},
        { name: 'image-show', path: 'image-show/:id', component: pageImageShow},
        { name: 'image-history', path: 'image-history/:id', component: pageImageHistory},
        { name: 'settings', path: 'settings', component: pageSettings},
        { name: 'uploadRetouch', path: 'uploadRetouch', component: pageUploadRetouch},
        { name: 'perspective', path: 'perspective/:id', component: pagePerspective},
        {
          name: 'referenceBook',
          path: 'reference-book',
          component: pageRreferenceBook,
          children: [
            { name: 'referenceBookUsers', path: 'users', component: pageRreferenceBookUsers },
            { name: 'referenceBookRoles', path: 'roles', component: pageRreferenceBookRoles },
          ]
        }
      ]
    }
  ]
})
