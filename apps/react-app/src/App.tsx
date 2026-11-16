// @ts-nocheck
import { create } from "toy-zustand/react";

type AgeStoreState = { age: number };

type AgeStoreActions = {
  setAge: (
    nextAge:
      | AgeStoreState["age"]
      | ((currentAge: AgeStoreState["age"]) => AgeStoreState["age"]),
  ) => void;
};

type AgeStore = AgeStoreState & AgeStoreActions;

const useAgeStore = create<AgeStore>()((set) => ({
  age: 42,
  setAge: (nextAge) => {
    set((state) => ({
      age: typeof nextAge === "function" ? nextAge(state.age) : nextAge,
    }));
  },
}));

export default function App() {
  const age = useAgeStore((state) => state.age);
  const setAge = useAgeStore((state) => state.setAge);
  console.log({ age });

  function increment() {
    setAge((currentAge) => currentAge + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button
        onClick={() => {
          increment();
          increment();
          increment();
        }}
      >
        +3
      </button>
      <button
        onClick={() => {
          increment();
        }}
      >
        +1
      </button>
    </>
  );
}
