import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import("../views/features/NoteView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import("../views/auth/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import("../views/auth/RegisterView.vue"),
  },
  {
    path: "/user",
    name: "user",
    component: () =>
      import("../views/auth/UserView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/flashcards",
    name: "flashcards",
    component: () =>
      import("../views/features/FlashcardView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/notes",
    name: "notes",
    component: () =>
      import("../views/features/NoteView.vue"),
    meta: { requiresAuth: true }
  },
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
