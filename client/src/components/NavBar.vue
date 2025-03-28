<template>
  <nav
    class="navbar navbar-expand-lg navbar-fixed-size fixed-top bg-white border-bottom shadow-sm"
  >
    <div class="container-fluid">
      <strong>
        <router-link
          :to="{ name: 'home' }"
          class="navbar-brand fs-3 ms-2"
          href="#"
        >
          <img
            :src="require(`@/assets/img/Y2L_Logo.png`)"
            alt="Yearn2Learn"
            width="40"
            class="object-fit-scale me-2"
          >
          <span class="txt-y2l-yellow">Yearn</span>
          <span class="txt-y2l-red">2</span>
          <span class="txt-y2l-blue">Learn</span>
        </router-link>
      </strong>

      <div
        v-if="isAuthenticated"
        class="vr ms-2 me-3"
      />

      <ul
        v-if="isAuthenticated"
        class="navbar-nav me-auto mb-2 mb-lg-0"
      >
        <li class="nav-item">
          <router-link
            :to="{ name: 'home' }"
            class="nav-link active"
            active-class="active-nav"
            href="#"
          >
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'notes' }"
            class="nav-link active"
            active-class="active-nav"
            href="#"
          >
            Notes
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'flashcards' }"
            class="nav-link active"
            active-class="active-nav"
            href="#"
          >
            Flashcards
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'tasks' }"
            class="nav-link active"
            active-class="active-nav"
            href="#"
          >
            Task Management
          </router-link>
        </li>

        <li class="nav-item dropdown">
          <button
            id="timerFeature"
            type="button"
            role="button"
            class="nav-link dropdown-toggle active"
            href="#"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
          >
            Timer
          </button>

          <ul class="dropdown-menu y2l-red z-3">
            <li>
              <div>
                <DynamicTimer @time-up="(n) => timerNotification(n)" />
              </div>
            </li>
          </ul>
        </li>
      </ul>

      <div class="d-flex justify-content-end">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li
            v-if="isAuthenticated"
            class="nav-item dropdown me-2"
          >
            <a
              class="nav-link dropdown-toggle btn btn-link"
              type="button"
              data-bs-toggle="dropdown"
              @keydown="handleKeyDown"
            >
              {{ user.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link
                  :to="{ name: 'user' }"
                  class="dropdown-item txt-y2l-blue"
                >
                  Profile
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button
                  class="dropdown-item txt-y2l-red"
                  @click="logout"
                >
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="d-flex justify-content-end fixed-top navbar-offset z-0">
    <div
      id="timerAlert"
      :class="
        'toast timer-toast align-items-center border-0 mt-3 me-4 text-bg-' +
          toastColor
      "
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">
          <span v-if="isPomodoro">
            Pomodoro cycle started: <b>{{ toastMessage }}</b> for the next
            <u>{{ toastTime }} minutes</u>.
          </span>

          <span v-else>{{ toastMessage }}</span>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { useAuthStore } from "../store/auth";
import { useCoreStore } from "@/store/core";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import DynamicTimer from "./DynamicTimer.vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";

const isPomodoro = ref("");
const toastColor = ref("");
const toastMessage = ref("");
const toastTime = ref("");

const authStore = useAuthStore();
const coreStore = useCoreStore();
const router = useRouter();

const user = computed(() => {
  return authStore.user;
});

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated;
});

async function logout() {
  await authStore
    .logout()
    .then((res) => {
      console.log("Logout successful:", res);
      coreStore.$reset();
      router.push({ name: "login" });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

async function timerNotification(timerInfo) {
  const timerToast = document.querySelector("#timerAlert");
  const notification = bootstrap.Toast.getOrCreateInstance(timerToast);

  if (timerInfo[0] == 0) {
    isPomodoro.value = false;
    setToast("primary", "Time's up!", 0);
  } else {
    isPomodoro.value = true;

    if (timerInfo[1] < 5) {
      if (timerInfo[1] % 2 == 0) {
        setToast("danger", "Focus", 25);
      } else {
        setToast("success", "Take a break", 5);
      }
    } else {
      setToast("primary", "Time for a big break! Rest up", 30);
    }
  }

  setTimeout(() => {
    notification.show();
  }, 10);
}

async function setToast(color, message, time) {
  toastColor.value = color;
  toastMessage.value = message;
  toastTime.value = time;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap");

.navbar {
  font-family: "Libre Baskerville", sans-serif;
  border-bottom: 3px solid;
  border-image-source: linear-gradient(to right, #ea4d21, #ffc000, #2F5597);
  border-image-slice: 1;
}

.navbar .nav-link {
  color: #213e53;
  font-weight: 550;
  transition: color 0.3s ease-in-out, border-bottom 0.3s ease-in-out;
}

.navbar .nav-link:hover {
  color: #2F5597;
}

.active-nav {
  color: #2F5597 !important;
  font-weight: bold;
  border-bottom: 3px solid #2F5597;
}

.navbar-fixed-size {
  height: 70px;
}

.nav-item {
  list-style: none !important;
}

.timer-toast {
  width: 300px !important;
}

.nav-item::before,
.nav-item::after {
  content: none !important;
}

.dropdown-menu li {
  list-style: none !important;
}

.btn-warning.router-link-active,
.btn-warning.router-link-exact-active {
  color: #2f5597 !important;
  font-weight: bold !important;
}

.dropdown-item:hover {
  text-decoration: underline;
}
</style>
