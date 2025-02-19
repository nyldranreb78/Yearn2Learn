<style scoped>
    .nav-item {
    list-style: none !important;
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
        color: #2F5597 !important;
        font-weight: bold !important;
    }
</style>

<template>
   <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
		<div class="col-3"></div>
        <div class="col-6">
            <div class="navbar p-2">
                <div class="col">
                    <strong>
                        <a class = "navbar-brand fs-3" href="#">
                            <img :src="require(`@/assets/img/Y2L_Logo.png`)" width="40" class="me-2" />
                            <span class="txt-y2l-yellow">Yearn</span>
                            <span class="txt-y2l-red">2</span>
                            <span class="txt-y2l-blue">Learn</span>
                        </a>
                    </strong>
                </div>
            </div>
        </div>

        <div class="col-3 d-flex justify-content-end">
            <li v-if="isAuthenticated" class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ user.username }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                <li><router-link :to="{ name: 'user' }" class="dropdown-item">Profile</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button @click="logout" class="dropdown-item text-danger">Logout</button></li>
                </ul>
            </li>

            <div v-else class="d-flex">
                <router-link :to="{ name: 'login' }" class="btn btn-warning me-2">
                    Login
                </router-link>
                <router-link :to="{ name: 'register' }" class="btn btn-warning">
                    Register
                </router-link>
            </div>
        </div>

    </div>
   </nav> 
</template>
  
<script setup lang="js">
import { useAuthStore } from '../store/auth';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()

const router = useRouter()

const user = computed(()=>{
return authStore.user
})

const isAuthenticated = computed(()=>{
return authStore.isAuthenticated
})

async function logout(){
await authStore.logout()
    .then( res => {
    console.log("Logout successful:", res);
    router.push({name: 'login'})
    })
    .catch(err => {
    console.log(err.message)
    })
}

</script>