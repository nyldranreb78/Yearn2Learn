<template>
  <div
    class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset"
  >
    <!--MAIN SCREEN-->
    <!--The table grid divides the screen into three with the text editor in the middle-->
    <div class="row bg-light">
      <div class="col-3">
        <button
          class="btn btn-secondary btn-circle mt-3 ms-1 position-fixed"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#side_bar_left"
          @click="folderEditMode = false"
        >
          <i class="bi bi-list" />
        </button>
      </div>

      <div class="col-6 p-0">
        <!-- TEXT EDITOR -->
        <div class="row justify-content-center p-0 m-0 vh-100">
          <div class="p-0">
            <QuillEditor
              id="textEditor"
              ref="textEditor"
              v-model:content="textEditorData.content"
              class="bg-white border-top-0"
              theme="snow"
              toolbar="#fixed_toolbar"
              content-type="html"
              @text-change="autoSaveNoteChanges()"
            />
          </div>
        </div>

        <!-- TEXT EDITOR TOOLBAR -->
        <div
          v-show="currentNote"
          class="row border bg-light 
                bottom-toolbar fixed-bottom m-0 p-0"
        >
          <div class="col-3">
            <div class="fs-6 text-truncate ms-1 me-5 mt-1 pe-5">
              <span
                v-show="currentNote"
                class="align-middle"
              >{{ textEditorData.folderName }} / {{ textEditorData.noteTitle }}</span>
            </div>
          </div>

          <div
            id="fixed_toolbar"
            class="col-6 border-0 mx-auto"
          >
            <!-- Font size selector -->
            <select class="ql-size me-4">
              <option value="small" />
              <option selected />
              <option value="large" />
              <option value="huge" />
            </select>

            <!-- Common text modifiers -->
            <button class="ql-bold" />
            <button class="ql-italic" />
            <button class="ql-underline" />
            <button class="ql-strike" />
            <button
              class="ql-script"
              value="sub"
            />
            <button
              class="ql-script me-4"
              value="super"
            />

            <!-- Lists -->
            <button
              class="ql-list"
              value="bullet"
            />
            <button
              class="ql-list me-4"
              value="ordered"
            />

            <!-- Niche tools -->
            <button class="ql-blockquote" />
            <button class="ql-code-block" />
          </div>

          <div class="col-3">
            <div class="fs-6 text-truncate text-end me-1 ms-5 mt-1 se-5">
              <span
                v-show="currentNote"
                class="align-middle"
              > {{ saveStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--SIDEBAR-->
    <div
      id="side_bar_left"
      class="offcanvas offcanvas-start navbar-offset"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabindex="-1"
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
                data-bs-target="#side_bar_left"
                @click="closeFolderForm()"
              >
                <i class="bi bi-arrow-left" />
              </button>
            </div>

            <div class="col text-start align-middle pt-1">
              <strong>Folders</strong>
            </div>

            <div class="col text-end align-middle pt-1">
              <button
                id="editFolderButton"
                v-show="folderList.length"
                type="button"
                class="btn btn-edit-form py-0 px-1 ms-2"
                @click="toggleEditMode()"
              >
                <span v-show="folderEditMode">Finish Editing</span>
                <i
                  v-show="!folderEditMode"
                  class="bi bi-pencil-square"
                />
              </button>
            </div>
          </div>
        </h5>
      </div>

      <!--SIDEBAR BODY-->
      <div class="offcanvas-body">
        <!--ADD FOLDER FORM-->
        <div
          v-if="!folderEditMode"
          class="row p-0 m-0 mb-3"
        >
          <button
            class="btn"
            :class="folderFormInProgress ? 'btn-secondary' : 'btn-primary'"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#add_folder_form"
            @click="toggleFolderForm()"
          >
            <i
              :class="folderFormInProgress ? 'bi bi-x-lg' : 'bi bi-folder-plus'"
            />
            <span class="ms-2">{{
              folderFormInProgress ? "Cancel" : "Add New Folder"
            }}</span>
          </button>

          <div
            id="add_folder_form"
            class="collapse p-0 m-0"
          >
            <div class="card card-body sharp-top-border border-top-0 mb-2">
              <form @submit.prevent="addFolder">
                <div class="row mb-2">
                  <div class="col">
                    <small>Folder Name</small>
                    <input
                      id="folderName"
                      v-model="folderData.name"
                      type="text"
                      class="form-control"
                      placeholder="e.g. COMP 4350"
                      required
                    >
                  </div>
                </div>

                <div class="row mb-2">
                  <div class="col">
                    <div class="form-check form-switch">
                      <input
                        id="classToggle"
                        v-model="isAClass"
                        type="checkbox"
                        role="switch"
                        class="form-check-input"
                        @click="folderData.priority = &quot;&quot;"
                      >
                      <label
                        class="form-check-label"
                        for="classToggle"
                      >Does this folder represent a class?</label>
                    </div>
                  </div>
                </div>

                <div
                  v-if="isAClass"
                  class="row mb-2"
                >
                  <small>Priority</small>
                  <div class="col">
                    <select
                      id="folderPriority"
                      v-model="folderData.priority"
                      class="form-select"
                      required
                    >
                      <option
                        value
                        disabled
                      >
                        Select
                      </option>
                      <option :value="true">
                        Major Requirement
                      </option>
                      <option :value="false">
                        Elective
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <button
                      id="addFolderButton"
                      type="submit"
                      class="btn btn-primary w-100"
                    >
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
          v-show="!folderList.length && !folderFormInProgress"
          class="text-center text-muted px-5 py-4"
        >
          <i>No folders or notes to show. Click on the "Add New Folder" button to
            add a folder and write cotes under it.</i>
        </div>

        <!--COLLAPSIBLE FOLDER LIST-->
        <div
          v-show="!folderEditMode"
          class="accordion accordion-flush"
        >
          <div
            v-for="folder in folderList"
            :key="folder._id"
            class="accordion-item"
          >
            <h2 class="accordion-header">
              <button
                type="button"
                class="accordion-button collapsed"
                data-bs-toggle="collapse"
                :data-bs-target="'#folderID' + folder._id"
              >
                <strong class="text-truncate">{{ folder.name }}</strong>
              </button>
            </h2>

            <!--NOTES LIST FOR EACH FOLDER-->
            <div
              :id="'folderID' + folder._id"
              class="accordion-collapse collapse"
            >
              <div class="accordion-body pt-0 pb-0 ps-3 pe-0 fs-6 mb-2">
                <div class="list-group sharp-top-border">
                  <!--ADD NOTE FORM TRIGGER-->
                  <button
                    type="button"
                    class="list-group-item list-group-item-action ps-3 py-1 border-top-0"
                    data-bs-toggle="modal"
                    data-bs-target="#add_edit_note_form"
                    @click="passCurrentFolder(folder)"
                  >
                    <i class="bi bi-plus-lg me-1" /> Create new note
                  </button>

                  <div
                    v-for="note in [...folder.notes].sort((noteA, noteB) => {return new Date(noteB.updatedAt) - new Date(noteA.updatedAt)})"
                    :key="note._id"
                    class="list-group-item list-group-item-action ps-3 pe-2 py-1"
                    @click="openNotes(folder, note)"
                  >
                    <div class="row p-0">
                      <div class="col-10 text-start text-truncate">
                        <span class="align-middle">{{ note.title }}</span>
                      </div>

                      <div class="col-2 text-end align-middle">
                        <button
                          type="button"
                          class="btn btn-sm shadow-none note-menu"
                          data-bs-toggle="dropdown"
                          @mouseover="mouseOnMenu = true"
                          @mouseleave="mouseOnMenu = false"
                          @click="passCurrentNote(folder, note)"
                        >
                          <i class="bi bi-three-dots-vertical" />
                        </button>

                        <ul
                          class="dropdown-menu py-1"
                          @mouseover="mouseOnMenu = true"
                          @mouseleave="mouseOnMenu = false"
                        >
                          <li>
                            <a
                              class="dropdown-item px-2"
                              data-bs-toggle="modal"
                              data-bs-target="#add_edit_note_form"
                              @click="passCurrentNote(folder, note)"
                            >
                              Rename
                            </a>
                          </li>

                          <li><hr class="dropdown-divider my-1"></li>

                          <li>
                            <a
                              class="dropdown-item px-2 text-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_form"
                              @click="passCurrentNote(folder, note)"
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

        <!--EDIT FOLDER VIEW-->
        <div
          v-if="folderEditMode"
          id="folder_edit_form"
          class="accordion"
        >
          <div
            v-for="folder in folderList"
            :key="folder._id"
            class="accordion-item"
          >
            <h2 class="accordion-header">
              <button
                type="button"
                class="accordion-button d-inline-block accordion-edit collapsed bg-light"
              >
                <div class="row">
                  <div class="col-9 text-start align-middle text-truncate">
                    <strong>{{ folder.name }}</strong>
                  </div>

                  <div class="col-3 text-end align-middle">
                    <div
                      v-if="folderEditFormInProgress && currentFolder == folder"
                    >
                      <button
                        type="button"
                        class="btn btn-close"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#folderID' + folder._id + 'edit'"
                        @click="closeEditFolderForm()"
                      />
                    </div>

                    <div v-else>
                      <button
                        type="button"
                        class="btn btn-edit-form py-0 px-1 me-2"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#folderID' + folder._id + 'edit'"
                        @click="openEditFolderForm(folder)"
                      >
                        <i class="bi bi-pencil-square" />
                      </button>

                      <button
                        type="button"
                        class="btn btn-edit-form py-0 px-1"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_form"
                        @click="passCurrentFolder(folder)"
                      >
                        <i class="bi bi-trash3-fill text-danger" />
                      </button>
                    </div>
                  </div>
                </div>
              </button>
            </h2>

            <div
              v-if="currentEditingFolderId === folder._id"
              :id="'folderID' + folder._id + 'edit'"
              class="accordion-collapse collapse"
              :class="{'show': currentEditingFolderId === folder._id}"
              data-bs-parent="#folder_edit_form"
            >
              <div class="accordion-body px-3 py-2 fs-6 mb-2">
                <form @submit.prevent="editFolder()">
                  <div class="row mb-2">
                    <div class="col">
                      <small>Rename Folder</small>
                      <input
                        v-model="folderData.name"
                        type="text"
                        class="form-control"
                        placeholder="e.g. COMP 4350"
                        required
                      >
                    </div>
                  </div>

                  <div class="row">
                    <small>Change Priority</small>
                    <div class="col-9">
                      <select
                        v-model="folderData.priority"
                        class="form-select"
                        required
                      >
                        <option :value="true">
                          Major Requirement
                        </option>
                        <option :value="false">
                          Elective
                        </option>
                      </select>
                    </div>

                    <div class="col-3 ps-0">
                      <button
                        type="submit"
                        class="btn btn-success w-100"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#folderID' + folder._id + 'edit'"
                      >
                        <i class="bi bi-floppy-fill" />
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
    <div
      id="add_edit_note_form"
      class="modal modal-md fade"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <form @submit.prevent="currentNote ? renameNote() : addNote()">
              <div class="row">
                <div class="col-10 text-start text-truncate">
                  <span v-if="currentNote">Rename {{ currentNote.title }}</span>

                  <span v-else>Create new note for {{ currentFolder.name }}</span>
                </div>

                <div class="col-2 text-end">
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-group mb-2">
                  <input
                    id="noteTitle"
                    v-model="noteData.title"
                    type="text"
                    class="form-control"
                    placeholder="e.g. Midterm Notes"
                    required
                  >

                  <button
                    id="submitNoteButton"
                    type="submit"
                    class="btn"
                    :class="currentNote ? 'btn-success' : 'btn-secondary'"
                    @click="closeModal"
                  >
                    <i
                      :class="
                        currentNote ? 'bi bi-floppy-fill' : 'bi bi-check-lg'
                      "
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!--DELETE FOLDER/EDIT FORM-->
    <div
      id="delete_form"
      class="modal modal-md fade"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header px-2 py-1">
            <div class="modal-title fs-6">
              Confirm {{ folderEditMode ? "Folder" : "Note" }} Deletion
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div class="modal-body">
            <h6 class="text-center">
              Are you sure you want to delete the
              {{ folderEditMode ? "folder" : "note" }} named
              <div class="row justify-content-center p-0 my-2">
                <div class="col-9 text-truncate">
                  <strong>{{
                    folderEditMode
                      ? currentFolder.name
                      : currentNote.title
                  }}</strong>
                </div>
              </div>
              from your {{ folderEditMode ? "folders" : "note folder" }}?
              <br><br>
              <u>This {{ folderEditMode ? "will also delete all the Notes attached to it" : "is irreversible" }}!</u>
            </h6>

            <div class="row p-0 align-middle mt-3">
              <div class="col text-start">
                <button
                  class="btn btn-sm btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Keep
                </button>
              </div>

              <div class="col text-end">
                <button
                  class="btn btn-sm btn-danger ms-3"
                  data-bs-dismiss="modal"
                  @click="folderEditMode ? deleteFolder() : deleteNote()"

                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
// @ is an alias to /src
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";
import { ref, reactive, computed, onBeforeUnmount } from 'vue';
import { useCoreStore } from "@/store/core";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const coreStore = useCoreStore();

// Folder and note display variables
const currentFolder = ref("");
const currentNote = ref("");

// Folder form variables
const folderFormInProgress = ref(false);
const folderEditMode = ref(false);
const folderEditFormInProgress = ref(false);
const currentEditingFolderId = ref(null);
const mouseOnMenu = ref(false);
const isAClass = ref(false)

// Text editor variables
const textEditor = ref(); // Required by Vue Quill for data binding
const saveStatus = ref("");
const saveStatusTimeoutID = ref("");
const autoSaveTimeoutID = ref("");


const folderData = reactive({
	name: "",
	priority: ""
});

const noteData = reactive({
	title: "",
});

const textEditorData = reactive({
	folderName: "",
	noteTitle: "",
	content: ""
})

const folderList = computed(() => {
  return coreStore.folders;
})

async function addFolder(){
	// Add the new folder to the list
  const priority = isAClass.value? folderData.priority : null;

	await coreStore.addFolder(folderData.name, priority);

	// Reset important variables
	closeFolderForm();
}

async function editFolder(){
	if (!currentFolder.value) {
        console.error("No folder selected for editing.");
        return;
  }

  try{
    await coreStore.editFolder(currentFolder.value._id, folderData.name, folderData.priority);
    textEditorData.folderName = folderData.name;
  } finally{
    closeEditFolderForm();
  }
}

async function deleteFolder(){
	if (!currentFolder.value) {
		console.error("No folder ID provided for deletion.");
		return;
	}

	await coreStore.deleteFolder(currentFolder.value._id);

	// If the last folder is deleted, return to the Add New Folder state
	if (folderList.value.length === 0) {
		folderEditMode.value = false;
	}
}

async function toggleFolderForm(){
	folderFormInProgress.value = !folderFormInProgress.value;
	resetFolderData();
}

async function closeFolderForm(){
	// Only close the form if it is open in the first place
	if(folderFormInProgress.value){
		const form = document.querySelector("#add_folder_form");
		bootstrap.Collapse.getInstance(form).hide();

		folderFormInProgress.value = false;

		resetFolderData();
	}
}

async function openEditFolderForm(folder){
	// Close if clicking on the already opened form
	if (currentEditingFolderId.value === folder._id) {
        currentEditingFolderId.value = null; // Close the form
        return;
    }
	folderEditFormInProgress.value = true;
	currentEditingFolderId.value = folder._id;
	currentFolder.value = folder;
	folderData.name = folder.name;
	folderData.priority = folder.priority;
}

async function closeEditFolderForm(){
	folderEditFormInProgress.value = false;
	currentEditingFolderId.value = null;

	if(folderFormInProgress.value){
		folderFormInProgress.value = false;
	}
}

async function resetFolderData(){
	folderData.name = "";
	folderData.priority = ""
}

async function toggleEditMode(){
	if(folderList.value.length){
		folderEditMode.value = !folderEditMode.value;
	}

	if(folderEditMode.value){
		closeEditFolderForm();
	}
}

async function passCurrentFolder(folder){
	currentFolder.value = folder; // Allows modals to use the relevant data externally
	currentNote.value = ""; // Reset the currentNote since we are making a new folder

	resetNoteData(); // Clear the form to prepare for new input
}

async function addNote(){
	try {
		const newNote = await coreStore.addNote(currentFolder.value._id, noteData.title)
    // Update the text editor contents to the new note's
    openNotes(currentFolder.value, newNote)
	} finally {
		// Reset and close the form menu
    resetNoteData();
	}
}

async function renameNote(){
	if(currentNote.value.title !== noteData.title){
    try{
      currentNote.value.title = noteData.title;
      await saveNoteChanges(currentNote.value)

      textEditorData.folderName = currentFolder.value.name;
      textEditorData.noteTitle = noteData.title;
    } catch {
      return;
    }
	}
}

async function deleteNote(){
	if (!currentNote.value) {
		console.error("No note ID provided for deletion.");
		return;
	}

  await coreStore.deleteNote(currentNote.value._id);
}

async function passCurrentNote(folder, note){
  currentFolder.value = folder;
	currentNote.value = note;
  
	noteData.title = note.title;
}

async function resetNoteData(){
	noteData.title = "";
}

async function openNotes(folder, note) {
	// Do nothing if the mouse was inside the vertical menu button
	if (!mouseOnMenu.value) {
		// If moving to a new note, save the changes
		if (currentNote.value) {
			if (currentNote.value.content !== textEditorData.content) {
				await saveNoteChanges(currentNote.value);
			}
			currentNote.value.content = textEditorData.content;
		}

		// Update the data to be used by the text editor
		textEditorData.folderName = folder.name;
		textEditorData.noteTitle = note.title;
		textEditorData.content = note.content;

		// Allows us to save changes after switching files
		currentNote.value = note;
	}
}

async function saveNoteChanges(note) {
  await coreStore.editNote(note._id, note.title, textEditorData.content)
}

async function autoSaveNoteChanges() {
	try { 
    saveStatus.value = "Saving...";

    // Auto-save 1 second after changes are made
		clearTimeout(autoSaveTimeoutID.value);
    autoSaveTimeoutID.value = setTimeout(async () => {
      await saveNoteChanges(currentNote.value);
      saveStatus.value = "Saved!";
    }, 1000)

    // Let the user know changes have been saved for 5 seconds
    clearTimeout(saveStatusTimeoutID.value)
    saveStatusTimeoutID.value = setTimeout(async () => {
      if(autoSaveTimeoutID.value){
        saveStatus.value = "";
      }
    }, 5000)
	} catch (error) {
		console.error("Error updating note:", error.response?.data || error.message);
	}
}

async function closeModal(){
  if(noteData.title){
    const modal = document.querySelector("#add_edit_note_form");
		bootstrap.Modal.getOrCreateInstance(modal).hide();
  }
}

onBeforeUnmount(async () => {
	if (currentNote.value && textEditorData.content !== currentNote.value.content) {
		await saveNoteChanges(currentNote.value);
	}
});
</script>
