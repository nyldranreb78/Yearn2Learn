<template>
  <div id="login">
    <div class="container navbar-offset">
      <div class="card card-body mt-4">
        <h5 class="card-title">Login</h5>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input v-model="loginData.email" type="email" class="form-control" id="email" autocomplete="off">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="loginData.password" type="password" class="form-control" id="password">
          </div>
          <button type="submit" class="btn btn-warning">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { useAuthStore } from '../../store/auth';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

const loginData = reactive({
  email: "",
  password: "",
})

const errorMessage = ref("")

async function submit(){
  await authStore.login(loginData)
    .then(res => {
      console.log("Login successful:", res);
      router.replace({name: "home"})
    })
    .catch(err => {
      errorMessage.value = err.message
    })
}

</script>

<style scoped>
#login .card{
  max-width: 40vw;
  margin: auto;
}
</style>