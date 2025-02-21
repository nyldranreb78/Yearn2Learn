<template>
  <div class="container-fluid text-start">
    <div class="row bg-light">
      <div class="col-3 text-center">
				<button
					class="btn btn-warning btn-hanging"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#sideBarLeft"
				>
					Class List
				</button>
			</div>

			<div class="col-6">
				<div class="card">
					<div class="card-header y2l-blue text-white text-start fs-5">
						Feb 13 Class
					</div>
					
					<div class="card-body">
						<TextEditor />
					</div>
				</div>
			</div>

			<div class="col-3 text-center">
				<button
					class="btn btn-warning btn-hanging"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#sideBarRight"
				>
					Timers & Trackers
				</button>

			</div>
		</div>

		<div
			class="offcanvas offcanvas-start"
			data-bs-scroll="true"
			data-bs-backdrop="false"
			tabindex="-1"
			id="sideBarLeft"
		>
			<div class="offcanvas-header">
				<h5 class="offcanvas-title"><strong>Class List</strong></h5>
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
			</div>
			
			<div class="offcanvas-body">
				<div class="accordion accordion-flush" id="classList">
					<div class="accordion-item">
						<h2 class="accordion-header">
							<button
								class="accordion-button collapsed"
								type="button" 
								data-bs-toggle="collapse"
								data-bs-target="#class1"
							>
								<strong>COMP 4350</strong>
							</button>
						</h2>
						<div id="class1" class="accordion-collapse collapse" data-bs-parent="#classList">
							<div class="accordion-body pt-2 pb-0 ps-3 pe-0 fs-6">
								<div class="list-group">
									<a href="#" class="list-group-item list-group-item-action">Feb 13 Class</a>
									<a href="#" class="list-group-item list-group-item-action">Feb 11 Class</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="d-flex">
					<button @click="createNote" class="btn btn-warning me-2">
						Create Note
					</button>
				</div>
			</div>
		</div>

		<div
			class="offcanvas offcanvas-end"
			data-bs-scroll="true"
			data-bs-backdrop="false"
			tabindex="-1"
			id="sideBarRight"
		>
			<div class="offcanvas-header">
				<h5 class="offcanvas-title"><strong>Timers & Trackers</strong></h5>
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
			</div>
			<div class="offcanvas-body">
				<div class="card">
					<div class="card-header y2l-red text-white text-start fs-5">
						Pomodoro Timer
					</div>
					
					<div class="card-body">
						<h3>POMODORO GOES HERE</h3>
					</div>
				</div>

				<div class="card mt-3">
					<div class="card-header y2l-blue text-white text-start fs-5">
						Goal Tracker
					</div>
					
					<div class="card-body">
						<h3>GOAL TRACKER (EVENTUALLY) GOES HERE</h3>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>


<script>
// @ is an alias to /src
import TextEditor from "@/components/TextEditor.vue";
import { useAuthStore } from "@/store/auth";

export default {
  name: "MainPage",
  components: {
    TextEditor,
  },
  data() {
    return {
      authStore: useAuthStore(),
    };
  },
  methods: {
    async createNote() {
      try {
        const noteData = {
          title: "New Note",
          content: "This is a sample note."
        };
        const response = await this.authStore.createNote(noteData);
        console.log("Note created successfully:", response);
      } catch (error) {
        console.error("Error creating note:", error);
      }
    }
  }
};
</script>
