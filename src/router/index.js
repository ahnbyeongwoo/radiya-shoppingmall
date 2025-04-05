import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import UserLogin from '../components/UserLogin.vue';
import SignUp from '../components/SignUp.vue'
import TopPage from '../views/TopPage.vue'
import BottomsPage from '../views/BottomsPage.vue'
import ShoesPage from '../views/ShoesPage.vue'
import BagPage from '../views/BagPage.vue'
const routes = [
  {
    path: '/',
    name: 'Main',
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
];

const router = createRouter({
  history: createWebHistory(process.env.Base_URL),
  routes,
});

export default router;