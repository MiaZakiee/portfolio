// Module-level camera state store (plain JS pub/sub)
// Bridges Canvas and HTML worlds without React context

let state = {
  mode: 'orbit', // 'orbit' | 'focused'
  lastActivityTime: Date.now(),
};

const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(state));
}

export const cameraStore = {
  getState() {
    return state;
  },

  focusLaptop() {
    state = { ...state, mode: 'focused', lastActivityTime: Date.now() };
    notify();
  },

  unfocusLaptop() {
    state = { ...state, mode: 'orbit' };
    notify();
  },

  reportActivity() {
    state = { ...state, lastActivityTime: Date.now() };
    notify();
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
