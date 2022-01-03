import Vue from 'vue'
import VueRouter from 'vue-router'
import map from '../views/map.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Map',
    component: map
  },
]

const router = new VueRouter({
  routes
})

export default router
