import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import SongView from '../views/SongView.vue'
import FaqView from '../views/FaqView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/log-in', name: 'log-in', component: LoginView },
    { path: '/log-out', name: 'log-out', component: LogoutView },
    { path: '/songs/:id', name: 'song', component: SongView, props: true },
    { path: '/faq', name: 'faq', component: FaqView },
  ]
})

export default router
