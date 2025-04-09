import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import UserLogin from '../components/UserLogin.vue';
import SignUp from '../components/SignUp.vue'
import TopPage from '../views/TopPage.vue'
import BottomsPage from '../views/BottomsPage.vue'
import ShoesPage from '../views/ShoesPage.vue'
import BagPage from '../views/BagPage.vue'
import AllProducts from '../views/AllProducts.vue';

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
  { path: '/top', component: TopPage },
  { path: '/bottoms', component: BottomsPage },
  { path: '/shoes', component: ShoesPage },
  { path: '/bag', component: BagPage },
  
  { path: '/products', 
    name: 'ProductPage', 
    component: AllProducts 
  },
];


const router = createRouter({
  history: createWebHistory(),  // Vue 3에서 사용하는 방식
  routes
});

export default router;