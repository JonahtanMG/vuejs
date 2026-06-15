import { createRouter, createWebHistory } from 'vue-router'
import ConstanciaView from '../views/ConstanciaView.vue'

const routes = [
  {
    path: '/constancia/:cui',
    name: 'constancia',
    component: ConstanciaView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router