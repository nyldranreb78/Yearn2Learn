<template>
  <div class="container-fluid text-start">
		<!--MAIN SCREEN-->
		<!--The table grid divides the screen into three with the text editor in the middle-->
    <div class="row bg-light">
      <div class="col-3 text-center">
				<button
					class="btn btn-warning btn-hanging"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#side_bar_left"
				>
					Class List
				</button>
			</div>

			<div class="col-6">
				<div class="card">
					<div class="card-header y2l-blue text-white text-start">
						<label for="file_name"><small>{{ textEditorData.course_name }}</small></label>
						<div class="fs-5" id="file_name">{{ textEditorData.file_name }}</div>
					</div>
					
					<div class="card-body">
						<div class="bg-white shadow-sm">
							<QuillEditor
								theme="snow"
								toolbar="essential"
								style="min-height:100vh;"
								v-model:content="textEditorData.content"
								content-type="html"
								ref="textEditor"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="col-3 text-center">
				<button
					class="btn btn-warning btn-hanging"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#side_bar_right"
				>
					Timers & Trackers
				</button>

			</div>
		</div>

		<!--LEFT SIDEBAR-->
		<div
			class="offcanvas offcanvas-start"
			data-bs-scroll="true"
			data-bs-backdrop="false"
			tabindex="-1"
			id="side_bar_left"
		>
			<!--HEADER-->
			<div class="offcanvas-header">
				<h5 class="offcanvas-title"><strong>Course List</strong></h5>
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
			</div>
			
			<!--BODY-->
			<div class="offcanvas-body">

				<!--ADD COURSE FORM-->
				<div class="row p-1">
					<button
						class="btn mb-2"
						:class="courseformInProgress? 'btn-secondary' : 'btn-primary'"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#add_course_form"
						v-on:click="courseformInProgress = !courseformInProgress"
					>
						<i :class="courseformInProgress? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
					</button>

					<div class="collapse" id="add_course_form">
						<div class="card card-body mb-2">
							<form @submit.prevent="addCourse">
								<div class="row mb-2">
									<div class="col">
										<small>Course Name</small>
										<input
											type="text"
											class="form-control"
											placeholder="e.g. COMP 4350"
											v-model="courseData.course_name"
											required
										>
									</div>
								</div>

								<div class="row">
									<small>Priority</small>
									<div class="col-9">
										<select class="form-select" v-model="courseData.is_major" required>
											<option value selected disabled>Select</option>
											<option :value="true">Major Requirement</option>
											<option :value="false">Elective</option>
										</select>
									</div>

									<div class="col-3 ps-0">
										<button type="submit" class="btn btn-primary w-100">Add</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<!--COLLAPSIBLE COURSE LIST-->
				<div class="accordion accordion-flush">
					<div class="accordion-item" v-for="course in courseList" :key="course.id">
						<h2 class="accordion-header">
							<button
								class="accordion-button collapsed"
								type="button" 
								data-bs-toggle="collapse"
								:data-bs-target="'#courseID' + course.id"
							>
								<strong>{{ course.course_name }}</strong>
							</button>
						</h2>

						<!--NOTES LIST FOR EACH COURSE-->
						<div :id="'courseID' + course.id" class="accordion-collapse collapse">
							<div class="accordion-body pt-2 pb-0 ps-3 pe-0 fs-6 mb-2">
								<div class="list-group">
									<!--ADD NOTE FORM TRIGGER-->
									<button
										type="button"
										class="list-group-item list-group-item-action"
										data-bs-toggle="modal"
										data-bs-target="#add_note_form"
										@click="passCurrentCourse(course)"
									>
										<i class="bi bi-plus-lg me-2"></i>Create new note
									</button>

									<div
										class="list-group-item list-group-item-action"
										v-for="note in course.attached_notes"
										v-bind:key="note.file_name"
										@click="openNotes(course, note)"
									>
										{{ note.file_name }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--ADD NOTE FORM-->
		<!--Due to the nature of Bootstrap modals, this has to be close to the outermost HTML tag-->
		<div class="modal modal-md fade" id="add_note_form" tabindex="-1">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-body">
						<form @submit.prevent="addNote">
							<div class="row">
								<div class="col-9">
									<label class="col-form-label" for="document_name">
										Create new note for {{ currentCourse.course_name }}:
									</label>
								</div>

								<div class="col-3 text-end">
									<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
								</div>
							</div>

							<div class="row">
								<div class="input-group mb-3">
									<input
										type="text"
										class="form-control"
										placeholder="Write a name for this note"
										v-model="noteData.file_name"
										required
									>

									<button
										class="btn btn-outline-secondary"
										type="submit"
										id="document_name"
									>
										<i class="bi bi-check-lg"></i>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!--RIGHT SIDEBAR-->
		<div
			class="offcanvas offcanvas-end"
			data-bs-scroll="true"
			data-bs-backdrop="false"
			tabindex="-1"
			id="side_bar_right"
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

<script setup lang="js">
// @ is an alias to /src
import { ref, reactive } from 'vue';
import { uuid } from "vue-uuid";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";

const courseformInProgress = ref(false);
const currentCourse = ref("");
const currentNote = ref("");
const textEditor = ref();

const courseData = reactive({
	course_name: "",
	is_major: ""
});

const noteData = reactive({
	file_name: "",
});

const textEditorData = reactive({
	course_name: "",
	file_name: "",
	content: ""
})

const courseList = ref([{id: uuid.v1(), course_name: "COMP 4350", is_major: true, attached_notes:[{file_name: "Test Notes", data:"WEEEEEEEEEEEE"}]}]);

async function addCourse(){
	// Add the new course to the list
	courseList.value.unshift({
		id: uuid.v1(),
		course_name: courseData.course_name,
		is_major: courseData.is_major,
		attached_notes: []
	})

	// Close the form programmatically
	const form = document.querySelector('#add_course_form');
	bootstrap.Collapse.getInstance(form).toggle()

	// Reset important variables
	courseData.course_name = "";
	courseData.is_major = "";
	courseformInProgress.value = false;
}

async function addNote(){
	// Find the course the note is going to be associated with
	const course = courseList.value.find(course => course.id === currentCourse.value.id);

	// Add the new note to the course's list of notes
	const note = {
		file_name: noteData.file_name,
		data: "<p><br></p>"
	}

	course.attached_notes.unshift(note);

	// Reset and close the form menu
	noteData.file_name = "";
	const form = document.querySelector('#add_note_form');
	bootstrap.Modal.getInstance(form).hide();

	// Update the text editor contents to the new note's
	openNotes(course, note)
}

async function passCurrentCourse(course){
	currentCourse.value = course; // Allows modals to use the relevant data externally
}

async function openNotes(course, note){
	// If moving to a new note, save the changes
	if(currentNote.value){
		currentNote.value.data = textEditorData.content;
	}

	// Update the data to be used by the text editor
	textEditorData.course_name = course.course_name;
	textEditorData.file_name = note.file_name;
	textEditorData.content = note.data;

	// Allows us to save changes after switching files
	currentNote.value = note;
}
</script>