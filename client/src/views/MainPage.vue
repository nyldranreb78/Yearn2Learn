<template>
  <div class="container-fluid text-start h-100 d-flex flex-column navbar-offset">
		<!--MAIN SCREEN-->
		<!--The table grid divides the screen into three with the text editor in the middle-->
    <div class="row bg-light vh-100">
      <div class="col-3">
				<button
					class="btn btn-secondary btn-circle mt-3 ms-1 position-fixed"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#side_bar_left"
				>
					<i class="bi bi-list"></i>
				</button>
			</div>

			<div class="col-6 bg-white p-0">
				<!-- FILE NAME & TEXT EDITOR TOOLBAR -->
				<div class="row border border-top-0 m-0">
					<div class="col-6">
						<div class="fs-5 mt-1">{{ textEditorData.course_name }} / {{ textEditorData.file_name }}</div>
					</div>
					
					<div class="col-6">
						<div id="fixed_toolbar" class="border-0 d-flex justify-content-end">
							<!-- Font size selector -->
							<select class="ql-size me-4">
								<option value="small"></option>
								<option selected></option>
								<option value="large"></option>
								<option value="huge"></option>
							</select>

							<!-- Common text modifiers -->
							<button class="ql-bold"></button>
							<button class="ql-italic"></button>
							<button class="ql-underline"></button>
							<button class="ql-strike"></button>
							<button class="ql-script" value="sub"></button>
							<button class="ql-script me-4" value="super"></button>

							<!-- Lists -->
							<button class="ql-list" value="bullet"></button>
							<button class="ql-list me-4" value="ordered"></button>

							<!-- Niche tools -->
							<button class="ql-blockquote"></button>
							<button class="ql-code-block"></button>
						</div>
					</div>
				</div>

				<div class="row border border-top-0 bg-white m-0">
					<QuillEditor
						theme="snow"
						toolbar="#fixed_toolbar"
						class="vh-100 border-top-0"
						v-model:content="textEditorData.content"
						content-type="html"
						ref="textEditor"
					/>
				</div>
			</div>

			<div class="col-3 text-center"></div>
		</div>

		<!--LEFT SIDEBAR-->
		<div
			class="offcanvas offcanvas-start navbar-offset"
			data-bs-scroll="true"
			data-bs-backdrop="false"
			tabindex="-1"
			id="side_bar_left"
		>
			<!--HEADER-->
			<div class="offcanvas-header pb-0">
				<button
					type="button"
					class="btn btn-secondary btn-circle me-3"
					data-bs-dismiss="offcanvas"
					v-on:click="closeCourseForm()"
				>
					<i class="bi bi-arrow-left"></i>
				</button>

				<h5 class="offcanvas-title"><strong>Course List</strong></h5>
			</div>
			
			<!--BODY-->
			<div class="offcanvas-body">

				<!--ADD COURSE FORM-->
				<div class="row p-3">
					<button
						class="btn"
						:class="courseFormInProgress? 'btn-secondary' : 'btn-primary'"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#add_course_form"
						v-on:click="refreshCourseForm()"
					>
						<i :class="courseFormInProgress? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
					</button>

					<div class="collapse" id="add_course_form">
						<div class="card card-body sharp-top-border border-top-0 mb-2">
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
							<div class="accordion-body pt-0 pb-0 ps-3 pe-0 fs-6 mb-2">
								<div class="list-group sharp-top-border">
									<!--ADD NOTE FORM TRIGGER-->
									<button
										type="button"
										class="list-group-item list-group-item-action border-top-0"
										data-bs-toggle="modal"
										data-bs-target="#add_note_form"
										v-on:click="passCurrentCourse(course)"
									>
										<i class="bi bi-plus-lg me-2"></i> Create new note
									</button>

									<div
										class="list-group-item list-group-item-action"
										v-for="note in course.attached_notes"
										v-bind:key="note.file_name"
										v-on:click="openNotes(course, note)"
									>
										{{ note.file_name }}
									</div>

					<!--	<div id="class1" class="accordion-collapse collapse" data-bs-parent="#classList">
							<div class="accordion-body pt-2 pb-0 ps-3 pe-0 fs-6">
								<div class="list-group">
									<a href="#" class="list-group-item list-group-item-action">Feb 13 Class</a>
									<a href="#" class="list-group-item list-group-item-action">Feb 11 Class</a>
									
									<div class="d-flex">
										<button @click="createNote" class="btn btn-warning me-2">
											Create Note
										</button>
									</div> -->


								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="d-flex">
					<button @click="createFolder" class="btn btn-warning me-2">
						New Folder
					</button>
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
  </div>
</template>


<script setup lang="js">
// @ is an alias to /src
import { ref, reactive } from 'vue';
import { uuid } from "vue-uuid";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";

const courseFormInProgress = ref(false);
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

const courseList = ref([]);

async function addCourse(){
	// Add the new course to the list
	courseList.value.unshift({
		id: uuid.v1(),
		course_name: courseData.course_name,
		is_major: courseData.is_major,
		attached_notes: []
	})

	// Reset important variables
	closeCourseForm();
}

async function refreshCourseForm(){
	courseFormInProgress.value = !courseFormInProgress.value;
	resetCourseData();
}

async function closeCourseForm(){
	// Only close the form if it is open in the first place
	if(courseFormInProgress.value){
		const form = document.querySelector("#add_course_form");
		bootstrap.Collapse.getInstance(form).hide();

		courseFormInProgress.value = false;

		resetCourseData();
	}
}

async function resetCourseData(){
	courseData.course_name = "";
	courseData.is_major = "";
}

async function passCurrentCourse(course){
	currentCourse.value = course; // Allows modals to use the relevant data externally

	resetNoteData(); // Clear the form to prepare for new input
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
	toggleNoteForm();
	resetNoteData();

	// Update the text editor contents to the new note's
	openNotes(course, note)
}

async function toggleNoteForm(){
	const form = document.querySelector("#add_note_form");
	bootstrap.Modal.getInstance(form).hide();
}

async function resetNoteData(){
	noteData.file_name = "";
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

<style scoped>
.sharp-top-border{
	border-top-left-radius: 0px !important;
	border-top-right-radius: 0px !important;
}

.accordion-button:focus{
	outline: none !important;
	box-shadow: none !important;
}

.btn-circle{
	border-radius: 50%;
	aspect-ratio: 1;
}
</style>

//! Below is Chika's and Nam's implementation 

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
    },
	
	async createFolder() {
		try {
			const folderData = {
			name: "New Folder"
			};
			const response = await this.authStore.createFolder(folderData);
			console.log("Folder created successfully:", response);
		} catch (error) {
			console.error("Error creating folder:", error);
		}
	}
  }
};
</script>

