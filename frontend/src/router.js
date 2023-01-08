import { createRouter, createWebHashHistory } from 'vue-router'

import home from './views/home.vue'
// import chat from './views/chat.vue'
// import reviewApp from './views/review-app.vue'
import loginSignup from './views/login-signup.vue'
import userDetails from './views/user-details.vue'
import boardList from './views/board-list.vue'
import boardDetails from './views/board-details.vue'
import taskDetails from './views/task-details.vue'
import groupList from './cmps/group-list.vue'
import map from './cmps/map.vue'
import dashboard from './cmps/dashboard.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/board',
    name: 'boards',
    component: boardList
  },
  {
    path: '/login',
    name: 'loginSignup',
    component: loginSignup
  },
  {
    path: '/user/:id',
    name: 'user-details',
    component: userDetails
  },
  {
    path: '/board/:id',
    name: 'board-details',
    component: boardDetails,
    children: [
      {
        path: '/board/:id',
        name: 'board',
        component: groupList,
        children: [
          {
            path: '/board/:id/:groupId/:taskId',
            name: 'board',
            component: groupList
          }
        ]
      },
      {
        path: '/board/:id/map',
        name: 'map',
        component: map
      },
      {
        path: '/board/:id/dashboard',
        name: 'dashboard',
        component: dashboard
      },
    ]
  },
  //   // {
  //   //   path: '/board/:id/:groupId/:taskId',
  //   //   name: 'task-details',
  //   //   component: boardDetails
  //   // },
]


export const router = createRouter({
  routes,
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

