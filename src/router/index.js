// /src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import store from '../store'; // Importando o store

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import('../views/FavoriteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('../views/CategoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/AccountView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/product',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/newaccount',
    name: 'newaccount',
    component: () => import('../views/NewAccountView.vue'),
  },
  {
    path: '/personaldata',
    name: 'personaldata',
    component: () => import('../views/PersonalDataView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('../views/AddressView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/newaddress',
    name: 'newaddress',
    component: () => import('../views/NewAddressView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/editaddress',
    name: 'editaddress',
    component: () => import('../views/EditAddressView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/newshopping',
    name: 'newshopping',
    component: () => import('../views/NewShoppingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/OrderView.vue'),
    meta: { requiresAuth: true }
  }

];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  store.dispatch('checkLogin');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
