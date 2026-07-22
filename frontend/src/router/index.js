import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Login from '../views/Login.vue'
import Vehicles from '../views/Vehicles.vue'
import VehicleForm from '../views/VehicleForm.vue'
import VehicleDetail from '../views/VehicleDetail.vue'
import OwnerDetail from '../views/OwnerDetail.vue'
import Maintenances from '../views/Maintenances.vue'
import MaintenanceForm from '../views/MaintenanceForm.vue'
import Usuarios from '../views/Usuarios.vue'
import Documents from '../views/Documents.vue'
import Audit from '../views/Audit.vue'
import NotFound from '../views/NotFound.vue'


const routes = [
    {
        path: '/',
        redirect: '/vehicles'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/vehicles',
        name: 'Vehicles',
        component: Vehicles,
        meta: { requiresAuth: true }
    },
    {
        path: '/vehicles/new',
        name: 'VehicleForm',
        component: VehicleForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/vehicles/edit/:id',
        name: 'VehicleEdit',
        component: VehicleForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/vehicles/:id',
        name: 'VehicleDetail',
        component: VehicleDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/owners/:id',
        name: 'OwnerDetail',
        component: OwnerDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/maintenances',
        name: 'Maintenances',
        component: Maintenances,
        meta: { requiresAuth: true }
    },
    {
        path: '/maintenances/new',
        name: 'MaintenanceForm',
        component: MaintenanceForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/maintenances/edit/:id',
        name: 'MaintenanceEdit',
        component: MaintenanceForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/usuarios',
        name: 'Usuarios',
        component: Usuarios,
        meta: { requiresAuth: true }
    },
    {
        path: '/documents',
        name: 'Documents',
        component: Documents,
        meta: { requiresAuth: true }
    },
    {
        path: '/audit',
        name: 'Audit',
        component: Audit,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { requiresAuth: false }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const getHomeRoute = (user) => user?.rol === 'admin' ? '/usuarios' : '/vehicles'

router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const token = authStore.refreshTokenState()

    if (to.meta.requiresAuth && !token) {
        return '/login'
    }

    if (token && !authStore.user) {
        try {
            await authStore.getProfile()
        } catch (error) {
            authStore.logout()
            if (to.meta.requiresAuth) {
                return '/login'
            }
        }
    }

    if (to.path === '/login' && authStore.user) {
        return getHomeRoute(authStore.user)
    }

    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        return getHomeRoute(authStore.user)
    }
})

export default router
