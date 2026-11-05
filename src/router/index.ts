import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'
import ConsultantLayout from '@/layouts/ConsultantLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true },
    },
    // ===== HR Shell (AppLayout) =====
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true, role: 'hr' },
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
        },
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
        {
          path: 'contacts',
          name: 'contacts',
          component: () => import('@/views/Placeholder.vue'),
          props: { title: 'Contacts' },
        },
        {
          path: 'performance',
          name: 'performance',
          component: () => import('@/views/Placeholder.vue'),
          props: { title: 'Performance' },
        },
        // Configurations
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
        // Employees / Records
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
        // ✅ PHASE 3: Assets & Access
        {
          path: 'assets-access',
          name: 'assets-access',
          component: () => import('@/views/assets/AssetsAccess.vue'),
        },
      ],
    },
    // ===== Consultant Portal Shell (ConsultantLayout) =====
    {
      path: '/portal',
      component: ConsultantLayout,
      meta: { requiresAuth: true, role: 'consultant' },
      children: [
        { path: '', redirect: '/portal/checklist' },
        {
          path: 'checklist',
          name: 'portal-checklist',
          component: () => import('@/views/portal/ConsultantChecklist.vue'),
        },
        {
          path: 'onboarding',
          name: 'portal-onboarding',
          component: () => import('@/views/portal/ConsultantOnboarding.vue'),
        },
      ],
    },
    // Catch-all
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

// ✅ FIXED GUARD: loop-proof role handling
// Any role that is NOT 'consultant' is treated as HR staff (admin, super_admin, hrbp, manager…).
// Redirects always terminate because the target route passes the same checks.
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const isLoggedIn = !!auth.user
  const isConsultant = auth.role === 'consultant'

  // 1) Guest-only pages (e.g. /login)
  if (to.meta.requiresGuest) {
    if (isLoggedIn) return next(isConsultant ? '/portal' : '/dashboard')
    return next()
  }

  // 2) Auth-required pages
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // 3) Role-restricted areas — only bounce the "wrong side", never compare raw role strings
  if (to.meta.role === 'consultant' && !isConsultant) {
    return next('/dashboard') // HR staff don't belong in the portal
  }
  if (to.meta.role === 'hr' && isConsultant) {
    return next('/portal') // Consultants don't belong in the HR shell
  }

  // 4) Everything else passes (including undefined role while profile loads)
  return next()
})

export default router