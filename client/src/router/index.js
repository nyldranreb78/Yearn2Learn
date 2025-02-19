import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";
import MainPage from "../views/MainPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: MainPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/auth/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/auth/RegisterView.vue"),
  },
  {
    path: "/user",
    name: "user",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/auth/UserView.vue"),
    meta: { requiresAuth: true }
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // If the route requires authentication and the user is NOT logged in
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" }); // Redirect to login page
  } else {
    next(); // Proceed to route
  }
});

export default router;
