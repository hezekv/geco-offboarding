import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import "./assets/main.css";

import AppIcon from "@/components/ui/AppIcon.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.component("AppIcon", AppIcon);

// Initialize auth before first render
const auth = useAuthStore();
auth.init().finally(() => app.mount("#app"));