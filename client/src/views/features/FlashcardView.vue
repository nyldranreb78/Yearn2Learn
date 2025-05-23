<template>
  <div
    class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset pb-5"
  >
    <div class="row justify-content-md-center mt-4">
      <div class="col-10">
        <div class="row">
          <div class="col p-0">
            <h4 class="section-header ms-3">
              Flashcards
            </h4>
          </div>
        </div>

        <div class="row align-items-start mb-5">
          <button
            id="turn_left"
            type="button"
            class="col-auto btn btn-light flash-card-ui fs-4 text-muted"
            :disabled="!filteredList.length"
            @click="skipFlashcard(-1)"
          >
            <i class="bi bi-caret-left-fill" />
          </button>

          <button
            id="current_flashcard"
            class="col btn flash-card-ui text-center text-truncate"
            :class="showAnswer? 'btn-secondary' : 'btn-light flash-card'"
            title="Open the Question List to see the full text."
            :disabled="!filteredList.length"
            @click="flipCard"
            @mouseenter="showAltText = true"
            @mouseleave="showAltText = false"
          >
            <div
              v-if="filteredList.length"
              class="my-auto fs-4"
            >
              <span
                v-if="showAnswer"
                class="text-wrap text-break"
              >
                {{ showAltText? "Return to the question" : filteredList[flashcardIndex].answer }}
              </span>

              <span
                v-else
                class="text-wrap text-break"
              >
                {{ showAltText? "Click to reveal the answer" : filteredList[flashcardIndex].question }}
              </span>
            </div>

            <div
              v-else
              class="text-wrap text-break"
            >
              <i>Create a flashcard by clicking the "Create Flashcard" button on
                the right.</i>
            </div>
          </button>

          <button
            id="turn_right"
            type="button"
            class="col-auto btn btn-light flash-card-ui fs-4 text-muted"
            :disabled="!filteredList.length"
            @click="skipFlashcard(1)"
          >
            <i class="bi bi-caret-right-fill" />
          </button>

          <div
            class="col-3 card ms-3 py-2 overflow-auto"
            :class="showForm ? 'flash-card-ui' : ''"
          >
            <h6 class="border-bottom pb-2">
              {{
                showForm
                  ? isEditMode
                    ? "Edit"
                    : "Create New" + " Flashcard"
                  : "Flashcard Options"
              }}
            </h6>
            <div v-show="showForm">
              <form
                id="flashcard_form"
                class="row g-3"
                @submit.prevent="isEditMode ? editFlashcard() : addFlashcard()"
              >
                <div class="col-12 mt-2">
                  <label><small>Question</small></label>
                  <textarea
                    id="question_input"
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
                    id="answer_input"
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
                        v-model="flashcardData.setName"
                        class="form-select form-select-sm"
                        @change="setInput = ''"
                      >
                        <option value>
                          Select or create set
                        </option>
                        <option
                          v-for="setName in flashcardSetList"
                          :key="setName"
                        >
                          {{ setName }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  v-show="!flashcardData.setName || isEditMode"
                  class="col-12 mt-2"
                >
                  <input
                    id="new_flashcard_set"
                    v-model="setInput"
                    type="text"
                    class="form-control form-control-sm"
                    maxlength="50"
                    placeholder="New Flashcard Set Name"
                    :required="!flashcardData.setName"
                  >
                </div>

                <div class="col-auto mt-2 pe-1">
                  <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click="resetFlashcardData()"
                  >
                    Cancel
                  </button>
                </div>

                <div class="col mt-2 ps-1">
                  <button
                    id="create_or_save_changes"
                    type="submit"
                    form="flashcard_form"
                    class="btn btn-sm w-100"
                    :class="isEditMode ? 'btn-success' : 'btn-primary'"
                  >
                    <i
                      class="bi me-1"
                      :class="isEditMode ? 'bi-floppy-fill' : 'bi-plus-lg'"
                    />
                    {{ isEditMode ? "Save Changes" : "Create" }}
                  </button>
                </div>
              </form>
            </div>

            <div v-show="!showForm">
              <div class="row">
                <div class="col">
                  <label><small>Filter by Flashcard Set</small></label>
                  <select
                    v-model="setNameFilter"
                    class="form-select form-select-sm"
                  >
                    <option value>
                      All
                    </option>
                    <option
                      v-for="setName in flashcardSetList"
                      :key="setName"
                      :value="setName"
                    >
                      {{ setName }}
                    </option>
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
                  :class="showQuestionList ? 'btn-secondary' : 'btn-primary'"
                  @click="showQuestionList = !showQuestionList"
                >
                  <i
                    class="bi me-1"
                    :class="showQuestionList ? 'bi-eye-slash' : 'bi-eye'"
                  />
                  {{ showQuestionList ? "Hide Question List" : "Show Question List" }}
                </button>
              </div>

              <div
                v-show="flashcardList.length"
                class="col-12 mt-2"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-primary w-100"
                  @click="shuffleFlashcards()"
                >
                  <i class="bi bi-shuffle me-1" /> Shuffle Flashcards
                </button>
              </div>

              <div class="col-12 mt-2">
                <button
                  id="create_flashcard"
                  type="button"
                  class="btn btn-sm btn-primary w-100"
                  @click="showFlashcardForm"
                >
                  <i class="bi bi-plus-lg me-1" /> Create Flashcard
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col p-0">
            <h4 class="section-header ms-3">
              Question List
            </h4>
          </div>
        </div>

        <div
          v-if="filteredList.length"
          v-show="showQuestionList"
          id="card_list"
          class="row card mb-3 ms-4"
        >
          <div
            id="card_list"
            class="col"
          >
            <div
              v-for="flashcard in filteredList"
              id="card_list"
              :key="flashcard._id"
              class="row border-bottom p-2"
            >
              <div
                v-if="!isDeleteMode || flashcard !== currentFlashcard"
                id="card_list"
                class="col-3 border-end"
              >
                {{ flashcard.question }}
              </div>

              <div class="col">
                <div v-if="isDeleteMode && flashcard === currentFlashcard">
                  <small class="text-danger"><i>Are you sure you want to delete this question? This is
                    irreversible!</i></small>
                </div>

                <div v-else>
                  {{ flashcard.answer }}
                </div>
              </div>

              <div class="col-auto text-end pe-0">
                <button
                  v-show="!isDeleteMode || flashcard !== currentFlashcard"
                  type="button"
                  class="btn btn-sm shadow-none border-0 note-menu"
                  data-bs-toggle="dropdown"
                >
                  <i class="bi bi-three-dots-vertical" />
                </button>

                <ul class="dropdown-menu py-1">
                  <li>
                    <a
                      class="dropdown-item px-2"
                      @click="showEditForm(flashcard)"
                    >
                      Edit
                    </a>
                  </li>

                  <li><hr class="dropdown-divider my-1"></li>

                  <li>
                    <a
                      class="dropdown-item px-2 text-danger"
                      @click="showDeleteMode(flashcard)"
                    >
                      Delete
                    </a>
                  </li>
                </ul>

                <div v-show="isDeleteMode && flashcard === currentFlashcard">
                  <button
                    type="button"
                    class="btn btn-sm btn-secondary me-2"
                    @click="isDeleteMode = false"
                  >
                    Keep
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    @click="deleteFlashcard()"
                  >
                    Confirm Deletion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="row"
        >
          <div class="col text-center m-4">
            <i class="text-muted">There are no questions to show. Click on the "Create Flashcard" button to add one.</i>
          </div>
        </div>

        <div
          v-if="filteredList.length"
          v-show="!showQuestionList"
          class="row"
        >
          <div class="col text-center m-4">
            <button
              type="button"
              class="btn btn-link"
              @click="showQuestionList = true"
            >
              <i><b>The question list is hidden to avoid spoiling the answers. Click here or on the "Show Question List" button to view or edit them.</b></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, reactive, watch, computed, onBeforeMount } from "vue";
import { useCoreStore } from "@/store/core";

const coreStore = useCoreStore();

const showAnswer = ref(false);
const showAltText = ref(false);
const showQuestionList = ref(false);
const showForm = ref(false);

const isEditMode = ref(false);
const isDeleteMode = ref(false);
const isShuffleMode = ref(false);

const currentFlashcard = ref("");
const setNameFilter = ref("");
const flashcardIndex = ref(0);

const setInput = ref("");
const flashcardData = reactive({
  setName: "",
  question: "",
  answer: "",
});

watch(setInput, (newValue) => {
  if (newValue) {
    flashcardData.setName = "";
  }
});

watch(flashcardData, (newValue) => {
  if (newValue) {
    setNameFilter.value = newValue.setName;
  }
});

watch(setNameFilter, (newValue) => {
  if (newValue && filteredList.value.length) {
    flashcardIndex.value = 0;
  }
});

watch(flashcardIndex, (newValue) => {
  if (newValue) {
    if (newValue < 0) {
      flashcardIndex.value = filteredList.value.length - 1;
    } else {
      flashcardIndex.value = newValue % filteredList.value.length;
    }
  }
});

const flashcardList = computed(() => {
  return coreStore.flashcards;
});

// Find all the known setNames from all flashcards and put them in an array
// then make a Set out of it to essentially remove duplicates,
// then convert it to an array again
const flashcardSetList = computed(() => {
  return [...new Set(flashcardList.value.map((set) => set.setName))];
});

const filteredList = computed(() => {
  let list = [];

  if (setNameFilter.value) {
    list = flashcardList.value.filter((flashcard) => {
      return flashcard.setName === setNameFilter.value;
    });
  } else {
    list = flashcardList.value;
  }

  if (isShuffleMode.value) {
    list = list.sort(() => 0.5 - Math.random());
  }

  return list;
});

async function addFlashcard() {
  const newFlashcard = {
    setName: flashcardData.setName ? flashcardData.setName : setInput.value,
    question: flashcardData.question,
    answer: flashcardData.answer,
  };

  await coreStore.addFlashcard(newFlashcard);

  resetFlashcardData();
  currentFlashcard.value = newFlashcard;
  showQuestionList.value = true;
}

async function editFlashcard() {
  const updatedFlashcard = {
    setName: flashcardData.setName ? flashcardData.setName : setInput.value,
    question: flashcardData.question,
    answer: flashcardData.answer,
  };

  await coreStore.editFlashcard(currentFlashcard.value._id, updatedFlashcard);

  resetFlashcardData();
  currentFlashcard.value = updatedFlashcard;
}

async function deleteFlashcard() {
  await coreStore.deleteFlashcard(currentFlashcard.value._id);

  if(setNameFilter.value === currentFlashcard.value.setName) {
    setNameFilter.value = "";
  }

  resetFlashcardData();
}

async function showEditForm(flashcard) {
  currentFlashcard.value = flashcard;

  setInput.value = "";
  flashcardData.setName = currentFlashcard.value.setName;
  flashcardData.question = currentFlashcard.value.question;
  flashcardData.answer = currentFlashcard.value.answer;

  showForm.value = true;
  isEditMode.value = true;
  isDeleteMode.value = false;

  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

async function showDeleteMode(flashcard) {
  resetFlashcardData();

  currentFlashcard.value = flashcard;
  isDeleteMode.value = true;
}

async function resetFlashcardData() {
  setInput.value = "";

  flashcardData.setName = "";
  flashcardData.question = "";
  flashcardData.answer = "";

  showForm.value = false;
  isEditMode.value = false;
  isDeleteMode.value = false;
}

async function skipFlashcard(numSkipped) {
  flashcardIndex.value += numSkipped;
  showAnswer.value = false;
}

// Trigger the shuffle logic in the filteredList (computed) logic
// Flipping the values twice allows it to be "noticed" by the
// computed function
async function shuffleFlashcards() {
  isShuffleMode.value = false;
  isShuffleMode.value = true;
}

async function showFlashcardForm() {
  showForm.value = true;
  showQuestionList.value = true;

  if(setNameFilter.value) {
    flashcardData.setName = setNameFilter.value;
  }
}

async function flipCard() {
  showAnswer.value = !showAnswer.value
  showAltText.value = false;
}

onBeforeMount(() => {
  useCoreStore().fetchFlashcards();

  if (coreStore.currentFlashcardSet) {
    setNameFilter.value = coreStore.currentFlashcardSet;
    coreStore.resetCurrentData();
  }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap");

.section-header {
  font-family: "Libre Baskerville", sans-serif;
  margin-bottom: 10px;
}

.flash-card-ui {
  height: 400px;
}

.flash-card {
  background-color: white;
  border-color: #d2d2d2 !important;
}
</style>
