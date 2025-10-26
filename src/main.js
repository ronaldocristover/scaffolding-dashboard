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
import CompanyInfoManagement from './pages/CompanyInfoManagement.vue'
import BannerManagement from './pages/BannerManagement.vue'
import AboutCompanyManagement from './pages/AboutCompanyManagement.vue'
import QuotePriceManagement from './pages/QuotePriceManagement.vue'
import ContactInfoManagement from './pages/ContactInfoManagement.vue'
import BaseInfoManagement from './pages/BaseInfoManagement.vue'

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
        },
        {
            path: '/company-info',
            name: 'CompanyInfoManagement',
            component: CompanyInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/company-info/create',
            name: 'CreateCompanyInfo',
            component: CompanyInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/company-info/edit/:id',
            name: 'EditCompanyInfo',
            component: CompanyInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/banner',
            name: 'BannerManagement',
            component: BannerManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/banner/create',
            name: 'CreateBanner',
            component: BannerManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/banner/edit/:id',
            name: 'EditBanner',
            component: BannerManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/about-company',
            name: 'AboutCompanyManagement',
            component: AboutCompanyManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/about-company/create',
            name: 'CreateAboutCompany',
            component: AboutCompanyManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/about-company/edit/:id',
            name: 'EditAboutCompany',
            component: AboutCompanyManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/quote-price',
            name: 'QuotePriceManagement',
            component: QuotePriceManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/quote-price/create',
            name: 'CreateQuotePrice',
            component: QuotePriceManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/quote-price/edit/:id',
            name: 'EditQuotePrice',
            component: QuotePriceManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/contact-info',
            name: 'ContactInfoManagement',
            component: ContactInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/contact-info/create',
            name: 'CreateContactInfo',
            component: ContactInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/contact-info/edit/:id',
            name: 'EditContactInfo',
            component: ContactInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/base-info',
            name: 'BaseInfoManagement',
            component: BaseInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/base-info/create',
            name: 'CreateBaseInfo',
            component: BaseInfoManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/base-info/edit/:id',
            name: 'EditBaseInfo',
            component: BaseInfoManagement,
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
