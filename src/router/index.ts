import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/LoginView.vue'
import Dashboard from '@/views/DashboardView.vue'
import Details from '@/views/DetailsView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: Details,
  },
  {
    path: '/',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('isAuth') === 'true'

  if (to.path !== '/login' && !isAuth) {
    next('/login')
  } else if (to.path === '/login' && isAuth) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
