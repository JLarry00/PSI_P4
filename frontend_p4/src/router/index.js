import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import FaqView from '../views/FaqView.vue'
import PlayView from '../views/PlayView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/log-in', name: 'log-in', component: LoginView },
    { path: '/log-out', name: 'log-out', component: LogoutView },
    { path: '/songs/:id', name: 'song', component: PlayView, props: true },
    { path: '/faq', name: 'faq', component: FaqView },
  ]
})

export default router
