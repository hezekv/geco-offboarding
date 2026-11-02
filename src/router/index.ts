import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Inline placeholder for modules outside MVP scope (Consultants, Contacts, Performance).
// If you already have stub view files for these, you can swap this back to lazy imports.
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

const routes: RouteRecordRaw[] = [
  // ----- Public -----
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },

  // ----- Authenticated shell -----
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      // ✅ FIX 2a: root path now lands on the Dashboard (was /offboarding-employees)
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
      // Legacy: creation & editing now happen inside RequirementModal.
      // These two routes (and ConfigEditor.vue) can be removed in a cleanup pass.
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

  // Fallback: unknown paths redirect to Dashboard (guard bounces to /login if unauthenticated)
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// ----- Auth guard -----
router.beforeEach((to) => {
  const auth = useAuthStore()
  const isPublic = to.meta.public === true

  // Unauthenticated users may only access public routes (login)
  if (!auth.user && !isPublic) {
    return { path: '/login' }
  }

  // ✅ FIX 2b: authenticated users visiting /login go straight to the Dashboard
  if (auth.user && to.name === 'login') {
    return { path: '/dashboard' }
  }

  return true
})

export default router