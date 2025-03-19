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

        <div class="row">
          <button type="button" class="col-auto btn btn-light">
            <i class="bi bi-caret-left-fill"></i>
          </button>

          <button
            class="col-8 btn btn-light flash-card border text-center"
            v-on:mouseenter="showAltText = true"
            v-on:mouseleave="showAltText = false"
            v-on:click="showAnswer = !showAnswer"
          >
            <div class="my-auto">
              <h4 v-if="showAnswer">{{ showAltText? 'Click here to see the question' : "Testing question" }}</h4>
              <h4 v-else>{{ showAltText? 'Click here to reveal the answer' : "Testing question" }}</h4>
            </div>
          </button>

          <button type="button" class="col-auto btn btn-light">
            <i class="bi bi-caret-right-fill"></i>
          </button>

          <div class="col card ms-3 py-2">
            <h6>Filter Flashcards</h6>
            <div class="row">
              <div class="col">
                <label><small>Linked Folder</small></label>
                <select class="form-select mb-2">
                  <option>Folder 1</option>
                  <option>Folder 2</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <label><small>Collection Name</small></label>
                <select class="form-select">
                  <option>Folder 1</option>
                  <option>Folder 2</option>
                </select>
              </div>
            </div>

            <div class="row mt-auto">
              <div class="col">
                <button type="button" class="btn w-100" :class="showQuestionList? 'btn-secondary' : 'btn-primary'" v-on:click="showQuestionList = !showQuestionList">
                  <i class="bi me-1" :class="showQuestionList? 'bi-eye-slash' : 'bi-eye'"></i>
                  {{showQuestionList? 'Hide List' : 'Show Full List' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-3" v-show="showQuestionList">
          <div class="col p-0">
            <h4>Question List</h4>
          </div>
        </div>

        <div class="row card" v-show="showQuestionList">
          <div class="col">
            <div class="row border-bottom p-2">
              <div class="col-3">
                Test Question
              </div>

              <div class="col-9 border-start">
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';

const showAnswer = ref(false);
const showAltText = ref(false);
const showQuestionList = ref(false);

</script>

<style>
.flash-card{
  height: 300px;
  background-color: white;
  border-color: #d2d2d2 !important;
}
</style>
