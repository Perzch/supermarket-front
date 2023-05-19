import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect:'/cashier',
      children: [
        {
          path: '/cashier',
          name: 'cashier',
          component: () => import('../views/Cashier.vue')
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('../views/Category.vue')
        },
        {
          path: '/product',
          name: 'product',
          component: () => import('../views/Product.vue')
        },
        {
          path: '/sale',
          name: 'sale',
          component: () => import('../views/Sale.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/Auth.vue')
    },
  ]
})

router.beforeEach((to,form):object|undefined => {
  if (
      // 检查用户是否已登录
      !localStorage.getItem('token') &&
      // ❗️ 避免无限重定向
      to.name !== 'auth'
  ) {
    // 将用户重定向到登录页面
    return { name: 'auth' }
  }
})

export default router
