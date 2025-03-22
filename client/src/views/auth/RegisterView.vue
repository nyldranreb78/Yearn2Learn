<template>
  <div id="register">
    <div class="container navbar-offset">
      <div class="card card-body mt-4">
        <h5 class="card-title">
          Register
        </h5>
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
          <button
            type="submit"
            class="btn btn-warning"
          >
            Register
          </button>
        </form>
      </div>
    </div>
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
  await authStore
    .register(registerData)
    .then((res) => {
      console.log("Registration successful:", res);
      router.replace({ name: "home" });
    })
    .catch((err) => {
      errorMessage.value = err.message;
    });
}
</script>

<style scoped>
#register {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
}

#register .card {
  max-width: 40vw;
  margin: auto;
}
</style>
