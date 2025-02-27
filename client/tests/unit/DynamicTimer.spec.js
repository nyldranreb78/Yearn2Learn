import { shallowMount } from "@vue/test-utils";
import DynamicTimer from "@/components/DynamicTimer.vue";

// This format gives a human-readable description of expected behavior
describe("DynamicTimer.vue", () => {
  it("ends when the time reaches 0 in General mode", () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');

    const wrapper = shallowMount(DynamicTimer, {
      data: function() {
        return {
          timeRemaining: 3600,   // Tell the component to set the timer to timeToRun seconds
          isPlaying: true             // Tell the component to start counting down
        }
      }
    });
    
    jest.advanceTimersByTime(3600);  // Simulate the time passing by timeToRun seconds

    expect(wrapper.vm.timeRemaining).toBe(0); // Timer should be down to 0 
    expect(wrapper.vm.isPlaying).toBe(false); // Timer should have been stopped
  });
});

describe("DynamicTimer.vue", () => {
  it("cycles through study/break intervals when the timer reaches 0 in Pomodoro mode", () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');

    const wrapper = shallowMount(DynamicTimer);

    wrapper.vm.isPomodoroMode = true;   // Simulate switching to Pomodoro mode
    wrapper.vm.isPlaying = true;        // Simulate starting the timer

    expect(wrapper.vm.timeRemaining).toBe(25 * 60);   // Timer should be down to 0
    
    // Pomodoro method study cycle lasts for 25 minutes
    jest.advanceTimersByTime(25 * 60); // Simulate time passing by for 25 minutes

    expect(wrapper.vm.timeRemaining).toBe(0);   // Timer should be down to 0
    expect(wrapper.vm.isPlaying).toBe(true);    // Timer should NOT have been stopped/paused    

    jest.advanceTimersByTime(1);  // Simulate time passing by for 1 second
    expect(wrapper.vm.timeRemaining).toBe((5 * 60) - 1);  // Timer should be refreshed to 4:59 mins after 1 second
    expect(wrapper.vm.cycleCount).toBe(1);                // Ensure this is the 2st cycle (break)
  });
});

// describe("DynamicTimer.vue", () => {
//   it("does not let the time exceed 24 hours (86,400 seconds)", () => {
//     expect().toMatch();
//   });
// });

// describe("DynamicTimer.vue", () => {
//   it("does not let the time become negative", () => {
//     expect().toMatch();
//   });
// });

// describe("DynamicTimer.vue", () => {
//   it("increments by 5 minutes (900 seconds) when clicking the +5m button", () => {
//     expect().toMatch();
//   });
// });

// describe("DynamicTimer.vue", () => {
//   it("increments by 15 minutes (2700 seconds) when clicking the +15m button", () => {
//     expect().toMatch();
//   });
// });

// describe("DynamicTimer.vue", () => {
//   it("only toggles between play/pause when the time is > 0", () => {
//     expect().toMatch();
//   });
// });

// describe("DynamicTimer.vue", () => {
//   it("resets time to default and halts all operations upon clicking the reset button", () => {
//     expect().toMatch();
//   });
// });

// describe("DynamicTimer.vue", () => {
//   it("resets time to default and halts all operations upon switching modes", () => {
//     expect().toMatch();
//   });
// });

// describe("DynamicTimer.vue", () => {
//   it("finishes its countdown normally even when the time is changed while the timer is running", () => {
//     expect().toMatch();
//   });
// });

