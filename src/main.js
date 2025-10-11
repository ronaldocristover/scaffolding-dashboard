import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import pages
import Login from './pages/Login.vue'
import ForgotPassword from './pages/ForgotPassword.vue'
import Dashboard from './pages/Dashboard.vue'
import ContentManagement from './pages/ContentManagement.vue'
import EditContent from './pages/EditContent.vue'
import Profile from './pages/Profile.vue'

// Create Pinia store
const pinia = createPinia()

// Create router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/forgot-password',
            name: 'ForgotPassword',
            component: ForgotPassword
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/content',
            name: 'ContentManagement',
            component: ContentManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/content/edit',
            name: 'CreateContent',
            component: EditContent,
            meta: { requiresAuth: true }
        },
        {
            path: '/content/edit/:id',
            name: 'EditContent',
            component: EditContent,
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            meta: { requiresAuth: true }
        }
    ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
