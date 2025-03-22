<template>
  <div class="container-fluid">
    <div class="row m-0">
      <div class="col-12 px-1 text-start">
        <label for="mode_select"><small>Mode</small></label>

        <select
          id="mode_select"
          v-model="isPomodoroMode"
          class="form-select form-select-sm mb-2"
        >
          <option
            :value="false"
            selected
          >
            General
          </option>
          <option :value="true">
            Pomodoro
          </option>
        </select>
      </div>
    </div>

    <div class="row m-0">
      <div
        v-for="timeDisplay in timeDisplayData"
        :key="timeDisplay[1]"
        class="col-4 text-center p-0"
      >
        <div class="btn-group-vertical">
          <button
            v-if="!isPomodoroMode"
            type="button"
            class="btn btn-sm btn-outline-dark px-2 py-0"
            :disabled="isPomodoroMode || timeRemaining >= timeMax"
            @click="increaseTime(timeDisplay[1])"
          >
            <i class="bi bi-caret-up-fill" />
          </button>

          <label
            :id="'timeDisplay' + timeDisplay[1]"
            type="button"
            class="btn btn-outline-dark time-display px-2 pe-none"
            disabled
          >
            {{ timeDisplay[0] }}
          </label>

          <button
            v-if="!isPomodoroMode"
            type="button"
            class="btn btn-sm btn-outline-dark px-2 py-0"
            :disabled="isPomodoroMode || timeRemaining <= 0"
            @click="decreaseTime(timeDisplay[1])"
          >
            <i class="bi bi-caret-down-fill" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="!isPomodoroMode"
      class="row mx-0 mt-2"
    >
      <div class="col-6 d-grid px-1">
        <button
          type="button"
          class="btn btn-sm btn-block btn-success px-0 py-1"
          @click="increaseTime(5 * 60)"
        >
          +5m
        </button>
      </div>

      <div class="col-6 d-grid px-1">
        <button
          type="button"
          class="btn btn-sm btn-block btn-success px-0 py-1"
          @click="increaseTime(15 * 60)"
        >
          +15m
        </button>
      </div>
    </div>

    <div class="row mx-0 mt-2 mb-2">
      <div class="col-8 d-grid px-1">
        <button
          id="btnPlayToggle"
          type="button"
          class="btn btn-block btn-primary px-0 py-1"
          @click="togglePause()"
        >
          <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'" />
        </button>
      </div>

      <div class="col-4 d-grid px-1">
        <button
          id="btnReset"
          type="button"
          class="btn btn-block btn-secondary px-0 py-1"
          @click="resetTime()"
        >
          <i class="bi bi-arrow-counterclockwise" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
// General timer variables
const timeRemaining = ref(0);
const timeMax = ref(86400); // 24 hours in seconds
const timerID = ref("");
const isPlaying = ref(false);
const hasEnded = ref(false);
const isPomodoroMode = ref(false);

// Pomodoro Method variables
const intervalStudy = ref(25); //default = 25
const intervalBreak = ref(5); //default = 5
const intervalBigBreak = ref(30); //default = 30
const cycleCount = ref(0);

//timer notification variables
const emit = defineEmits(["timeUp"]);

// Reactive display variables
const timeDisplayData = ref([
  // [time string, timeRemaining interval] tuples
  ["", 3600], // Hours
  ["", 60], // Minutes
  ["", 1], // Seconds
]);

watch(isPlaying, (newValue) => {
  if (newValue) {
    timerID.value = setInterval(() => {
      timeRemaining.value--;
    }, 1000);
  } else {
    clearInterval(timerID.value);
  }

  outputDisplay();
});

watch(
  timeRemaining,
  (newValue) => {
    if (newValue > timeMax.value) {
      timeRemaining.value = timeMax.value;
    }

    if (newValue < 0) {
      timeRemaining.value = 0;
    }

    if (newValue == 0 && isPlaying.value) {
      //indicate timeRemaining is up
      hasEnded.value = true;

      if (!isPomodoroMode.value) {
        isPlaying.value = false;
      }
    }

    outputDisplay();
  },
  {
    immediate: true,
  },
);

watch(hasEnded, (newValue) => {
  if (newValue) {
    if (isPomodoroMode.value) {
      // Start the next cycle
      cycleCount.value++;

      if (cycleCount.value % 2 == 0 && cycleCount.value != 6) {
        timeRemaining.value = intervalStudy.value * 60;
      } else if (cycleCount.value % 2 != 0) {
        timeRemaining.value = intervalBreak.value * 60;
      } else {
        cycleCount.value = -2;
        timeRemaining.value = intervalBigBreak.value * 60;
      }
    } else {
      clearInterval(timerID.value);
    }
    emitTimer();

    hasEnded.value = false;
  }
});

watch(isPomodoroMode, () => {
  resetTime();
});

async function togglePause() {
  if (timeRemaining.value > 0) {
    if (
      !isPlaying.value &&
      cycleCount.value == 0 &&
      timeRemaining.value == intervalStudy.value * 60
    ) {
      emitTimer();
    }

    isPlaying.value = !isPlaying.value;
  } else if (isPomodoroMode.value && cycleCount.value != 6) {
    isPlaying.value = !isPlaying.value;
  }
}

async function outputDisplay() {
  //calculate appropriate hours, minutes, and seconds
  const hrs = Math.floor(timeRemaining.value / 3600) % 3600;
  const min = Math.floor(timeRemaining.value / 60) % 60;
  const sec = timeRemaining.value % 60;

  timeDisplayData.value[0][0] = String(hrs).padStart(2, "0");
  timeDisplayData.value[1][0] = String(min).padStart(2, "0");
  timeDisplayData.value[2][0] = String(sec).padStart(2, "0");
}

async function increaseTime(timeInput) {
  timeRemaining.value += timeInput;
  outputDisplay();
}

async function decreaseTime(timeInput) {
  timeRemaining.value -= timeInput;

  if (timeRemaining.value < 0) {
    timeRemaining.value = 0;
    isPlaying.value = false;
  }

  outputDisplay();
}

async function resetTime() {
  cycleCount.value = 0;
  timeRemaining.value = isPomodoroMode.value ? intervalStudy.value * 60 : 0;
  isPlaying.value = false;
  hasEnded.value = false;
}

//emitTimer - emit to parent that timer is up
async function emitTimer() {
  var timerType = 0;
  if (isPomodoroMode.value) {
    timerType = 1;
  }

  emit("timeUp", [timerType, cycleCount.value]);
}
</script>

<style scoped>
.time-display[disabled] {
  color: black;
  background-color: white;
  border-color: black;
}
</style>
