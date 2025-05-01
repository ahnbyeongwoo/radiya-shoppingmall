import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import UserLogin from '../components/UserLogin.vue';
import SignUp from '../components/SignUp.vue'
import MenPage from '../views/MenPage.vue'
import WomenPage from '../views/WomenPage.vue'
import JeweleryPage from '../views/JeweleryPage.vue'
import ElectronicsPage from '../views/ElectronicsPage.vue'
import AllProducts from '../views/AllProducts.vue';
import CartPage from '../components/CartPage.vue';
import LikePage from '../components/LikePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  { path: '//men', component: MenPage },
  { path: '/women', component: WomenPage },
  { path: '/jewelery', component: JeweleryPage },
  { path: '/electronics', component: ElectronicsPage },
  
  { path: '/products', 
    name: 'AllProducts', 
    component: AllProducts,
  },
  {
    path: '/productdetail',
    name: 'ProductDetail',
    component: () => import('@/components/ProductDetail.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
  },
  {
    path: '/like',
    name: 'Like',
    component: LikePage,
  }
];


const router = createRouter({
  history: createWebHistory(),  // Vue 3에서 사용하는 방식
  routes
});

export default router;