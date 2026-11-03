import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

// ✅ EMERGENCY PATH-PROOF LOADING
// 1) Load every CSS file under src/ EXCEPT Vite's demo style.css
//    (the demo file is what causes the dark background + centered raw text).
import.meta.glob(['./**/*.css', '!./style.css'], { eager: true })

// 2) Find AppIcon.vue wherever it lives in src/ and register it globally.
const appIconModules = import.meta.glob('./**/AppIcon.vue', { eager: true }) as Record<string, any>
const AppIcon = Object.values(appIconModules)[0]?.default

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  // ✅ RESTORED: global <AppIcon name="..." /> used across all views
  if (AppIcon) app.component('AppIcon', AppIcon)

  // Resolve the auth session BEFORE the router's first navigation (reload fix)
  const auth = useAuthStore(pinia)
  await auth.init()

  app.use(router)
  await router.isReady()
  app.mount('#app')
}

bootstrap()