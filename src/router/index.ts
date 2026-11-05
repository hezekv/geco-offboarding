import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'
import ConsultantLayout from '@/layouts/ConsultantLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
      meta: { requiresGuest: true },
    },
    // ===== HR Shell (AppLayout) =====
    {
      path: "/",
      component: AppLayout,
      meta: { requiresAuth: true, role: "hr" },
      children: [
        { path: "", redirect: "/dashboard" },
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/Dashboard.vue"),
        },
        {
          path: "consultants",
          name: "consultants",
          component: () => import("@/views/consultants/ConsultantList.vue"),
        },
        {
          path: "consultants/:id",
          name: "consultant-detail",
          component: () => import("@/views/consultants/ConsultantDetail.vue"),
        },
        // ✅ REMOVED: contacts and performance routes
        // Configurations
        {
          path: "offboarding-config",
          name: "offboarding-config",
          component: () => import("@/views/config/ConfigList.vue"),
        },
        {
          path: "onboarding-config",
          name: "onboarding-config",
          component: () => import("@/views/config/OnboardingConfigList.vue"),
        },
        // Employees / Records
        {
          path: "offboarding-employees",
          name: "offboarding-employees",
          component: () => import("@/views/offboarding/OffboardingList.vue"),
        },
        {
          path: "offboarding-employees/:id",
          name: "offboarding-profile",
          component: () => import("@/views/offboarding/OffboardingProfile.vue"),
        },
        {
          path: "onboarding-records",
          name: "onboarding-records",
          component: () => import("@/views/onboarding/OnboardingList.vue"),
        },
        {
          path: "onboarding-records/:id",
          name: "onboarding-profile",
          component: () => import("@/views/onboarding/OnboardingProfile.vue"),
        },
        // Phase 3: Assets & Access
        {
          path: "assets-access",
          name: "assets-access",
          component: () => import("@/views/assets/AssetsAccess.vue"),
        },
        // Phase 4: Time & Leave (HR)
        {
          path: "time-leave",
          name: "time-leave",
          component: () => import("@/views/time-leave/TimeLeave.vue"),
        },
      ],
    },
    // ===== Consultant Portal Shell (ConsultantLayout) =====
    {
      path: "/portal",
      component: ConsultantLayout,
      meta: { requiresAuth: true, role: "consultant" },
      children: [
        { path: "", redirect: "/portal/checklist" },
        {
          path: "checklist",
          name: "portal-checklist",
          component: () => import("@/views/portal/ConsultantChecklist.vue"),
        },
        {
          path: "onboarding",
          name: "portal-onboarding",
          component: () => import("@/views/portal/ConsultantOnboarding.vue"),
        },
        {
          path: "timesheets",
          name: "portal-timesheets",
          component: () => import("@/views/portal/ConsultantTimesheets.vue"),
        },
      ],
    },
    // ===== Style Guide / Design System =====
    {
      path: "/styleguide",
      component: () => import("@/views/styleguide/StyleguideLayout.vue"),
      children: [
        {
          path: "",
          name: "styleguide",
          component: () => import("@/views/styleguide/StyleguideDocs.vue"),
        },
      ],
    },
    // ===== Public Marketing Landing Page =====
    {
      path: "/landing",
      name: "landing",
      component: () => import("@/views/Landing.vue"),
    },
    // Catch-all
    {
      path: "/:pathMatch(.*)*",
      redirect: "/dashboard",
    },
  ],
});

// Loop-proof navigation guard
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const isLoggedIn = !!auth.user
  const isConsultant = auth.role === 'consultant'

  if (to.meta.requiresGuest) {
    if (isLoggedIn) return next(isConsultant ? '/portal' : '/dashboard')
    return next()
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  if (to.meta.role === 'consultant' && !isConsultant) {
    return next('/dashboard')
  }
  if (to.meta.role === 'hr' && isConsultant) {
    return next('/portal')
  }

  return next()
})

export default router