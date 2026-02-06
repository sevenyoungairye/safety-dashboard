import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/AdminDashboard.vue') // 你的主页面
  },
  {
    path: '/sd',
    name: 'SafetyDashboard',
    component: () => import('../views/SafetyDashboard.vue') // 你的后台管理页
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导出实例，这样你就可以在其他 JS 文件中 import router 来跳转了
export default router




// import { createRouter, createWebHistory } from 'vue-router'

// const routes = [
//   {
//     path: '/',
//     name: 'Dashboard',
//     component: () => import('../views/AdminDashboard.vue') // 你的主页面
//   },
//   {
//     path: '/sd',
//     name: 'SafetyDashboard',
//     component: () => import('../views/SafetyDashboard.vue') // 你的后台管理页
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// // 导出实例，这样你就可以在其他 JS 文件中 import router 来跳转了
// export default router