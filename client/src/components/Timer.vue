<script>
    export default {
        data() {
            return {
                time: 0,
                play: false,
                end: false,
                timeStr: ""
            }
        },

        watch: {
           play(value) {
                if (value) {
                    setTimeout(() => {
                        this.time--;
                    }, 1000);
                }
                this.outputDisplay()
            },
            time: {
                handler(value) {
                    if (value > 0 && this.play) { //increment down
                        setTimeout(() => {
                          this.time--;
                        }, 1000);
                    }
                    if (value == 0 && this.play){ //indicate time is up
                        this.end = true
                    }
                    if (value < 0) {this.time = 0} //ensure we don't go to negative time
                    this.outputDisplay()
                },
                immediate: true
            },
            end(value){
                if(value) {
                    //Pop-up Notif
                    this.end = false
                }
            }
        },

        methods:{
            togglePause(){
                this.play = !this.play
            },
            outputDisplay(){
                //calculate appropriate hours, minutes, and seconds
                var hrs = Math.floor(this.time / 3600) % 3600; 
                var min = Math.floor(this.time / 60) % 60;
                var sec = this.time % 60;
                this.timeStr = String(hrs).padStart(2, '0') + ":" + String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0')
            },
            upTime(timeInput){
                this.time += timeInput
                this.outputDisplay()
            },
            downTime(timeInput){
                this.time -= timeInput
                if (this.time < 0 ){
                    this.time = 0
                }
                this.outputDisplay()
            }
        }
    }
</script>

<template>
    <div class="Timer">
        <p>Timer: {{timeStr}}</p>
    </div>
    <button @click="togglePause">
        <span v-if="play">Pause</span>
        <span v-if="!play">Play</span>
    </button>
    <button @click="upTime(3600)">
        ^ Hours
    </button>
    <button @click="downTime(3600)">
        v Hours
    </button>
    <button @click="upTime(60)">
        ^ Min
    </button>
    <button @click="downTime(60)">
        v Min
    </button>
    <button @click="upTime(1)">
        ^ Sec
    </button>
    <button @click="downTime(1)">
        v Sec
    </button>
</template>