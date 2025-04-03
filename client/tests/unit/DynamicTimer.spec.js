import { shallowMount } from "@vue/test-utils";
import DynamicTimer from "@/components/DynamicTimer.vue";

jest.setTimeout(10000); // Default is 5000

// This format gives a human-readable description of expected behavior
describe("DynamicTimer.vue", () => {
  let wrapper,
    hourDisplay,
    minuteDisplay,
    secondDisplay,
    playButton,
    resetButton;

  beforeEach(() => {
    wrapper = shallowMount(DynamicTimer);

    // The 3 labels seen by the user in the timer UI
    // Displays the time in HH:MM:SS format
    hourDisplay = wrapper.find("#time_display_3600");
    minuteDisplay = wrapper.find("#time_display_60");
    secondDisplay = wrapper.find("#time_display_1");

    // Triggers the main timer logic
    playButton = wrapper.find("#btnPlayToggle");
    resetButton = wrapper.find("#btnReset");
  });

  it("loads default Generic timer UI on mount", async () => {
    // Arbitrary element ONLY found in the Generic Timer view
    expect(wrapper.html()).toContain('<i class="bi bi-caret-up-fill"></i>');
  });

  it("loads Pomodoro timer UI upon switching to Pomodoro mode", async () => {
    // Arbitrary element ONLY rendered in the Generic Timer view
    expect(wrapper.html()).toContain('<i class="bi bi-caret-up-fill"></i>');

    wrapper.vm.isPomodoroMode = true; // Simulate switching to Pomodoro mode
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    // Previous element should NOT be rendered
    expect(wrapper.html()).not.toContain('<i class="bi bi-caret-up-fill"></i>');
  });

  it("displays time (in seconds) with the HH:MM:SS format", async () => {
    const timeToRun = 11 * 3600 + 47 * 60 + 13 * 1; // 11:47:13
    wrapper.vm.timeRemaining = timeToRun;
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    expect(hourDisplay.text()).toMatch("11");
    expect(minuteDisplay.text()).toMatch("47");
    expect(secondDisplay.text()).toMatch("13");
  });

  it("automatically stops after the timer is depleted", async () => {
    wrapper.vm.timeRemaining = 1; // 00:00:01
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    expect(secondDisplay.text()).toMatch("01");

    await playButton.trigger("click"); // Simulate timer being started
    expect(wrapper.vm.isPlaying).toBe(true); // Timer should have started

    await new Promise((res) =>
      setTimeout(() => {
        expect(wrapper.vm.isPlaying).toBe(false); // Timer should have ended
        expect(secondDisplay.text()).toMatch("00");

        res();
      }, 1000),
    );
  });

  it("does not allow time to increase beyond 24 hours (86,400 seconds)", async () => {
    wrapper.vm.timeRemaining = 86400; // 24:00:00
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    expect(hourDisplay.text()).toMatch("24");
    expect(minuteDisplay.text()).toMatch("00");
    expect(secondDisplay.text()).toMatch("00");

    wrapper.vm.increaseTime(100000); // Results in time being 186,400
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    // Timer should remain at 24:00:00
    expect(hourDisplay.text()).toMatch("24");
    expect(minuteDisplay.text()).toMatch("00");
    expect(secondDisplay.text()).toMatch("00");
  });

  it("does not allow time to decrease below 0 seconds", async () => {
    wrapper.vm.timeRemaining = 0; // 00:00:00
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    expect(hourDisplay.text()).toMatch("00");
    expect(minuteDisplay.text()).toMatch("00");
    expect(secondDisplay.text()).toMatch("00");

    wrapper.vm.decreaseTime(86400); // Results in time being -86400
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    // Timer should remain at 00:00:00
    expect(hourDisplay.text()).toMatch("00");
    expect(minuteDisplay.text()).toMatch("00");
    expect(secondDisplay.text()).toMatch("00");
  });

  it("will not play when time is set or changed to 0", async () => {
    // Set to 0
    expect(wrapper.vm.timeRemaining).toBe(0); // Default
    expect(wrapper.vm.isPlaying).toBe(false); // Default

    await playButton.trigger("click"); // Simulate timer being started
    expect(wrapper.vm.isPlaying).toBe(false); // Timer should not start

    // Changed to 0
    wrapper.vm.timeRemaining = 60;

    await playButton.trigger("click"); // Simulate timer being started
    expect(wrapper.vm.isPlaying).toBe(true); // Timer should not start

    wrapper.vm.timeRemaining = 0;
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    expect(wrapper.vm.isPlaying).toBe(false); // Timer should not start
  });

  it("resets General timer to 0 upon switching to Pomodoro and back", async () => {
    wrapper.vm.timeRemaining = 43200; // 12:00:00
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    expect(hourDisplay.text()).toMatch("12");
    expect(minuteDisplay.text()).toMatch("00");
    expect(secondDisplay.text()).toMatch("00");

    wrapper.vm.isPomodoroMode = true; // Simulate switching to Pomodoro mode
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    wrapper.vm.isPomodoroMode = false; // Simulate switching back to General
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    // Timer should now be 00:00:00
    expect(hourDisplay.text()).toMatch("00");
    expect(minuteDisplay.text()).toMatch("00");
    expect(secondDisplay.text()).toMatch("00");
  });

  it("resets Pomodoro timer to 25:00 upon switching to General and back", async () => {
    wrapper.vm.isPomodoroMode = true; // Simulate switching to Pomodoro mode
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    // The timer should update to 25 minutes
    expect(wrapper.vm.timeRemaining).toBe(25 * 60);

    expect(hourDisplay.text()).toMatch("00");
    expect(minuteDisplay.text()).toMatch("25");
    expect(secondDisplay.text()).toMatch("00");

    wrapper.vm.isPomodoroMode = false; // Simulate switching to Pomodoro mode
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    wrapper.vm.isPomodoroMode = true; // Simulate switching back to General
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    // Timer should be 25:00:00
    expect(hourDisplay.text()).toMatch("00");
    expect(minuteDisplay.text()).toMatch("25");
    expect(secondDisplay.text()).toMatch("00");
  });

  it("resets time to default and halts all operations upon clicking the reset button", async () => {
    wrapper.vm.timeRemaining = 600; // 00:10:00
    await wrapper.vm.$nextTick(); // Wait for Watchers to respond to the change

    expect(hourDisplay.text()).toMatch("00");
    expect(minuteDisplay.text()).toMatch("10");
    expect(secondDisplay.text()).toMatch("00");

    await playButton.trigger("click"); // Simulate timer being started
    expect(wrapper.vm.isPlaying).toBe(true); // Timer should have started

    await resetButton.trigger("click"); // Simulate timer being reset
    expect(wrapper.vm.isPlaying).toBe(false); // Timer should have started
    expect(hourDisplay.text()).toMatch("00");
    expect(minuteDisplay.text()).toMatch("00");
    expect(secondDisplay.text()).toMatch("00");
  });
});
