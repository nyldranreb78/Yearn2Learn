<script>
    export default {
        data() {
            return {
                // General timer variables
                time: 0,
                timeMax: 86400, // 24 hours in seconds
                timerID: "",
                play: false,
                end: false,
                pomodoroMode: false,

                // Pomodoro Method variables
                intervalStudy: 25,
                intervalBreak: 5,
                intervalBigBreak: 30,
                cycle: 0,

                // Reactive display variables
                timeDisplayData: [  // [time string, time interval] tuples
                    ["", 3600],     // Hours
                    ["", 60],       // Minutes
                    ["", 1]         // Seconds
                ]
            }
        },

        watch: {
           play(value) {
                if (value) {
                    this.timerID = setInterval(() => {
                        this.time--;
                    }, 1000);
                }
                else{
                    clearInterval(this.timerID);
                }

                this.outputDisplay()
            },
            time: {
                handler(value) {
                    if (value <= 0 && this.play){ //indicate time is up
                        this.time = 0
                        this.end = true

                        if(!this.pomodoroMode){
                            this.play = false;
                        }
                    }

                    if (value > this.timeMax){
                        this.time = this.timeMax;
                    }
                    
                    this.outputDisplay()
                },
                immediate: true
            },
            end(value){
                if(value) {
                    if(this.pomodoroMode){
                        //next cycle
                        if (this.cycle % 2 == 0 && this.cycle != 6) {
                            this.time = this.intervalBreak * 60
                        }
                        else if (this.cycle % 2 != 0){
                            this.time = this.intervalStudy * 60
                        }
                        else {
                            this.cycle = -2
                            this.time = this.intervalBigBreak * 60
                        }
                        this.cycle++
                    }

                    clearInterval(this.timerID);
                    this.end = false
                }
            },
            pomodoroMode(){
                this.resetTime();
            }
        },

        methods:{
            togglePause(){
                if(this.time > 0){
                    this.play = !this.play
                }
                
                else if(this.pomodoroMode && this.cycle != 6){
                    this.play = !this.play
                }
            },
            outputDisplay(){
                //calculate appropriate hours, minutes, and seconds
                var hrs = Math.floor(this.time / 3600) % 3600; 
                var min = Math.floor(this.time / 60) % 60;
                var sec = this.time % 60;

                this.timeDisplayData[0][0] = String(hrs).padStart(2, '0');
                this.timeDisplayData[1][0] = String(min).padStart(2, '0');
                this.timeDisplayData[2][0] = String(sec).padStart(2, '0');
            },
            increaseTime(timeInput){
                this.time += timeInput
                this.outputDisplay()
            },
            decreaseTime(timeInput){
                this.time -= timeInput
                
                if (this.time < 0 ){
                    this.time = 0;
                    this.play = false;
                }

                this.outputDisplay()
            },
            resetTime(){
                this.cycle = 0;
                this.time = this.pomodoroMode? this.intervalStudy * 60 : 0;
                this.play = false;
                this.end = false;
                clearInterval(this.timerID);
            }
        }
    }
</script>

<template>
    <div class="container-fluid">
        <div class="row m-0">
            <div class="col-12 px-1 text-start">
                <label for="mode_select">
                    <small>
                        Mode
                        <a href="#" class="text-dark" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Tooltip on right">
                            <i class="bi bi-info-circle"></i>
                        </a>
                    </small>
                </label>
                <select class="form-select form-select-sm mb-2" id="mode_select" v-model="pomodoroMode">
                    <option :value="false" selected>General</option>
                    <option :value="true" class="danger">Pomodoro</option>
                </select>
            </div>
        </div>

        <div class="row m-0">
            <div class="col-4 text-center p-0" v-for="timeDisplay in timeDisplayData" v-bind:key="timeDisplay[1]">
                <div class="btn-group-vertical">
                    <button type="button" class="btn btn-sm btn-outline-dark px-2 py-0" v-on:click="increaseTime(timeDisplay[1])" :disabled="pomodoroMode || time >= timeMax" v-if="!pomodoroMode">
                        <i class="bi bi-caret-up-fill"></i>
                    </button>

                    <label type="button" class="btn btn-outline-dark time-display px-2 pe-none" disabled>{{ timeDisplay[0] }}</label>

                    <button type="button" class="btn btn-sm btn-outline-dark px-2 py-0" v-on:click="decreaseTime(timeDisplay[1])" :disabled="pomodoroMode || time <= 0" v-if="!pomodoroMode">
                        <i class="bi bi-caret-down-fill"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="row mx-0 mt-2" v-if="!pomodoroMode">
            <div class="col-6 d-grid px-1">
                <button type="button" class="btn btn-sm btn-block btn-success px-0 py-1" v-on:click="increaseTime(5 * 60)">
                    +5m
                </button>
            </div>

            <div class="col-6 d-grid px-1">
                <button type="button" class="btn btn-sm btn-block btn-success px-0 py-1" v-on:click="increaseTime(15 * 60)">
                    +15m
                </button>
            </div>
        </div>

        <div class="row mx-0 mt-2 mb-2">
            <div class="col-8 d-grid px-1">
                <button type="button" class="btn btn-block btn-primary px-0 py-1" v-on:click="togglePause()">
                    <i :class="play? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
                </button>
            </div>

            <div class="col-4 d-grid px-1">
                <button type="button" class="btn btn-block btn-secondary px-0 py-1" v-on:click="resetTime()">
                    <i class="bi bi-arrow-counterclockwise"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.time-display[disabled] {
    color:black;
    background-color: white;
    border-color: black;
}
</style>