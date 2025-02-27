<template>
  <div
    class="container-fluid text-start h-100 d-flex flex-column navbar-offset"
  >
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
            <div class="fs-5 mt-1 text-truncate">
              {{ textEditorData.course_name }} / {{ textEditorData.file_name }}
            </div>
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

    <!--SIDEBAR-->
    <div
      class="offcanvas offcanvas-start navbar-offset"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabindex="-1"
      id="side_bar_left"
    >
      <!--SIDEBAR HEADER-->
      <div class="offcanvas-header d-inline-block pb-0">
        <h5 class="offcanvas-title">
          <div class="row">
            <div class="col-2 text-start align-middle">
              <button
                type="button"
                class="btn btn-secondary btn-circle me-3"
                data-bs-dismiss="offcanvas"
                v-on:click="closeCourseForm()"
              >
                <i class="bi bi-arrow-left"></i>
              </button>
            </div>

            <div class="col text-start align-middle pt-1">
              <strong>Course List</strong>
            </div>

            <div class="col text-end align-middle pt-1">
              <button
                type="button"
                class="btn btn-edit-form py-0 px-1 ms-2"
                v-on:click="toggleEditMode()"
                v-show="courseList.length"
              >
                <span v-show="courseEditMode">Finish Editing</span>
                <i class="bi bi-pencil-square" v-show="!courseEditMode"></i>
              </button>
            </div>
          </div>
        </h5>
      </div>

      <!--SIDEBAR BODY-->
      <div class="offcanvas-body">
        <!--ADD COURSE FORM-->
        <div class="row p-0 m-0 mb-3" v-if="!courseEditMode">
          <button
            class="btn"
            :class="courseFormInProgress ? 'btn-secondary' : 'btn-primary'"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#add_course_form"
            v-on:click="toggleCourseForm()"
          >
            <i
              :class="courseFormInProgress ? 'bi bi-x-lg' : 'bi bi-plus-lg'"
            ></i>
            <span class="ms-2">{{
              courseFormInProgress ? "Cancel" : "Add Course"
            }}</span>
          </button>

          <div class="collapse p-0 m-0" id="add_course_form">
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
                    />
                  </div>
                </div>

                <div class="row">
                  <small>Priority</small>
                  <div class="col-9">
                    <select
                      class="form-select"
                      v-model="courseData.is_major"
                      required
                    >
                      <option value selected disabled>Select</option>
                      <option :value="true">Major Requirement</option>
                      <option :value="false">Elective</option>
                    </select>
                  </div>

                  <div class="col-3 ps-0">
                    <button type="submit" class="btn btn-primary w-100">
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!--PLACEHOLDER TEXT-->
        <div
          class="text-center text-muted px-5 py-4"
          v-show="!courseList.length && !courseFormInProgress"
        >
          <i
            >No courses or notes to show. Click on the "Add Course" button to
            add a course and write cotes under it.</i
          >
        </div>

        <!--COLLAPSIBLE COURSE LIST-->
        <div class="accordion accordion-flush" v-show="!courseEditMode">
          <div
            class="accordion-item"
            v-for="course in courseList"
            :key="course._id"
          >
            <h2 class="accordion-header">
              <button
                type="button"
                class="accordion-button collapsed"
                data-bs-toggle="collapse"
                :data-bs-target="'#courseID' + course._id"
              >
                <strong class="text-truncate">{{ course.name }}</strong>
              </button>
            </h2>

            <!--NOTES LIST FOR EACH COURSE-->
            <div
              :id="'courseID' + course._id"
              class="accordion-collapse collapse"
            >
              <div class="accordion-body pt-0 pb-0 ps-3 pe-0 fs-6 mb-2">
                <div class="list-group sharp-top-border">
                  <!--ADD NOTE FORM TRIGGER-->
                  <button
                    type="button"
                    class="list-group-item list-group-item-action ps-3 border-top-0"
                    data-bs-toggle="modal"
                    data-bs-target="#add_edit_note_form"
                    v-on:click="passCurrentCourse(course)"
                  >
                    <i class="bi bi-plus-lg me-1"></i> Create new note
                  </button>

                  <div
                    class="list-group-item list-group-item-action ps-3 pe-2 py-1"
                    v-for="note in course.notes"
                    v-bind:key="note._id"
                    v-on:click="openNotes(course, note)"
                  >
                    <div class="row p-0">
                      <div class="col-10 text-start text-truncate">
                        <span class="align-middle">{{ note.title }}</span>
                      </div>

                      <div class="col-2 text-end align-middle">
                        <button
                          type="button"
                          class="btn btn-sm shadow-none note-menu"
                          @mouseover="mouseOnMenu = true"
                          @mouseleave="mouseOnMenu = false"
                          data-bs-toggle="dropdown"
                        >
                          <i class="bi bi-three-dots-vertical"></i>
                        </button>

                        <ul class="dropdown-menu py-1">
                          <li>
                            <a
                              class="dropdown-item px-2"
                              v-on:click="passCurrentNote(course, note)"
                              data-bs-toggle="modal"
                              data-bs-target="#add_edit_note_form"
                            >
                              Rename
                            </a>
                          </li>

                          <li><hr class="dropdown-divider my-1" /></li>

                          <li>
                            <a
                              class="dropdown-item px-2 text-danger"
                              v-on:click="passCurrentNote(course, note)"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_form"
                            >
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--EDIT COURSE VIEW-->
        <div class="accordion" id="course_edit_form" v-if="courseEditMode">
          <div
            class="accordion-item"
            v-for="course in courseList"
            :key="course.id"
          >
            <h2 class="accordion-header">
              <button
                type="button"
                class="accordion-button d-inline-block accordion-edit collapsed bg-light"
              >
                <div class="row">
                  <div class="col text-start align-middle text-truncate">
                    <strong>{{ course.course_name }}</strong>
                  </div>

                  <div class="col text-end align-middle">
                    <div
                      v-if="courseEditFormInProgress && currentCourse == course"
                    >
                      <button
                        type="button"
                        class="btn btn-close"
                        v-on:click="closeEditCourseForm()"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#courseID' + course._id + 'edit'"
                      ></button>
                    </div>

                    <div v-else>
                      <button
                        type="button"
                        class="btn btn-edit-form py-0 px-1 me-2"
                        v-on:click="openEditCourseForm(course)"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#courseID' + course.id + 'edit'"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>

                      <button
                        type="button"
                        class="btn btn-edit-form py-0 px-1"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_form"
                        v-on:click="passCurrentCourse(course)"
                      >
                        <i class="bi bi-trash3-fill text-danger"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </button>
            </h2>

            <div
              :id="'courseID' + course.id + 'edit'"
              class="accordion-collapse collapse"
              data-bs-parent="#course_edit_form"
            >
              <div class="accordion-body px-3 py-2 fs-6 mb-2">
                <form @submit.prevent="editCourse()">
                  <div class="row mb-2">
                    <div class="col">
                      <small>Rename Course</small>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="e.g. COMP 4350"
                        v-model="courseData.course_name"
                        required
                      />
                    </div>
                  </div>

                  <div class="row">
                    <small>Change Priority</small>
                    <div class="col-9">
                      <select
                        class="form-select"
                        v-model="courseData.is_major"
                        required
                      >
                        <option :value="true">Major Requirement</option>
                        <option :value="false">Elective</option>
                      </select>
                    </div>

                    <div class="col-3 ps-0">
                      <button
                        type="submit"
                        class="btn btn-success w-100"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#courseID' + course.id + 'edit'"
                      >
                        <i class="bi bi-floppy-fill"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--MODALS-->
    <!--Due to the nature of Bootstrap modals, these have to be close to the outermost HTML tag-->

    <!--ADD/EDIT NOTE FORM-->
    <div class="modal modal-md fade" id="add_edit_note_form" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <form @submit.prevent="currentNote ? editNote() : addNote()">
              <div class="row">
                <div class="col text-start">
                  <label class="text-truncate" for="document_name">
                    <span v-if="currentNote"
                      >Rename {{ currentNote.title }}:</span
                    >
                    <span v-else
                      >Create new note for
                      {{ currentCourse.name }}:</span
                    >
					{{ console.log(currentNote) }}
                  </label>
                </div>

                <div class="col text-end">
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
              </div>

              <div class="row">
                <div class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="e.g. Midterm Notes"
                    v-model="noteData.name"
                    required
                  />

                  <button
                    type="submit"
                    class="btn"
                    :class="currentNote ? 'btn-success' : 'btn-secondary'"
                    id="document_name"
                    data-bs-dismiss="modal"
                  >
                    <i
                      :class="
                        currentNote ? 'bi bi-floppy-fill' : 'bi bi-check-lg'
                      "
                    ></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!--DELETE COURSE/EDIT FORM-->
    <div class="modal modal-md fade" id="delete_form" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header px-2 py-1">
            <div class="modal-title fs-6">
              Confirm {{ courseEditMode ? "Course" : "Note" }} Deletion
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body text-center">
            <h6>
              Are you sure you want to delete the
              {{ courseEditMode ? "course" : "note" }} named
              <div class="row p-0 justify-content-md-center">
                <div class="col-9 text-truncate">
                  <strong>{{
                    courseEditMode
                      ? currentCourse.course_name
                      : currentNote.file_name
                  }}</strong>
                </div>
              </div>
              from your {{ courseEditMode ? "course list" : "note folder" }}?
              This is irreversible!
            </h6>

            <button
              class="btn btn-sm btn-secondary me-3"
              data-bs-dismiss="modal"
            >
              Keep
            </button>
            <button
              class="btn btn-sm btn-danger ms-3"
              v-on:click="courseEditMode ? deleteCourse(currentCourse._id) : deleteNote(currentNote._id)"
              data-bs-dismiss="modal"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
// @ is an alias to /src
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";
import { ref, reactive, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

// Course and note display variables
const courseList = ref([]);
const currentCourse = ref("");
const currentNote = ref("");

// Course form variables
const courseFormInProgress = ref(false);
const courseEditMode = ref(false);
const courseEditFormInProgress = ref(false);
const mouseOnMenu = ref(false);

// Required by Vue Quill for data binding
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

async function fetchData() {
	try {
		const response = await authStore.getFolder();
		console.log("Courses fetched successfully:", response);
		if (response) {
			courseList.value = response.folders;

			for (const course of courseList.value) {
				course.notes = await Promise.all(course.notes.map(async (noteId) => {
					const noteDetails = await authStore.getNoteByID(noteId);
					return noteDetails.note;
				}));
			}
		}

	} catch (error) {
		console.error("Error fetching courses:", error);
	}
}

onMounted ( async () => {
	await fetchData();
})


async function addCourse(){
	// Add the new course to the list

	const course = {
		name: courseData.course_name,
		priority: courseData.is_major,
		notes: []
	}

	const response = await authStore.createFolder(course);
	courseList.value.push(response.folder);

	// Reset important variables
	closeCourseForm();
}

async function editCourse(){
	if(currentCourse.value.course_name !== courseData.course_name){
		currentCourse.value.course_name = courseData.course_name;
	}

	if(currentCourse.value.is_major !== courseData.is_major){
		currentCourse.value.is_major = courseData.is_major;
	}

	closeEditCourseForm();
}

async function deleteCourse(courseId){
	if (!courseId) {
		console.error("No course ID provided for deletion.");
		return;
	}

	try {
		await authStore.deleteCourse(courseId);

		courseList.value = courseList.value.filter(course => course._id !== courseId);

	} catch (error) {
		console.error("Error deleting note:", error);
	}

	// If the last course is deleted, return to the Add Course state
	if (courseList.value.length === 0) {
		courseEditMode.value = false;
	}
}

async function toggleCourseForm(){
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

async function openEditCourseForm(course){
	courseEditFormInProgress.value = true;

	currentCourse.value = course;
	courseData.course_name = course.course_name;
	courseData.is_major = course.is_major;
}

async function closeEditCourseForm(){
	courseEditFormInProgress.value = false;

	if(courseFormInProgress.value){
		courseFormInProgress.value = false;
	}
}

async function resetCourseData(){
	courseData.course_name = "";
	courseData.is_major = "";
}

async function toggleEditMode(){
	if(courseList.value.length){
		courseEditMode.value = !courseEditMode.value;
	}

	if(courseEditMode.value){
		closeEditCourseForm();
	}
}

async function passCurrentCourse(course){
	currentCourse.value = course; // Allows modals to use the relevant data externally
	currentNote.value = ""; // Reset the currentNote since we are making a new one

	resetNoteData(); // Clear the form to prepare for new input
}

async function addNote(){
	// Find the course the note is going to be associated with
	const course = courseList.value.find(course => course._id === currentCourse.value._id);
	if (!course) {
		console.error("Error: Course not found!");
		return;
	}

	if (!course.notes) {
		course.notes = [];
	}

	// Add the new note to the course's list of notes
	const note = {
		title: noteData.file_name,
		content: "<p><br></p>" // Quill editor's definition of an "empty" editor
	}
	console.log("Note to be added:", note);

	try {
		const savedNote = await authStore.createNoteInFolder(course._id, note);
		console.log("Note saved successfully:", savedNote.note);
		course.notes.push(savedNote.note);
	} catch (error) {
		console.error("Error saving note to backend:", error);
		return;
	}

	// Reset and close the form menu
	resetNoteData();

	// Update the text editor contents to the new note's
	openNotes(course, note)
}

async function editNote(){
	if(currentNote.value.file_name !== noteData.file_name){
		currentNote.value.file_name = noteData.file_name;
	}
}

async function deleteNote(noteId){
	if (!noteId) {
		console.error("No note ID provided for deletion.");
		return;
	}

	try {
		await authStore.deleteNote(noteId);

		courseList.value = courseList.value.map((course) => {
			return {
				...course,
				notes: course.notes.filter((note) => note._id !== noteId), // Remove deleted note
			};
		});

	} catch (error) {
		console.error("Error deleting note:", error);
	}
}

async function passCurrentNote(course, note){
	passCurrentCourse(course);

	currentNote.value = note;
	noteData.file_name = note.file_name;
}

async function resetNoteData(){
	noteData.file_name = "";
}

async function openNotes(course, note) {
	// Do nothing if the mouse was inside the vertical menu button
	if (!mouseOnMenu.value) {
		// If moving to a new note, save the changes
		if (currentNote.value) {
			if (currentNote.value.content !== textEditorData.content) {
				await saveNoteChanges(currentNote.value);
			}
			//currentNote.value.content = textEditorData.content;
		}

		// Update the data to be used by the text editor
		textEditorData.course_name = course.name;
		textEditorData.file_name = note.title;
		textEditorData.content = note.content;

		// Allows us to save changes after switching files
		currentNote.value = note;
	}
}

async function saveNoteChanges(note) {
	try {
		const updatedNote = {
			title: note.title,
			content: note.content,
		};

		await authStore.updateNote(note._id, updatedNote);
		console.log("Note updated successfully:", updatedNote);
	} catch (error) {
		console.error("Error updating note:", error.response?.data || error.message);
	}
}
</script>

<style scoped>
.sharp-top-border {
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

.accordion-button:focus {
  outline: none !important;
  box-shadow: none !important;
}

.btn-circle {
  border-radius: 50%;
  aspect-ratio: 1;
}

.note-menu:hover {
  background-color: lightgray;
}

.btn-edit-form {
  border: none;
}

.btn-edit-form:hover {
  background-color: lightgray;
}

.accordion-edit:not(.collapsed)::after,
.accordion-edit::after {
  background-image: unset !important;
}
</style>
