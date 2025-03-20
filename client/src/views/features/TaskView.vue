<template>
	<div class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset">
		<div class="row justify-content-md-center mt-4">
			<div class="col-8">
				<div class="row">
                    <div class="col-9 pe-3">
                        <div class="row">
                            <div class="col text-start">
                                <h4>Task List</h4>
                            </div>

                            <div class="col text-end pe-0">
                                <div
                                    type="button"
                                    class="btn btn-sm btn-secondary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_edit_task_form"
                                    v-on:click="resetTaskData"
                                >
                                    New Task
                                </div>
                            </div>
                        </div>
                        
                        <div class="row pb-1 border-bottom border-secondary">
                            <div class="col-4"><b>Task</b></div>
                            <div class="col-3"><b>Linked Class</b></div>
                            <div class="col-3"><b>Deadline</b></div>
                            <div class="col-2"><b>Status</b></div>
                        </div>

                        <div class="row" v-show="!taskList.length">
                            <div class="col text-center m-4">
                                <i class="text-muted">There are no tasks to show. Click on the "New Task" button to add one.</i>
                            </div>
                        </div>

                        <div class="row" v-for="task in taskList" v-bind:key="task._id">
                            <button type="button" class="btn btn-light text-start" v-on:click="currentTask = task">
                                <div class="row">
                                    <div class="col-4 text-truncate">{{ task.name }}</div>
                                    <div class="col-3 text-truncate">{{ task.folderID? getClassName(task.folderID) : "" }}</div>
                                    <div class="col-3">{{ task.deadline? new Date(task.deadline).toLocaleString() : "" }}</div>
                                    <div class="col-2" :class="task.isFinished? 'text-success' : 'text-primary'"><b>{{ getTaskStatus(task.isFinished) }}</b></div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div class="col-3 bg-transparent">
                        <div class="card">
                            <div class="card-header pe-2">
                                <div class="row">
                                    <div class="col text-start mt-1">
                                        Task Details
                                    </div>

                                    <div class="col-auto text-end" v-show="currentTask">
                                        <button
                                            type="button"
                                            class="btn btn-sm shadow-none border-0 note-menu"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>

                                        <ul class="dropdown-menu py-1">
                                            <li>
                                                <a class="dropdown-item px-2" v-on:click="changeStatus(!currentTask.isFinished)">
                                                    Mark As "<span :class="currentTask.isFinished? 'text-primary' : 'text-success'"><b>{{ currentTask.isFinished? 'In Progress' : 'Finished' }}</b></span>"
                                                </a>
                                            </li>

                                            <li>
                                                <a
                                                    class="dropdown-item px-2"
                                                    v-on:click="prefillEditForm()"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#add_edit_task_form"
                                                >
                                                    Edit Details
                                                </a>
                                            </li>

                                            <li><hr class="dropdown-divider my-1" /></li>

                                            <li>
                                                <a
                                                class="dropdown-item px-2 text-danger"
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

                            <div class="card-body">
                                <div class="text-muted text-center" v-if="!currentTask">
                                    <i>Click on a task to view its detailed information.</i>
                                </div>

                                <div v-else>
                                    <div><b><small>Name:</small></b><br>{{ currentTask.name }}</div>
                                    <div v-if="currentTask.deadline"><b><small>Deadline:</small></b><br>{{ new Date(currentTask.deadline).toLocaleString() }}</div>
                                    <div v-if="currentTask.folderID"><b><small>For Class:</small></b><br>{{ getClassName(currentTask.folderID) }}</div>
                                    <div v-if="currentTask.taskGrade > 0"><b><small>Final Grade Weight:</small></b><br>{{ currentTask.taskGrade }}%</div>
                                    <div v-if="currentTask.actualGrade > 0"><b><small>Score Received:</small></b><br>{{ currentTask.actualGrade + ' / ' + currentTask.taskGrade }}%</div>
                                    <div>
                                        <b><small>Status:</small></b><br>
                                        <span :class="currentTask.isFinished? 'text-success' : 'text-primary'"><b>{{ getTaskStatus(currentTask.isFinished) }}</b></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		</div>
	</div>

    <div class="modal fade" id="add_edit_task_form" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">
                        {{ isEditMode? "Edit" : "Create New" }} Task/Goal
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" v-on:click="resetTaskData()"></button>
                </div>
                <div class="modal-body text-start">
                    <form class="row g-3" id="task_form" @submit.prevent="isEditMode? editTask() : addTask()">
                        <div class="col-12">
                            <label class="form-label">Task Name</label>
                            <input type="text" class="form-control" v-model="taskData.name" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Deadline</label>
                            <input class="form-control" type="datetime-local" v-model="taskData.deadline" required/>
                        </div>
                        <div class="col-12">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" v-model="isForClass" v-on:click="resetClass">
                                <label class="form-check-label">Is this for a class?</label>
                            </div>
                        </div>
                        <div class="col-12" v-show="isForClass">
                            <div class="card bg-transparent p-3">
                                <div class="row">
                                    <div class="col">
                                        <label class="form-label">Class</label>
                                        <select class="form-select" v-model="taskData.folderID" v-on:change="resetWeight">
                                            <option :value="null">None</option>
                                            <option v-for="folder in classList" v-bind:key="folder._id" :value="folder._id">
                                                {{ folder.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row mt-2" v-show="taskData.folderID != null">
                                    <div class="col-6">
                                        <label class="form-label">Grade weight in % <small class="text-muted">(optional)</small></label>
                                        <input type="number" class="form-control" min="0" max="100" v-model="taskData.taskGrade">
                                    </div>

                                    <div class="col-6">
                                        <label class="form-label">Grade received <small class="text-muted">(if applicable)</small></label>
                                        <div class="row">
                                            <div class="col">
                                                <input type="number" class="form-control" min="0" :max="taskData.taskGrade" v-model="taskData.actualGrade" :disabled="!taskData.taskGrade">
                                            </div>

                                            <div class="col-auto ps-0 my-1">
                                                <span class="align-middle" v-show="taskData.taskGrade">/ {{ taskData.taskGrade }}%</span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="resetTaskData()">Cancel</button>
                    <button id="task_submit" type="submit" class="btn" :class="isEditMode? 'btn-success' : 'btn-primary'" form="task_form" v-on:click="closeModal()">
                        {{ isEditMode? "Save Changes" : "Create" }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!--DELETE FOLDER/EDIT FORM-->
    <div class="modal modal-md fade" id="delete_form" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header px-2 py-1">
            <div class="modal-title fs-6">
              Confirm Task Deletion
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <h6 class="text-center">
              Are you sure you want to delete the
              
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
                  v-on:click="deleteTask()"
                  data-bs-dismiss="modal"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>


<script setup>
import { ref, reactive, watch, computed } from 'vue'; // reactive, computed, onMounted, onBeforeUnmount
import { useCoreStore } from '@/store/core';
import { onBeforeMount } from 'vue';
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";

const coreStore = useCoreStore();
const currentTask = ref("")

const isEditMode = ref(false)
const isForClass = ref(false)

onBeforeMount ( async () => {
	await useCoreStore().fetchTasks();
})

const taskData = reactive({
    name: "",
    deadline: null,
    folderID: null,
    taskGrade: null,
    actualGrade: null
})

// Enforce that (a) the grade received (actualGrade) is always lower than the taskGrade
// and (b) a taskGrade of 0 is equivalent to it not having weight at all
watch(taskData, (newValue) => {
    if (newValue) {
        if(newValue.taskGrade < taskData.actualGrade){
            taskData.actualGrade = newValue.taskGrade;
        }

        if(newValue.taskGrade == 0){
            taskData.taskGrade = null;
            taskData.actualGrade = null;
        }

        if(taskData.deadline){
            // HTML's datetime-local only uses the first 16 characters
            // of a local date string, which is why this is hard-coded
            taskData.deadline = taskData.deadline.substring(0, 16)
        }
    }
})

const taskList = computed(() => {
  return coreStore.tasks;
})

const classList = computed(() => {
  return coreStore.folders.filter((folder) => {
    return folder.priority != null;
  });
})

function getTaskStatus(isFinished){
  return isFinished? 'Finished' : 'In Progress'
}

function getClassName(folderID){
    return classList.value.find((folder) => folder._id === folderID).name;
}

async function addTask(){
    const newTask = {
        name: taskData.name,
        deadline: taskData.deadline,
        folderID: taskData.folderID,
        taskGrade: taskData.taskGrade,
        actualGrade: taskData.actualGrade,
        isFinished: false
    };

    await coreStore.addTask(newTask);

    resetTaskData();
    currentTask.value = newTask;
}

async function editTask(){
    const updatedTask = {
        name: taskData.name,
        deadline: taskData.deadline,
        folderID: taskData.folderID,
        taskGrade: taskData.taskGrade,
        actualGrade: taskData.actualGrade,
        isFinished: currentTask.value.isFinished
    };
    await coreStore.editTask(currentTask.value._id, updatedTask);

    resetTaskData();
    currentTask.value = updatedTask;
}

async function deleteTask(){
    await coreStore.deleteTask(currentTask.value._id);

    currentTask.value = taskList.value.length? taskList.value[0] : "";
}

async function changeStatus(newStatus){
    const updatedTask = {
        isFinished: newStatus
    }

    if(newStatus != currentTask.value.isFinished){
        await coreStore.editTask(currentTask.value._id, updatedTask);
    }

    currentTask.value.isFinished = newStatus;
}

async function prefillEditForm() {
    isEditMode.value = true;

    taskData.name = currentTask.value.name;
    taskData.deadline = currentTask.value.deadline;
    taskData.folderID = currentTask.value.folderID;
    taskData.taskGrade = currentTask.value.taskGrade;
    taskData.actualGrade = currentTask.value.actualGrade;

    if(taskData.folderID){
        isForClass.value = true;
    }
}

async function resetTaskData() {
    taskData.name = "";
    taskData.deadline = null;
    taskData.folderID = null;
    taskData.taskGrade = null;
    taskData.actualGrade = null;

    isForClass.value = false;
    isEditMode.value = false;
}

async function resetClass(){
    taskData.folderID = null;
}

async function resetWeight(){
    taskData.taskGrade = null;
    taskData.actualGrade = null;
}

async function closeModal(){
  if(taskData.name && taskData.deadline){
    const modal = document.querySelector("#add_edit_task_form");
	bootstrap.Modal.getOrCreateInstance(modal).hide();
  }
}
</script>