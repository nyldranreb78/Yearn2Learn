<template>
  <div id="register">
    <div class="register-container">
      <div class="logo-container">
        <img
          :src="require(`@/assets/img/Y2L_Logo.png`)"
          alt="Yearn2Learn"
          width="50"
          class="object-fit-scale me-2"
        >
        <span class="txt-y2l-yellow">Yearn</span>
        <span class="txt-y2l-red">2</span>
        <span class="txt-y2l-blue">Learn</span>
      </div>

      <h4 class="title">
        Create an account
      </h4>

      <form @submit.prevent="submit">
        <p
          v-if="errorMessage"
          class="error-message text-danger mb-4"
        >
          {{ errorMessage }}
        </p>
        <div class="mb-3">
          <label
            for="username"
            class="form-label"
          >Username</label>
          <input
            id="username"
            v-model="registerData.username"
            type="text"
            class="form-control"
            autocomplete="off"
          >
        </div>
        <div class="mb-3">
          <label
            for="first_name"
            class="form-label"
          >First Name</label>
          <input
            id="first_name"
            v-model="registerData.first_name"
            type="text"
            class="form-control"
            autocomplete="off"
          >
        </div>
        <div class="mb-3">
          <label
            for="last_name"
            class="form-label"
          >Last Name</label>
          <input
            id="last_name"
            v-model="registerData.last_name"
            type="text"
            class="form-control"
            autocomplete="off"
          >
        </div>
        <div class="mb-3">
          <label
            for="email"
            class="form-label"
          >Email address</label>
          <input
            id="email"
            v-model="registerData.email"
            type="email"
            class="form-control"
            autocomplete="off"
          >
        </div>
        <div class="mb-3">
          <label
            for="password"
            class="form-label"
          >Password</label>
          <input
            id="password"
            v-model="registerData.password"
            type="password"
            class="form-control"
          >
        </div>
        <div class="mb-3">
          <label
            for="password_confirm"
            class="form-label"
          >Confirm Password</label>
          <input
            id="password_confirm"
            v-model="registerData.password_confirm"
            type="password"
            class="form-control"
          >
        </div>

        <div class="button-container">
          <button
            type="submit"
            class="btn btn-sm btn-warning fs-6 mt-4 w-100"
          >
            Sign Up
          </button>
          <span class="login fs-6">
            Have an account?
            <router-link :to="{ name: 'login' }"> Login </router-link>
          </span>
        </div>
      </form>
    </div>
    <div class="register-image" />
  </div>
</template>

<script setup lang="js">
import { useAuthStore } from "../../store/auth";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const registerData = reactive({
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  password_confirm: "",
});

const errorMessage = ref("");

async function submit() {
  errorMessage.value = "";

  await authStore
    .register(registerData)
    .then((res) => {
      console.log("Registration successful:", res);
      router.replace({ name: "home" });
    })
    .catch((err) => {
      console.error("Registration failed:", err);
      errorMessage.value = "Registration failed. Please try again.";

      // Clear all input fields if registration fails
      registerData.username = "";
      registerData.email = "";
      registerData.first_name = "";
      registerData.last_name = "";
      registerData.password = "";
      registerData.password_confirm = "";

      setTimeout(() => {
        const registerContainer = document.querySelector(".register-container");
        if (registerContainer) {
          registerContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    });
}
</script>

<style scoped>
#register {
  display: grid;
  grid-template-columns: 2fr 3fr;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.register-image {
  background-image: url("@/assets/img/auth_background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  size: 50px;
}

.register-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}

.title {
  color: #213e53;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.button-container button {
  width: 40%;
  max-width: 300px;
  text-align: center;
  font-size: 20px;
  transition: color 0.3s ease-in-out;
}

.button-container button:hover {
  color: #213e53;
}

.login {
  margin-top: 10px;
  font-size: 20px;
  color: #213e53;
}

.login a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.login a:hover {
  text-decoration: underline;
}

.error-message {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #721c24;
}
</style>
