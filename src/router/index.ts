import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Inline placeholder for modules outside MVP scope
const PlaceholderView = defineComponent({
  name: 'PlaceholderView',
  setup() {
    return () =>
      h(
        'div',
        {
          class:
            'rounded-[16px] border border-line bg-white px-8 py-16 text-center text-sm text-ink-3 shadow-sm',
        },
        'This module is outside the MVP scope and will be available in a future release.'
      )
  },
})

// Helper to determine the default landing page based on role
function homeFor(role: string | null) {
  return role === 'consultant' ? '/portal' : '/dashboard'
}

const routes: RouteRecordRaw[] = [
  // ----- Public -----
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },

  // ----- HR / Admin shell -----
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { roles: ['super_admin', 'hrbp'] }, // ← ADDED: Restrict to HR roles
    children: [
      { path: '', redirect: '/dashboard' },

      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },

      // Outside MVP scope
      { path: 'consultants', name: 'consultants', component: PlaceholderView },
      { path: 'contacts', name: 'contacts', component: PlaceholderView },
      { path: 'performance', name: 'performance', component: PlaceholderView },

      // Offboarding Configurations
      {
        path: 'offboarding-config',
        name: 'offboarding-config',
        component: () => import('@/views/config/ConfigList.vue'),
      },
      // Legacy routes (can be removed in cleanup)
      {
        path: 'offboarding-config/new',
        name: 'offboarding-config-new',
        component: () => import('@/views/config/ConfigEditor.vue'),
      },
      {
        path: 'offboarding-config/:id/edit',
        name: 'offboarding-config-edit',
        component: () => import('@/views/config/ConfigEditor.vue'),
      },

      // Offboarding Employees
      {
        path: 'offboarding-employees',
        name: 'offboarding-employees',
        component: () => import('@/views/offboarding/OffboardingList.vue'),
      },
      {
        path: 'offboarding-employees/new',
        name: 'offboarding-new',
        component: () => import('@/views/offboarding/OffboardingCreate.vue'),
      },
      {
        path: 'offboarding-employees/:id',
        name: 'offboarding-profile',
        component: () => import('@/views/offboarding/OffboardingProfile.vue'),
      },
    ],
  },

  // ----- Consultant portal shell -----
  {
    path: '/portal',
    component: () => import('@/layouts/ConsultantLayout.vue'),
    meta: { roles: ['consultant'] }, // ← ADDED: Restrict to consultant role
    children: [
      { path: '', redirect: '/portal/checklist' },
      {
        path: 'checklist',
        name: 'portal-checklist',
        component: () => import('@/views/portal/ConsultantChecklist.vue'),
      },
    ],
  },

  // Fallback: unknown paths redirect based on role
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// ----- Auth & Role guard -----
router.beforeEach((to) => {
  const auth = useAuthStore()

  // 1. Public routes (login)
  if (to.meta.public) {
    if (auth.user && to.name === 'login') {
      return { path: homeFor(auth.role) } // Bounce authenticated users to their correct home
    }
    return true
  }

  // 2. Unauthenticated users trying to access protected routes
  if (!auth.user) {
    return { path: '/login' }
  }

  // 3. Role-based access control
  const allowedRoles = to.meta.roles as string[] | undefined
  if (allowedRoles && (!auth.role || !allowedRoles.includes(auth.role))) {
    // User doesn't have the required role, send them to their appropriate home
    return { path: homeFor(auth.role) }
  }

  return true
})

export default router