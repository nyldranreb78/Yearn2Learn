<template>
  <div
    class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset"
  >
    <!-- Edit and Self-quiz buttons -->
    <div
      class="flashcard-buttons d-flex align-items-center justify-content-start mt-3 ms-1"
    >
      <button
        class="btn btn-primary btn-circle me-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#side_bar_left"
        v-on:click="editMode = false"
      >
        Edit
      </button>
      <button
        class="btn btn-primary btn-circle"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#side_bar_left"
        v-on:click="quizMode = false"
      >
        Self-quiz
      </button>
    </div>

    <!-- Flashcard Main Screen -->
    <div class="row mt-3 gx-3">
      <!-- Flashcards Box -->
      <div class="col-md-6">
        <div class="flashcard-list-box d-flex flex-column">
          <p>List of Flashcards here</p>

          <div class="box-bottom mt-auto">
            <button
              class="btn btn-primary btn-circle me-2"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#side_bar_left"
              v-on:click="createMode = false"
            >
              Create New Card
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- Self Quiz Box -->
        <div class="self-quiz-box mb-3">
          <p>Sample question here</p>
        </div>

        <!-- Questions Box -->
        <div class="question-list-box">
          <p>List of Questions here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js"></script>

<style>
.flashcard-list-box {
  /* height: 765px; */
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.box-bottom {
  bottom: 0;
}

.self-quiz-box,
.question-list-box {
  /* height: 367px; */
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
