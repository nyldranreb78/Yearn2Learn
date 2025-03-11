<template>
	<nav class="navbar navbar-expand-lg navbar-fixed-size fixed-top bg-white border-bottom">
	<div class="container-fluid">
			<strong>
				<router-link :to="{ name: 'home' }" class="navbar-brand fs-3 ms-2" href="#">
					<img :src="require(`@/assets/img/Y2L_Logo.png`)" width="40" class="object-fit-scale me-2" />
					<span class="txt-y2l-yellow">Yearn</span>
					<span class="txt-y2l-red">2</span>
					<span class="txt-y2l-blue">Learn</span>
				</router-link>
			</strong>

			<div class="vr ms-2 me-3" v-if="isAuthenticated"></div>

			<ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="isAuthenticated">
				<li class="nav-item"><router-link :to="{ name: 'home' }" class="nav-link active" href="#">Home</router-link></li>
				<li class="nav-item"><router-link :to="{ name: 'notes' }" class="nav-link active" href="#">Notes</router-link></li>
				<li class="nav-item"><router-link :to="{ name: 'flashcards' }" class="nav-link active" href="#">Flash Cards</router-link></li>

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
						id="timerFeature"
						class="nav-link dropdown-toggle active"
						href="#"
						role="button"
						data-bs-toggle="dropdown"
						data-bs-auto-close="outside"
					>
						Timer
					</a>

					<ul class="dropdown-menu">
						<li><div><DynamicTimer class="z-3" @timeUp="(n) => timerNotification(n)"/></div></li>
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
   
	<div class="d-flex justify-content-end fixed-top navbar-offset z-0">
		<div id="timerAlert" :class="'toast align-items-center border-0 mt-3 me-4 text-bg-' + toastColor" role="alert">
			<div class="d-flex">
				<div class="toast-body">
					<span v-if="isPomodoro">
						Pomodoro cycle started: <b>{{ toastMessage }}</b> for the next <u>{{ toastTime }} minutes</u>.
					</span>

					<span v-else>{{ toastMessage }}</span>
				</div>
				<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
		</div>
	</div>
</template>
  
<script setup lang="js">
import { useAuthStore } from '../store/auth';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DynamicTimer from './DynamicTimer.vue';
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";

const isPomodoro = ref("")
const toastColor = ref("")
const toastMessage = ref("")
const toastTime = ref("")

const authStore = useAuthStore()
const router = useRouter()

const user = computed(()=>{
	return authStore.user
})

const isAuthenticated = computed(()=>{
	return authStore.isAuthenticated
})

onMounted ( async () => {
  const sidebar = document.querySelector('#timerAlert');
  bootstrap.Toast.getOrCreateInstance(sidebar);
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

async function timerNotification(timerInfo){
	if (timerInfo[0] == 0){
		isPomodoro.value = false;
		setToast("primary", "Time's up!", 0);
	}
	else {
		isPomodoro.value = true;

		if(timerInfo[1] < 6){
			if(timerInfo[1] % 2 == 0) {
				setToast("danger", "Focus", 25);
			} else {
				setToast("success", "Take a break", 5);
			}
		} else{
			setToast("primary", "Time for a big break! Rest up", 30);
		}
		//alert("Pomodorro Cycled!")
	}

	const timerToast = document.querySelector("#timerAlert");
	bootstrap.Toast.getInstance(timerToast).show();
}

async function setToast(color, message, time){
	toastColor.value = color;
	toastMessage.value = message;
	toastTime.value = time;
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