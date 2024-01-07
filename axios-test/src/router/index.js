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
      path: '/repertuar/seans/:id',
      name: 'TicketQuantity',
      component: () => import('../views/Reservation/TicketQuantityView.vue')
    },
    {
      path: '/repertuar/:id',
      name: 'repertuarId',
      component: () => import('../views/MovieDetailsView.vue')
    },
    {
      path: '/kontakt',
      name: 'kontakt',
      component: () => import('../views/ContactView.vue')
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
      path: '/admin/sale/edit/:id',
      name: 'EditRoom',
      component: () => import('../views/admin/Rooms/EditRoomView.vue')
    },
    {
      path: '/admin/sale/edit',
      name: 'adminSaleEdit',
      component: () => import('../views/admin/Rooms/EditRoomView.vue')
    },
    {
      path: '/admin/filmy',
      name: 'adminFilmy',
      component: () => import('../views/admin/Movies/MoviesView.vue')
    },
    {
      path: '/admin/filmy/create',
      name: 'adminFilmyCreate',
      component: () => import('../views/admin/Movies/CreateMovieView.vue')
    },
    {
      path: '/admin/filmy/edit/:id',
      name: 'EditMovie',
      component: () => import('../views/admin/Movies/EditMovieView.vue')
    },
    {
      path: '/admin/filmy/edit',
      name: 'adminFilmyEdit',
      component: () => import('../views/admin/Movies/EditMovieView.vue')
    },
    {
      path: '/admin/cennik',
      name: 'adminCennik',
      component: () => import('../views/admin/PriceList/PricesView.vue')
    },
    {
      path: '/admin/cennik/edit/:id',
      name: 'EditTicket',
      component: () => import('../views/admin/PriceList/EditPriceView.vue')
    },
    {
      path: '/admin/seanse',
      name: 'adminSeanse',
      component: () => import('../views/admin/Screenings/ScreeningsView.vue')
    },
    {
      path: '/admin/seanse/create',
      name: 'adminSeanseCreate',
      component: () => import('../views/admin/Screenings/CreateScreeningView.vue')
    },
    {
      path: '/admin/seanse/edit',
      name: 'adminSeanseEdit',
      component: () => import('../views/admin/Screenings/EditScreeningView.vue')
    },
    {
      path: '/admin/seanse/edit/:id',
      name: 'EditScreening',
      component: () => import('../views/admin/Screenings/EditScreeningView.vue')
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('../views/NotFoundView.vue'),
    },
  ]
})

export default router
