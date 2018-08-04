import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/page/home'
import Login from '@/page/login'
import Goods from '@/page/goods'
import GoodsAdd from '@/page/goods/add'
import Category from '@/page/category/index'
import User from '@/page/user'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/goods',
          name: 'Goods',
          component: Goods
        },
        {
          path: '/goods/add',
          name: GoodsAdd,
          component: GoodsAdd
        },
        {
          path: '/category',
          name: 'Category',
          component: Category
        },
        {
          path: '/user',
          name: 'User',
          component: User
        }
      ]
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {
    if (store.state.token) { // 判断是否已登录get('token')
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router
