<template>
	<div class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset">
		<div class="row justify-content-md-center mt-4">
			<div class="col-6">
				<div class="row"><div class="col ps-0"><h4>Features</h4></div></div>
				<div class="row mb-5">
					<div class="col" v-for="feature in featureInfo" v-bind:key="feature[2]">
						<FeatureCard
							:bootstrap-icon-code="feature[0]"
							:feature-name="feature[1]"
							:route-name="feature[2]"
							:description="feature[3]"
							v-on:click="feature[2]? null : showTimer('false')"
							@mouseleave="feature[2]? null : showTimer('outside')"
						/>
					</div>
				</div>

				<div class="row"><div class="col ps-0"><h4>Quick Access</h4></div></div>

				<div class="row mb-5 pe-2">
					<div class="col-auto"><h6><i class="bi bi-calendar2 me-1"></i> Upcoming Tasks</h6></div>
					<div class="col border-bottom border-card mb-3"></div>
				</div>

				<div class="row mb-5 pe-2">
					<div class="col-auto"><h6><i class="bi bi-journal-text me-1"></i> Recent Notes</h6></div>
					<div class="col border-bottom border-card mb-3"></div>
				</div>

				<div class="row mb-5 pe-2">
					<div class="col-auto"><h6><i class="bi bi-card-heading me-1"></i> Flash Cards</h6></div>
					<div class="col border-bottom border-card mb-3"></div>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
import FeatureCard from '@/components/FeatureCard.vue';
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";
//import { ref } from 'vue'; // reactive, computed, onMounted, onBeforeUnmount

const noteDesc = "Write and edit your notes, organized by folders."
const flashcardDesc = "Create your own set of Q&A cards and test yourself with them."
const goalDesc = "Keep track of your tasks, goals, and grade progress."
const timerDesc = "Choose between a generic or Pomodoro Method timer."

const featureInfo = [ // [Bootstrap Icon Code, Feature Name, Vue Route] 
	["journal-text", "Notes", "notes", noteDesc],
	["card-heading", "Flash Cards", "flashcards", flashcardDesc],
	["calendar2-check", "Goal Management", "home", goalDesc], // TODO: change this later
	["stopwatch", "Timer", null, timerDesc]
];

async function showTimer(autoCloseAttribute){
  const timerMenu = document.querySelector("#timerFeature");
  timerMenu.setAttribute("data-bs-auto-close", autoCloseAttribute);

  const dropdown = new bootstrap.Dropdown(timerMenu)
  if(autoCloseAttribute === "false") {
	dropdown.show();
  }
}
</script>


<style>
.border-card{
	border-color: #d2d2d2 !important;
}
</style>