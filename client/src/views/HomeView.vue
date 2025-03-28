<template>
  <div
    class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset"
  >
    <div class="row mt-4 justify-content-md-center">
      <div class="col-8">
        <div class="row">
          <div class="col ps-0">
            <h2 class="welcome-container">
              Welcome, {{ user.username }}!
            </h2>

            <p class="quote-text">
              {{ randomQuote }}
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col ps-0">
            <h4 class="section-header">
              Features
            </h4>
            <div class="row row-cols-2 g-3">
              <div
                v-for="feature in featureInfo"
                :key="feature[2]"
                class="col"
              >
                <FeatureCard
                  :bootstrap-icon-code="feature[0]"
                  :feature-name="feature[1]"
                  :route-name="feature[2]"
                  :description="feature[3]"
                  @click="feature[2] ? null : showTimer('false')"
                  @mouseleave="feature[2] ? null : showTimer('outside')"
                />
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <h4 class="section-header">
              Upcoming Tasks
            </h4>
            <div class="task-scroll card p-3">
              <div class="row">
                <div
                  v-if="!taskList.length"
                  class="text-muted text-center"
                >
                  <i>No Upcoming Tasks!</i>
                </div>
                <div
                  v-for="task in taskList"
                  :key="task._id"
                  class="col-12 mb-3"
                  @mouseenter="coreStore.setTask(task)"
                >
                  <FeatureCard
                    :bootstrap-icon-code="''"
                    :feature-name="new Date(task.deadline).toLocaleString()"
                    :route-name="'tasks'"
                    :description="task.name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col-12">
            <h4 class="section-header">
              Quick Access
            </h4>
             
            <div class="row mb-2 pe-2">
              <div class="col-auto">
                <h6><i class="bi bi-journal-text me-1" /> Recent Notes</h6>
              </div>
              <div class="col border-bottom border-card mb-3 w-100" />
            </div>

            <div
              v-if="!noteList.length"
              class="text-muted text-center"
            >
              <i>There are no Notes to show. Visit the Notes page to write
                some!</i>
            </div>

            <div class="row mb-5">
              <div
                v-for="note in noteList"
                :key="note._id"
                class="col-md-6 col-lg-4"
                @mouseenter="coreStore.setNote(note)"
              >
                <FeatureCard
                  :bootstrap-icon-code="''"
                  :feature-name="note.title"
                  :route-name="'notes'"
                  :description="
                    'Last edited on ' +
                      new Date(note.updatedAt).toLocaleString()
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-2 pe-2">
          <div class="col-auto">
            <h6><i class="bi bi-card-heading me-1" /> Flash Card Sets</h6>
          </div>
          <div class="w-100 col border-bottom border-card mb-3" />
        </div>

        <div
          v-if="!flashcardSetList.length"
          class="text-muted text-center"
        >
          <i>There are no Flashcard Sets to show. Visit the Flashcards page
            to create some!</i>
        </div>

        <div class="row mb-5">
          <div
            v-for="set in flashcardSetList"
            :key="set"
            class="col-2"
            @mouseenter="coreStore.setFlashcardSet(set)"
          >
            <FeatureCard
              :bootstrap-icon-code="''"
              :route-name="'flashcards'"
              :description="set"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FeatureCard from "@/components/FeatureCard.vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";
import { useCoreStore } from "@/store/core";
import { ref, onMounted, computed, onBeforeMount } from "vue"; // reactive, computed, onMounted,

const coreStore = useCoreStore();
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();

const user = computed(() => {
  return authStore.userDetail;
});

const noteDesc = "Write and edit your notes, organized by folders.";
const flashcardDesc =
  "Create your own set of Q&A cards and test yourself with them.";
const goalDesc = "Keep track of your tasks, goals, and grade progress.";
const timerDesc = "Choose between a generic or Pomodoro Method timer.";

const featureInfo = [
  // [Bootstrap Icon Code, Feature Name, Vue Route]
  ["journal-text", "Notes", "notes", noteDesc],
  ["card-heading", "Flashcards", "flashcards", flashcardDesc],
  ["calendar2-check", "Task Management", "tasks", goalDesc], // TODO: change this later
  ["stopwatch", "Timer", null, timerDesc],
];

const noteList = computed(() => {
  // Find all folders
  const folders = coreStore.folders;
  let notes = [];

  // Find all notes in each folder
  for (let i in folders) {
    notes.push.apply(notes, folders[i].notes);
  }

  // Sort all notes by date (descending)
  notes = notes.sort((noteA, noteB) => {
    return new Date(noteB.updatedAt) - new Date(noteA.updatedAt);
  });

  // Return the latest 8 notes
  return notes.slice(0, Math.min(8, notes.length));
});

const taskList = computed(() => {
  const tasks = coreStore.tasks;

  return tasks
    .filter((task) => {
      return task.taskGrade != null;
    })
    .slice(0, Math.min(4, tasks.length));
});

const flashcardSetList = computed(() => {
  const flashcards = [
    ...new Set(coreStore.flashcards.map((set) => set.setName)),
  ];

  return flashcards.slice(0, Math.min(6, flashcards.length));
});

async function showTimer(autoCloseAttribute) {
  const timerMenu = document.querySelector("#timerFeature");
  timerMenu.setAttribute("data-bs-auto-close", autoCloseAttribute);

  const dropdown = new bootstrap.Dropdown(timerMenu);
  if (autoCloseAttribute === "false") {
    dropdown.show();
  }
}

const quotes = [
  "Believe in yourself and all that you are.",
  "You are capable of amazing things!",
  "Every day is a new beginning.",
  "You’ve got this! Keep pushing forward.",
  "Great things take time, keep going!",
  "Small steps each day lead to big results.",
  "Dream big, work hard, stay focused."
];

const randomQuote = ref("");

onMounted(() => {
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
});

onBeforeMount(() => {
  useCoreStore().fetchData();
  useCoreStore().fetchFlashcards();
  useCoreStore().fetchTasks();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap");

.welcome-container {
  font-family: "Libre Baskerville", sans-serif;
  color: #213e53;
  margin-left: -20px;
}
.section-header {
  font-family: "Libre Baskerville", sans-serif;
  white-space: nowrap;
}

.quote-text {
  font-style: italic;
  text-align: center;
  margin: 20px 0 50px;
}

/* Adjust card width for Quick Access */
@media (min-width: 768px) {
  .col-md-6 {
    max-width: 50% !important;
  }
}

@media (min-width: 992px) {
  .col-lg-4 {
    max-width: 33.33% !important;
  }
}

.border-card {
  border-color: #d2d2d2 !important;
  border-width: 2px !important;
}

@media (max-width: 768px) {
  .border-card {
    border-width: 1px !important; 
  }
}
</style>
