<template>
  <nav class="navbar navbar-expand-lg navbar-fixed-size fixed-top bg-white border-bottom">
    <div class="container-fluid">
			<strong>
				<a class="navbar-brand fs-3" href="#">
					<img :src="require(`@/assets/img/Y2L_Logo.png`)" width="40" class="me-2" />
					<span class="txt-y2l-yellow">Yearn</span>
					<span class="txt-y2l-red">2</span>
					<span class="txt-y2l-blue">Learn</span>
				</a>
			</strong>

			<ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="isAuthenticated">
				<li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
				<li class="nav-item"><a class="nav-link active" href="#">Flash Cards</a></li>

				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown">
						Goal Management
					</a>

					<ul class="dropdown-menu">
						<li><a class="dropdown-item" href="#">Task List</a></li>
						<li><hr class="dropdown-divider"></li>
						<li><a class="dropdown-item" href="#">Goal Tracker</a></li>
					</ul>
				</li>

				<li class="nav-item dropdown">
					<a
						class="nav-link dropdown-toggle active"
						href=""
						role="button"
						data-bs-toggle="dropdown"
						data-bs-auto-close="outside"
					>
						Timer
					</a>

					<ul class="dropdown-menu">
						<li><div><DynamicTimer/></div></li>
					</ul>
				</li>
			</ul>

			<div class="d-flex justify-content-end">
				<li v-if="isAuthenticated" class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
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
import DynamicTimer from './DynamicTimer.vue';

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

<style scoped>
.navbar-fixed-size{
    height: 75px;
}

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