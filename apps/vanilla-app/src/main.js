import { createStore } from "toy-zustand";

const ageStore = createStore()((set) => ({
  age: 42,
  setAge: (nextAge) =>
    set((state) => ({
      age: typeof nextAge === 'function' ? nextAge(state.age) : nextAge,
    }))
}));

function increment() {
  ageStore.getState().setAge((currentAge) => currentAge + 1)
}

const ageLabel = document.getElementById("label-age");
const incrementButton = document.getElementById("btn-increment-age");

incrementButton.addEventListener("click", increment);
function render(state) {
  ageLabel.innerText = `Your Age: ${state.age}`
}

render(ageStore.getInitialState(), ageStore.getInitialState())

ageStore.subscribe(render)
