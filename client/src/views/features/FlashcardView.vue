<template>
  <div
    class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset"
  >
    <div class="row justify-content-md-center mt-4">
      <div class="col-6">
        <div class="row">
          <div class="col p-0">
            <h4>Flashcards</h4>
          </div>
        </div>

        <div class="row align-items-start">
          <button
            type="button"
            class="col-auto btn btn-light flash-card-ui fs-4 text-muted"
          >
            <i class="bi bi-caret-left-fill" />
          </button>

          <button
            class="col btn btn-light flash-card flash-card-ui border text-center"
            @mouseenter="showAltText = true"
            @mouseleave="showAltText = false"
            @click="showAnswer = !showAnswer"
          >
            <div class="my-auto">
              <h4 v-if="showAnswer">
                {{ showAltText? 'Click here to see the question' : "Testing question" }}
              </h4>
              <h4 v-else>
                {{ showAltText? 'Click here to reveal the answer' : "Testing question" }}
              </h4>
            </div>
          </button>

          <button
            type="button"
            class="col-auto btn btn-light flash-card-ui fs-4 text-muted"
          >
            <i class="bi bi-caret-right-fill" />
          </button>

          <div
            class="col-3 card ms-3 py-2"
            :class="showForm? 'flash-card-ui' : ''"
          >
            <h6 class="border-bottom pb-2">
              {{ showForm? isEditMode? 'Edit' : 'Create New' + ' Flashcard' : 'Flashcard Options' }}
            </h6>
            <div v-show="showForm">
              <form
                id="flashcard_form"
                class="row g-3"
                @submit.prevent="isEditMode? editFlashcard() : addFlashcard()"
              >
                <div class="col-12 mt-2">
                  <label><small>Question</small></label>
                  <textarea
                    v-model="flashcardData.question"
                    rows="2"
                    type="text"
                    class="form-control form-control-sm"
                    required
                  />
                </div>

                <div class="col-12 mt-2">
                  <label><small>Answer</small></label>
                  <textarea
                    v-model="flashcardData.answer"
                    rows="3"
                    type="text"
                    class="form-control form-control-sm"
                    required
                  />
                </div>

                <div class="col-12">
                  <div class="col border-bottom" />
                </div>

                <div class="col-12 mt-2">
                  <div class="row">
                    <div class="col">
                      <label><small>Flashcard Set</small></label>
                      <select
                        v-model="flashcardData.set"
                        class="form-select form-select-sm"
                        @change="setInput = ''"
                      >
                        <option value>
                          Select or create set
                        </option>
                        <option
                          v-for="x in [1,2,3,4,5,6]"
                          :key="x"
                        >
                          {{ 'Flashcard Set #' + x }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  v-show="!flashcardData.set"
                  class="col-12 mt-2"
                >
                  <input
                    v-model="setInput"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="New Flashcard Set Name"
                    :required="!flashcardData.set"
                  >
                </div>
              </form>
            </div>

            <div v-show="!showForm">
              <div class="row">
                <div class="col">
                  <label><small>Filter by Flashcard Set</small></label>
                  <select class="form-select form-select-sm">
                    <option>Folder 1</option>
                    <option>Folder 2</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              v-show="!showForm"
              class="row mt-auto"
            >
              <div
                v-show="flashcardList.length"
                class="col-12 mt-2"
              >
                <button
                  type="button"
                  class="btn btn-sm w-100"
                  :class="showQuestionList? 'btn-secondary' : 'btn-primary'"
                  @click="showQuestionList = !showQuestionList"
                >
                  <i
                    class="bi me-1"
                    :class="showQuestionList? 'bi-eye-slash' : 'bi-eye'"
                  />
                  {{ showQuestionList? 'Hide List' : 'Show Full List' }}
                </button>
              </div>

              <div
                v-show="flashcardList.length"
                class="col-12 mt-2"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-primary w-100"
                >
                  <i class="bi bi-shuffle me-1" /> Shuffle Flashcards
                </button>
              </div>

              <div class="col-12 mt-2">
                <button
                  type="button"
                  class="btn btn-sm btn-primary w-100"
                  @click="showForm = true"
                >
                  <i class="bi bi-plus-lg me-1" /> Create Flashcard
                </button>
              </div>
            </div>

            <div
              v-show="showForm"
              class="row mt-auto"
            >
              <div class="col-auto pe-1">
                <button
                  type="button"
                  class="btn btn-sm btn-secondary"
                  @click="resetFlashcardData()"
                >
                  Cancel
                </button>
              </div>

              <div class="col ps-0">
                <button
                  type="submit"
                  form="flashcard_form"
                  class="btn btn-sm w-100"
                  :class="isEditMode? 'btn-success' : 'btn-primary'"
                >
                  <i
                    class="bi me-1"
                    :class="isEditMode? 'bi-floppy-fill' : 'bi-plus-lg'"
                  />
                  {{ isEditMode? 'Save Changes' : 'Create' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-show="showQuestionList"
          class="row mt-3"
        >
          <div class="col p-0">
            <h4>Question List</h4>
          </div>
        </div>

        <div
          v-show="!flashcardList.length"
          class="row"
        >
          <div class="col text-center m-4">
            <i class="text-muted">There are no questions to show. Click on the "Create Flashcard" button to add one.</i>
          </div>
        </div>

        <div
          v-show="showQuestionList && flashcardList.length"
          class="row card"
        >
          <div class="col">
            <div
              v-for="flashcard in flashcardList"
              :key="flashcard._id"
              class="row border-bottom p-2"
            >
              <div class="col-3">
                {{ flashcard.question }}
              </div>

              <div class="col border-start">
                {{ flashcard.answer }}
              </div>

              <div class="col-auto text-end pe-0">
                <button
                  type="button"
                  class="btn btn-sm shadow-none border-0 note-menu"
                  data-bs-toggle="dropdown"
                  @click="currentFlashcard = flashcard"
                >
                  <i class="bi bi-three-dots-vertical" />
                </button>

                <ul class="dropdown-menu py-1">
                  <li>
                    <a
                      class="dropdown-item px-2"
                      @click="showEditForm()"
                    >
                      Edit
                    </a>
                  </li>

                  <li><hr class="dropdown-divider my-1"></li>

                  <li>
                    <a
                      class="dropdown-item px-2 text-danger"
                      @click="deleteFlashcard()"
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
</template>

<script setup lang="js">
import { ref, reactive, computed } from 'vue';
import { useCoreStore } from '@/store/core';

const coreStore = useCoreStore();

//const flashcardIndex = ref(0);
const showAnswer = ref(false);
const showAltText = ref(false);
const showQuestionList = ref(true);
const showForm = ref(false);
const isEditMode = ref(false);

const currentFlashcard = ref("");

const setInput = ref("")
const flashcardData = reactive({
  set: "",
  question: "",
  answer: ""
});

const flashcardList = computed(() => {
  return coreStore.flashcards;
})

async function addFlashcard(){
    const newFlashcard = {
      _id: Date.now(), // TODO: REMOVE ONCE WE'RE USING THE DB
      // Date.now() JUST GIVES US A "UNIQUE ID" FOR TESTING PURPOSES

      set: flashcardData.set? flashcardData.set : setInput.value,
      question: flashcardData.question,
      answer: flashcardData.answer
    };

    await coreStore.addFlashcard(newFlashcard);

    resetFlashcardData();
    currentFlashcard.value = newFlashcard;
}

async function editFlashcard(){
    const updatedFlashcard = {
      set: flashcardData.set? flashcardData.set : setInput.value,
      question: flashcardData.question,
      answer: flashcardData.answer
    };

    await coreStore.editFlashcard(currentFlashcard.value._id, updatedFlashcard);

    resetFlashcardData();
    currentFlashcard.value = updatedFlashcard;
}

async function deleteFlashcard(){
    await coreStore.deleteFlashcard(currentFlashcard.value._id);

    currentFlashcard.value = flashcardList.value.length? flashcardList.value[0] : "";
}

async function showEditForm(){
  setInput.value = "";
  flashcardData.set = currentFlashcard.value.set;
  flashcardData.question = currentFlashcard.value.question;
  flashcardData.answer = currentFlashcard.value.answer;

  showForm.value = true;
  isEditMode.value = true;

  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

async function resetFlashcardData() {
  setInput.value = "";
  flashcardData.set = "";
  flashcardData.question = "";
  flashcardData.answer = "";

  showForm.value = false;
  isEditMode.value = false;
}
</script>

<style>
.flash-card-ui{
  height: 400px;
}

.flash-card{
  background-color: white;
  border-color: #d2d2d2 !important;
}
</style>
