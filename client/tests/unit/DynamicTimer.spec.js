import { shallowMount } from "@vue/test-utils";
import Timer from "@/components/DynamicTimer.vue";

// Example provided with the package
describe("DynamicTimer.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});

describe("DynamicTimer.vue", () => {
  it("ends when the time reaches 0 in General mode", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("cycles through study/break intervals when the timer reaches 0 in Pomodoro mode", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("does not let the time exceed 24 hours (86,400 seconds)", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("does not let the time become negative", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("increments by 5 minutes (900 seconds) when clicking the +5m button", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("increments by 15 minutes (2700 seconds) when clicking the +15m button", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("only toggles between play/pause when the time is > 0", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("resets time to default and halts all operations upon clicking the reset button", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("resets time to default and halts all operations upon switching modes", () => {
    expect().toMatch();
  });
});

describe("DynamicTimer.vue", () => {
  it("finishes its countdown normally even when the time is changed while the timer is running", () => {
    expect().toMatch();
  });
});

