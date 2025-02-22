<script>
    //interval times (in minutes)
    const intervalStudy = 0.05
    const intervalBreak = 0.033
    const intervalBigBreak = 0.1

    export default {
        data() {
            return {
                time: intervalStudy * 60,
                cycle: 0,
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

                    //next cycle
                    if (this.cycle % 2 == 0 && this.cycle != 6) {
                        this.time = intervalBreak * 60
                    }
                    else if (this.cycle % 2 != 0){
                        this.time = intervalStudy * 60
                    }
                    else {
                        this.cycle = -2
                        this.time = intervalBigBreak * 60
                    }
                    this.cycle++
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
            restart(){
                this.cycle = 0
                this.time = intervalStudy * 60
                this.play = false
                this.end = false
            }
        }
    }
</script>

<template>
    <div class="Pomo">
        <p>Timer: {{timeStr}}</p>
    </div>
    <button @click="togglePause">
        <span v-if="play">Pause Pomodorro</span>
        <span v-if="!play">Play Pomodorro</span>
    </button>
    <button @click="restart">
        Restart
    </button>
</template>