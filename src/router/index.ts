import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { supabase } from '@/lib/supabase'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      { path: '', redirect: '/offboarding-employees' },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'consultants', name: 'consultants', component: () => import('@/views/Placeholder.vue'), props: { title: 'Consultants Directory' } },
      { path: 'contacts', name: 'contacts', component: () => import('@/views/Placeholder.vue'), props: { title: 'Contacts' } },
      { path: 'performance', name: 'performance', component: () => import('@/views/Placeholder.vue'), props: { title: 'Performance' } },
      {
        path: 'offboarding-config',
        name: 'offboarding-config',
        component: () => import('@/views/config/ConfigList.vue'),
      },
      {
        path: 'offboarding-config/new',
        name: 'offboarding-config-new',
        component: () => import('@/views/config/ConfigEditor.vue'),
      },
      {
        path: 'offboarding-config/:id/edit',
        name: 'offboarding-config-edit',
        component: () => import('@/views/config/ConfigEditor.vue'),
        props: true,
      },
      {
        path: 'offboarding-employees',
        name: 'offboarding-employees',
        component: () => import('@/views/offboarding/OffboardingList.vue'),
      },
      {
        path: 'offboarding-employees/new',
        name: 'offboarding-new',
        component: () => import('@/views/offboarding/OffboardingCreate.vue'),
        props: { isNew: true },
      },
      {
        path: 'offboarding-employees/:id',
        name: 'offboarding-profile',
        component: () => import('@/views/offboarding/OffboardingProfile.vue'),
        props: true,
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/offboarding-employees' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Auth guard
router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session && to.meta.public !== true) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router