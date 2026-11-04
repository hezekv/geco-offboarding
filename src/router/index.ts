import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Inline placeholder for modules outside MVP scope (Contacts, Performance).
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

// Role-aware landing page
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
    meta: { roles: ['super_admin', 'hrbp'] },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },

      // Consultants module
      {
        path: 'consultants',
        name: 'consultants',
        component: () => import('@/views/consultants/ConsultantList.vue'),
      },
      {
        path: 'consultants/:id',
        name: 'consultant-detail',
        component: () => import('@/views/consultants/ConsultantDetail.vue'),
      },

      // Outside MVP scope
      { path: 'contacts', name: 'contacts', component: PlaceholderView },
      { path: 'performance', name: 'performance', component: PlaceholderView },

      // ✅ Configurations (Separated)
      {
        path: 'offboarding-config',
        name: 'offboarding-config',
        component: () => import('@/views/config/ConfigList.vue'),
      },
      {
        path: 'onboarding-config',
        name: 'onboarding-config',
        component: () => import('@/views/config/OnboardingConfigList.vue'),
      },

      // ✅ Offboarding Employees
      {
        path: 'offboarding-employees',
        name: 'offboarding-employees',
        component: () => import('@/views/offboarding/OffboardingList.vue'),
      },
      {
        path: 'offboarding-employees/:id',
        name: 'offboarding-profile',
        component: () => import('@/views/offboarding/OffboardingProfile.vue'),
      },

      // ✅ PHASE 2: Onboarding Records
      {
        path: 'onboarding-records',
        name: 'onboarding-records',
        component: () => import('@/views/onboarding/OnboardingList.vue'),
      },
      {
        path: 'onboarding-records/:id',
        name: 'onboarding-profile',
        component: () => import('@/views/onboarding/OnboardingProfile.vue'),
      },
    ],
  },

  // ----- Consultant portal shell -----
  {
    path: '/portal',
    component: () => import('@/layouts/ConsultantLayout.vue'),
    meta: { roles: ['consultant'] },
    children: [
      { path: '', redirect: '/portal/checklist' },
      {
        path: 'checklist',
        name: 'portal-checklist',
        component: () => import('@/views/portal/ConsultantChecklist.vue'),
      },
      // ✅ PHASE 2: Consultant Onboarding Checklist
      {
        path: 'onboarding',
        name: 'portal-onboarding',
        component: () => import('@/views/portal/ConsultantOnboarding.vue'),
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

// ----- Auth & Role guard (reload-safe) -----
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Wait for session + profile BEFORE any guard decision (kills the F5 race)
  await auth.init()

  // 1. Public routes
  if (to.meta.public) {
    if (auth.user && to.name === 'login') return { path: homeFor(auth.role) }
    return true
  }

  // 2. Not signed in
  if (!auth.user) return { path: '/login' }

  // 3. Session exists but profile row missing → clean sign-out instead of a loop
  if (!auth.role) {
    await auth.signOut()
    return { path: '/login' }
  }

  // 4. Role-based access control (with loop breaker)
  const allowedRoles = to.meta.roles as string[] | undefined
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    const home = homeFor(auth.role)
    return to.path === home ? true : { path: home }
  }

  return true
})

export default router