<template>
  <div
    class="container-fluid text-start d-flex flex-column navbar-offset vh-navbar-offset"
  >
    <div class="row justify-content-md-center mt-4">
      <div class="col-8">
        <div class="row">
          <!--Task List-->
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
                  @click="resetTaskData"
                >
                  New Task
                </div>
              </div>
            </div>

            <div class="row pb-1 border-bottom border-secondary">
              <div class="col-4">
                <b>Task</b>
              </div>
              <div class="col-3">
                <b>Linked Class</b>
              </div>
              <div class="col-3">
                <b>Deadline</b>
              </div>
              <div class="col-2">
                <b>Status</b>
              </div>
            </div>

            <div
              v-show="!taskList.length"
              class="row"
            >
              <div class="col text-center m-4">
                <i class="text-muted">There are no tasks to show. Click on the "New Task" button to
                  add one.</i>
              </div>
            </div>

            <div
              v-for="task in taskList"
              :key="task?._id"
              class="row"
            >
              <button
                type="button"
                class="btn text-start"
                :class="
                  task?._id === priorityTask?._id
                    ? 'btn-warning shadow-none'
                    : 'btn-light'
                "
                @click="currentTask = task"
              >
                <div class="row">
                  <div class="col-4 text-truncate">
                    {{ task.name }}
                  </div>
                  <div class="col-3 text-truncate">
                    {{ task.folderID ? getClass(task.folderID).name : "" }}
                  </div>
                  <div class="col-3">
                    {{
                      task?.deadline
                        ? new Date(task?.deadline).toLocaleString()
                        : ""
                    }}
                  </div>
                  <div
                    class="col-2"
                    :class="task.isFinished ? 'text-success' : 'text-primary'"
                  >
                    <b>{{ getTaskStatus(task.isFinished) }}</b>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!--Task Details and Class Progress-->
          <div class="col-3 bg-transparent">
            <!--Task Details Card-->
            <div class="card">
              <div
                class="card-header pe-2"
                :class="
                  currentTask && currentTask?._id === priorityTask?._id
                    ? 'text-bg-warning'
                    : ''
                "
              >
                <div class="row">
                  <div class="col text-start mt-1">
                    Task Details
                  </div>

                  <div
                    v-show="currentTask"
                    class="col-auto text-end"
                  >
                    <button
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
                          @click="changeStatus(!currentTask.isFinished)"
                        >
                          Mark As "<span
                            :class="
                              currentTask.isFinished
                                ? 'text-primary'
                                : 'text-success'
                            "
                          ><b>{{
                            currentTask.isFinished
                              ? "In Progress"
                              : "Finished"
                          }}</b></span>"
                        </a>
                      </li>

                      <li>
                        <a
                          class="dropdown-item px-2"
                          data-bs-toggle="modal"
                          data-bs-target="#add_edit_task_form"
                          @click="prefillEditForm()"
                        >
                          Edit Details
                        </a>
                      </li>

                      <li><hr class="dropdown-divider my-1"></li>

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
                <div
                  v-if="!currentTask"
                  class="text-muted text-center"
                >
                  <i>Click on a task to view its detailed information.</i>
                </div>

                <div v-else>
                  <div>
                    <b><small>Name:</small></b><br>{{ currentTask.name }}
                  </div>
                  <div v-if="currentTask?.deadline">
                    <b><small>Deadline:</small></b><br>{{
                      new Date(currentTask?.deadline).toLocaleString()
                    }}
                  </div>
                  <div v-if="currentTask.folderID">
                    <b><small>For Class:</small></b><br>{{ getClass(currentTask.folderID).name }}
                  </div>
                  <div v-if="currentTask.taskGrade > 0">
                    <b><small>Final Grade Weight:</small></b><br>{{ currentTask.taskGrade }}%
                  </div>
                  <div v-if="currentTask.actualGrade > 0">
                    <b><small>Score Received:</small></b><br>{{
                      currentTask.actualGrade + " / " + currentTask.taskGrade
                    }}%
                  </div>
                  <div>
                    <b><small>Status:</small></b><br>
                    <span
                      :class="
                        currentTask.isFinished ? 'text-success' : 'text-primary'
                      "
                    ><b>{{ getTaskStatus(currentTask.isFinished) }}</b></span>
                  </div>
                  <div
                    v-if="currentTask?._id === priorityTask?._id"
                    class="mt-4"
                  >
                    <b><small>Our Message:</small></b><br>
                    We recommend prioritizing this task!<br>This task is worth
                    <b>{{ currentTask.taskGrade }}%</b> of your final grade in a
                    <b>{{
                      currentClass.priority ? " Major" : "n Elective"
                    }}
                      course</b>
                    that you're averaging
                    <b>{{ (averageGrade * 100).toFixed(1) + "%" }}</b> on.
                    <br><br>See full class progress breakdown below.
                  </div>
                </div>
              </div>
            </div>

            <!--Class Progress Card-->
            <div class="card mt-3">
              <div
                class="card-header pe-2"
                :class="
                  currentTask && currentTask?._id === priorityTask?._id
                    ? 'text-bg-warning'
                    : ''
                "
              >
                <div class="row">
                  <div class="col text-start mt-1">
                    Class Progress
                  </div>
                </div>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col">
                    Select Class
                    <select
                      v-model="currentClass"
                      class="form-select"
                    >
                      <option
                        value
                        disabled
                      >
                        Select
                      </option>
                      <option
                        v-for="folder in classList"
                        :key="folder?._id"
                        :value="folder"
                      >
                        {{ folder.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  v-if="
                    currentClass &&
                      !(classTasks.ungraded.length || classTasks.graded.length)
                  "
                  class="mt-2"
                >
                  <small class="text-muted"><i>You currently have no graded tasks to track for this
                    class. You can add one by clicking on the "New Task"
                    button.</i></small>
                </div>

                <div
                  v-if="classTasks.ungraded.length"
                  class="mt-4"
                >
                  <div class="row border-bottom pb-0 mb-2">
                    <div class="col">
                      Pending Tasks
                    </div>
                  </div>
                  <div
                    v-for="task in classTasks.ungraded"
                    :key="task?._id"
                    class="row"
                  >
                    <div class="col-6 text-truncate">
                      <button
                        type="button"
                        class="btn p-0"
                        @click="currentTask = task"
                      >
                        <b><u>{{ task.name }}:</u></b>
                      </button>
                    </div>

                    <div class="col-6">
                      ? / {{ task.taskGrade }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="classTasks.graded.length"
                  class="mt-4"
                >
                  <div class="row border-bottom pb-0 mb-2">
                    <div class="col">
                      Graded Tasks
                    </div>
                  </div>

                  <div
                    v-for="task in classTasks.graded"
                    :key="task?._id"
                    class="row"
                  >
                    <div class="col-6 text-truncate">
                      <button
                        type="button"
                        class="btn p-0"
                        @click="currentTask = task"
                      >
                        <b><u>{{ task.name }}:</u></b>
                      </button>
                    </div>

                    <div class="col-6">
                      {{ task.actualGrade }} / {{ task.taskGrade }}
                    </div>
                  </div>

                  <div class="row mt-4">
                    <div class="col-6">
                      <b>TOTAL:</b>
                    </div>
                    <div class="col-6">
                      {{
                        totalActualGrade +
                          " / " +
                          totalTaskGrade +
                          " (" +
                          (averageGrade * 100).toFixed(1) +
                          "%)"
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--Due to the nature of Bootstrap modals, this has to be close to the outermost HTML tag-->
  <div
    id="add_edit_task_form"
    class="modal fade"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            {{ isEditMode ? "Edit" : "Create New" }} Task/Goal
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetTaskData()"
          />
        </div>
        <div class="modal-body text-start">
          <form
            id="task_form"
            class="row g-3"
            @submit.prevent="isEditMode ? editTask() : addTask()"
          >
            <div class="col-12">
              <label class="form-label">Task Name</label>
              <input
                id="taskName"
                v-model="taskData.name"
                type="text"
                class="form-control"
                required
              >
            </div>
            <div class="col-12">
              <label class="form-label">Deadline</label>
              <input
                id="taskDeadline"
                v-model="taskData.deadline"
                class="form-control"
                type="datetime-local"
                required
              >
            </div>
            <div class="col-12">
              <div class="form-check form-switch">
                <input
                  id="isForClass"
                  v-model="isForClass"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  @click="resetClass"
                >
                <label class="form-check-label">Is this for a class?</label>
              </div>
            </div>
            <div
              v-show="isForClass"
              class="col-12"
            >
              <div class="card bg-transparent p-3">
                <div class="row">
                  <div class="col">
                    <label class="form-label">Class</label>
                    <select
                      id="taskClass"
                      v-model="taskData.folderID"
                      class="form-select"
                      @change="resetWeight"
                    >
                      <option :value="null">
                        None
                      </option>
                      <option
                        v-for="folder in classList"
                        :key="folder?._id"
                        :value="folder?._id"
                      >
                        {{ folder.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  v-show="taskData.folderID != null"
                  class="row mt-2"
                >
                  <div class="col-6">
                    <label class="form-label">Grade weight in %
                      <small class="text-muted">(optional)</small></label>
                    <input
                      id="taskGrade"
                      v-model="taskData.taskGrade"
                      type="number"
                      class="form-control"
                      min="0"
                      max="100"
                    >
                  </div>

                  <div class="col-6">
                    <label class="form-label">Grade received
                      <small class="text-muted">(if applicable)</small></label>
                    <div class="row">
                      <div class="col">
                        <input
                          v-model="taskData.actualGrade"
                          type="number"
                          class="form-control"
                          min="0"
                          :max="taskData.taskGrade"
                          :disabled="!taskData.taskGrade"
                        >
                      </div>

                      <div class="col-auto ps-0 my-1">
                        <span
                          v-show="taskData.taskGrade"
                          class="align-middle"
                        >/ {{ taskData.taskGrade }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="resetTaskData()"
          >
            Cancel
          </button>
          <button
            id="task_submit"
            type="submit"
            class="btn"
            :class="isEditMode ? 'btn-success' : 'btn-primary'"
            form="task_form"
            @click="closeModal()"
          >
            {{ isEditMode ? "Save Changes" : "Create" }}
          </button>
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
            Confirm Task Deletion
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          />
        </div>

        <div class="modal-body">
          <h6 class="text-center">
            Are you sure you want to delete this task? This is irreversible!
            <br><br><i>Warning: Deleting this will remove it from your Class Progress.
            </i>
            <span v-if="!currentTask.isFinished">
              <i>Consider marking it as "<span class="text-success"><b>Finished</b></span>" instead.</i>
            </span>
          </h6>

          <div class="row p-0 align-middle mt-3">
            <div class="col-4 text-start">
              <button
                class="btn btn-sm btn-secondary w-100"
                data-bs-dismiss="modal"
              >
                Keep Task
              </button>
            </div>

            <div class="col-4 text-middle">
              <button
                v-if="!currentTask.isFinished"
                class="btn btn-sm btn-success w-100"
                data-bs-dismiss="modal"
                @click="changeStatus(true)"
              >
                Mark As Finished
              </button>
            </div>

            <div class="col-4 text-end">
              <button
                class="btn btn-sm btn-danger w-100"
                data-bs-dismiss="modal"
                @click="deleteTask()"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useCoreStore } from "@/store/core";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";

const coreStore = useCoreStore(); // Central source of state
const currentClass = ref(""); // The class currently being viewed by the user
const currentTask = ref(""); // The task currently being viewed by the user
const priorityTask = ref(""); // The recommended task based on weights

const isEditMode = ref(false);
const isForClass = ref(false);

// Form Data
const taskData = reactive({
  name: "",
  deadline: null,
  folderID: null,
  taskGrade: null,
  actualGrade: null,
});

onMounted(() => {
  // Wait 1 second to calculate a recommendation (one time)
  setTimeout(() => {
    priorityTask.value = recommendedTask.value;
  }, 1000);

  // Then check for new ones every 5 seconds
  setInterval(() => {
    if (new Date().getTime() > new Date(priorityTask.value.deadline).getTime())
      priorityTask.value = recommendedTask.value;
  }, 5000);
});

// Some logic to enforce values between taskGrade and actualGrade
watch(taskData, (newValue) => {
  if (newValue) {
    // Enforce that the grade received (actualGrade) is always lower than the taskGrade
    if (newValue.taskGrade < taskData.actualGrade) {
      taskData.actualGrade = newValue.taskGrade;
    }

    // Enforce that a taskGrade of 0 is equivalent to it not having weight at all
    if (newValue.taskGrade <= 0) {
      taskData.taskGrade = null;
      taskData.actualGrade = null;
    }

    // Enforce a maximum of 100%
    if (newValue.taskGrade > 100) {
      newValue.taskGrade = 100;
    }

    if (taskData?.deadline) {
      // HTML's datetime-local only uses the first 16 characters
      // of a local date string, which is why this is hard-coded
      taskData.deadline = taskData.deadline.substring(0, 16);
    }
  }
});

// Update the currentClass when currentTask is updated
watch(currentTask, (newValue) => {
  if (newValue) {
    currentClass.value = classList.value.find((classFolder) => {
      return classFolder?._id === newValue.folderID;
    });
  }
});

// List of "Classes"
// Classes are folders with a 'Priority' field property
const classList = computed(() => {
  return coreStore.folders.filter((folder) => {
    return folder.priority != null;
  });
});

// List of Tasks
const taskList = computed(() => {
  return coreStore.tasks;
});

// List of Graded Tasks
const gradedTaskList = computed(() => {
  return coreStore.tasks.filter((task) => {
    return task.taskGrade != null;
  });
});

// The graded tasks for the class that a user is viewing
const classTasks = computed(() => {
  let sortedTasks = {
    graded: [],
    ungraded: [],
  };

  if (currentClass.value) {
    // Get graded tasks for the current class
    let tasks = taskList.value.filter((task) => {
      return (
        task.taskGrade != null && task.folderID === currentClass.value?._id
      );
    });

    // Segregate the graded and ungraded tasks
    for (const i in tasks) {
      if (tasks[i].actualGrade != null) {
        sortedTasks.graded.push(tasks[i]);
      } else {
        sortedTasks.ungraded.push(tasks[i]);
      }
    }
  }

  return sortedTasks;
});

const totalTaskGrade = computed(() => {
  return getTotalGrade(classTasks.value.graded, "taskGrade");
});

const totalActualGrade = computed(() => {
  return getTotalGrade(classTasks.value.graded, "actualGrade");
});

const averageGrade = computed(() => {
  return totalActualGrade.value / totalTaskGrade.value;
});

const recommendedTask = computed(() => {
  // Only compare tasks from today onwards
  // This line ets the local 12AM time for the day
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Find the Date of the closest, upcoming graded task
  let closestTaskDate = new Date(
    gradedTaskList.value.find((task) => {
      let deadlineDate = new Date(task?.deadline);
      return (
        deadlineDate.getTime() >= currentDate.getTime() && // Deadline is today onwards
        deadlineDate.getTime() > new Date().getTime()
      ); // Deadline hasn't passed
    })?.deadline,
  );

  closestTaskDate.setHours(0, 0, 0, 0); // Set the time of the closest deadline day to midnight

  // Find all graded tasks that are due on the same day as the closest one discovered
  let candidates = gradedTaskList.value.filter((task) => {
    let taskDeadline = new Date(task?.deadline);

    // Filter candidates by order of important details
    // This check will stop as soon as one of them returns false
    return (
      taskDeadline.getTime() >= closestTaskDate.getTime() && // If the task is later than the closest date
      task.isFinished == false && // If the task is not yet finished
      taskDeadline.getDay() === closestTaskDate.getDay() && // If the task is in the same day
      taskDeadline.getMonth() === closestTaskDate.getMonth() && // If the task is in the same month
      taskDeadline.getFullYear() === closestTaskDate.getFullYear()
    ); // If the task is in the same year
  });

  // Create an array of 0s to be used in storing weight
  let mostWeight = 0; // Highest weight
  let vipIndex = 0; // Index of the candidate with the highest weight

  for (let i in candidates) {
    let currentAverage =
      getTotalGrade(candidates, "actualGrade") /
      getTotalGrade(candidates, "taskGrade");
    let classFolder = classList.value.find((folder) => {
      return folder?._id === candidates[i].folderID;
    });
    let deadlineHour = new Date(candidates[i]?.deadline).getHours();
    let weight = 0;

    weight += candidates[i].taskGrade / 100; // Add weight based on final grade worth
    weight += 1 - currentAverage; // Add weight based on current grade average
    weight += classFolder.priority ? 0.5 : 0; // Add weight based on whether the class is a major or elective
    weight += (24 - deadlineHour) / 100; // Add weight based on how soon in the day it's due

    if (weight > mostWeight) {
      // Update the "recommended" candidate based on weight
      mostWeight = weight;
      vipIndex = i;
    }
  }

  return candidates[vipIndex];
});

function getTotalGrade(gradeArray, gradeType) {
  return gradeArray.reduce((gradeA, gradeB) => {
    return gradeA + gradeB[gradeType];
  }, 0);
}

async function addTask() {
  const newTask = {
    name: taskData.name,
    deadline: taskData?.deadline,
    folderID: taskData.folderID,
    taskGrade: taskData.taskGrade,
    actualGrade: taskData.actualGrade,
    isFinished: taskData.actualGrade ? true : false,
  };

  await coreStore.addTask(newTask);

  resetTaskData();

  currentTask.value = newTask;
  priorityTask.value = recommendedTask.value;
}

async function editTask() {
  const updatedTask = {
    name: taskData.name,
    deadline: taskData?.deadline,
    folderID: taskData.folderID,
    taskGrade: taskData.taskGrade,
    actualGrade: taskData.actualGrade,
    isFinished: taskData.actualGrade ? true : currentTask.value.isFinished,
  };

  await coreStore.editTask(currentTask.value?._id, updatedTask);

  resetTaskData();
  currentTask.value = updatedTask;
  priorityTask.value = recommendedTask.value;
}

async function deleteTask() {
  await coreStore.deleteTask(currentTask.value?._id);

  currentTask.value = taskList.value.length ? taskList.value[0] : "";

  if (currentTask.value?._id === priorityTask.value?._id) {
    currentTask.value = "";
  }
}

async function changeStatus(newStatus) {
  currentTask.value.isFinished = newStatus;

  await coreStore.editTask(currentTask.value?._id, currentTask.value);

  priorityTask.value = recommendedTask.value;
}

async function prefillEditForm() {
  isEditMode.value = true;

  taskData.name = currentTask.value.name;
  taskData.deadline = currentTask.value.deadline;
  taskData.folderID = currentTask.value.folderID;
  taskData.taskGrade = currentTask.value.taskGrade;
  taskData.actualGrade = currentTask.value.actualGrade;

  if (taskData.folderID) {
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

async function resetClass() {
  taskData.folderID = null;
}

async function resetWeight() {
  taskData.taskGrade = null;
  taskData.actualGrade = null;
}

async function closeModal() {
  if (taskData.name && taskData?.deadline) {
    const modal = document.querySelector("#add_edit_task_form");
    bootstrap.Modal.getOrCreateInstance(modal).hide();
  }
}

function getTaskStatus(isFinished) {
  return isFinished ? "Finished" : "In Progress";
}

function getClass(folderID) {
  return classList.value.find((folder) => folder?._id === folderID);
}
</script>
