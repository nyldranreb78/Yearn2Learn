<template>
  <div id="login">
    <div class="login-image" />
    <div class="login-container">
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
        Log in to your account
      </h4>
      
      <form @submit.prevent="submit">
        <div
          v-if="errorMessage"
          class="error-message text-danger mb-4"
        >
          {{ errorMessage }}
        </div>

        <div class="mb-3">
          <label
            for="email"
            class="form-label"
          >Email address</label>
          <input
            id="email"
            v-model="loginData.email"
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
            v-model="loginData.password"
            type="password"
            class="form-control"
          >
          <p
            class="forgot-password"
            @click="forgotPassword"
          >
            Forgot Password?
          </p>
        </div>
        <div class="button-container">
          <button
            type="submit"
            class="btn btn-sm btn-warning fs-6 w-100"
          >
            Login
          </button>
          <span class="sign-up fs-6">
            Don't have an account?
            <router-link :to="{ name: 'register' }"> Sign Up </router-link>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="js">
import { useAuthStore } from "../../store/auth";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const loginData = reactive({
  email: "",
  password: "",
});

const errorMessage = ref("");

async function forgotPassword () {
  alert("If you've forgotten your password, please create a new account. Thank you!");
}

async function submit() {
  errorMessage.value = "";

  await authStore
    .login(loginData)
    .then((res) => {
      console.log("Login successful:", res);
      router.replace({ name: "home" });
    })
    .catch((err) => {
      console.error("Login failed:", err);
      errorMessage.value = "Invalid email or password. Please try again.";
    });
}
</script>

<style scoped>
#login {
  display: grid;
  grid-template-columns: 3fr 2fr;
  width: 100vw;
  height: 100vh;
}

.login-image {
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

.title {
  color: #213e53;
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

.sign-up {
  margin-top: 10px;
  font-size: 20px;
  color: #213e53;
}

.sign-up a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.sign-up a:hover {
  text-decoration: underline;
}

.forgot-password {
  font-size: 14px;
  color: #213e53;
  text-decoration: none;
  cursor: pointer;
  margin-top: 5px;
  text-align: right;
  display: block;
}

.forgot-password:hover {
  text-decoration: underline;
  color: #007bff;
}

.error-message {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #721c24;
}
</style>
