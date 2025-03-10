<template>
  <nav class="navbar navbar-expand-lg navbar-fixed-size fixed-top bg-white border-bottom">
    <div class="container-fluid">
			<strong>
				<a class="navbar-brand fs-3 ms-2" href="#" v-on:click="refresh">
					<img :src="require(`@/assets/img/Y2L_Logo.png`)" width="40" class="object-fit-scale me-2" />
					<span class="txt-y2l-yellow">Yearn</span>
					<span class="txt-y2l-red">2</span>
					<span class="txt-y2l-blue">Learn</span>
				</a>
			</strong>

			<div class="vr ms-2 me-3" v-if="isAuthenticated"></div>

			<ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="isAuthenticated">
				<li class="nav-item"><a class="nav-link active" href="#" v-on:click="refresh">Home</a></li>
				<li class="nav-item"><a class="nav-link active" href="#" v-on:click="refresh">Notes</a></li>
				<li class="nav-item"><a class="nav-link disabled" href="#">Flash Cards</a></li>

				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle disabled" href="#" role="button" data-bs-toggle="dropdown">
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
						<li><div><DynamicTimer @timeUp="(n) => timerNotificaction(n)"/></div></li>
					</ul>
				</li>
			</ul>
			
			<div class="d-flex justify-content-end">
				<li v-if="isAuthenticated" class="nav-item dropdown me-2">
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
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DynamicTimer from './DynamicTimer.vue';

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

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

// Forces a refresh to simulate going Home
// TODO: replace on sprint 3 once routes are established
async function refresh(){
	if(route.name === "home"){
		window.location.reload();
	}
}

const timerNotif = ref(false)
async function timerNotificaction(timerType){
	timerNotif.value = !timerNotif.value

	if (timerType == 0){
		alert("Time's Up!")
	}
	else {
		alert("Pomodorro Cycled!")
	}
}

</script>

<style scoped>
.navbar-fixed-size{
    height: 70px;
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