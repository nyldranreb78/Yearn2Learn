import { createApp } from "vue";
import { createPinia } from "pinia";
import { authentication } from "./plugins/authentication";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";
import "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.scss";
import "./assets/css/main.css";

const app = createApp(App);
// createApp(App).use(store).use(router).mount("#app");
const pinia = createPinia(); // Create Pinia instance
app.use(pinia);

authentication.install().then(() => {
  app.use(store);
  app.use(router);
  app.mount("#app");
});

// Provided by Boostrap documentation to use with the Popover dependency
// From https://getbootstrap.com/docs/5.3/components/popovers/
const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]',
);
//eslint-disable-next-line
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl),
);

// From https://getbootstrap.com/docs/5.3/components/tooltips/
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]',
);
//eslint-disable-next-line
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);
