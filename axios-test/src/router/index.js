import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cennik',
      name: 'cennik',
      component: () => import('../views/PriceListView.vue')
    },
    {
      path: '/repertuar',
      name: 'repertuar',
      component: () => import('../views/RepertoireView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/Dashboard/DashboardView.vue')
    },
    {
      path: '/admin/sale',
      name: 'adminSale',
      component: () => import('../views/admin/Rooms/RoomsView.vue')
    },
    {
      path: '/admin/sale/create',
      name: 'adminSaleCreate',
      component: () => import('../views/admin/Rooms/CreateRoomView.vue')
    },
    {
      path: '/admin/filmy',
      name: 'adminFilmy',
      component: () => import('../views/admin/Movies/MoviesView.vue')
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('../views/NotFoundView.vue'),
    },
  ]
})

export default router
