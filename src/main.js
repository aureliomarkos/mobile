import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker'
import router from './router'
import store from './store';
import '../src/assets/styles/global.css'; // Importa o CSS global

// PrimeVue
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/saga-blue/theme.css'; // Escolha o tema que preferir
import 'primevue/resources/primevue.min.css'; // Estilos básicos PrimeVue
import 'primeicons/primeicons.css'; // PrimeIcons

const app = createApp(App);
app.use(store)
app.use(router)
app.use(PrimeVue);
app.use(ToastService)
app.mount('#app');