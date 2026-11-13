import { describe, expect, it } from "vitest";
import { createStore } from "./vanilla";

type AgeStoreState = { age: number };

type AgeStoreActions = {
  setAge:
    | AgeStoreState["age"]
    | ((currentAge: AgeStoreState["age"]) => AgeStoreState["age"]);
};

type AgeStore = AgeStoreState & AgeStoreActions;

const createAgeStore = () => {
  return createStore<AgeStore>()((set) => ({
    age: 42,
    setAge: (nextAge) =>
      set((state) => ({
        age: typeof nextAge === "function" ? nextAge(state.age) : nextAge,
      })),
  }));
};

describe("createStore", () => {
  it("exposes the store API", () => {
    const store = createAgeStore();

    expect(store).toEqual({
      setState: expect.any(Function),
      getState: expect.any(Function),
      getInitialState: expect.any(Function),
      subscribe: expect.any(Function),
    });
  });

  it("initializes state using the state creator", () => {
    const store = createAgeStore();

    expect(store.getState().age).toBe(42);
    expect(typeof store.getState().setAge).toBe("function");
  });

  it.todo("initializes state using the state creator");
  it.todo("merges partial state updates");
  it.todo("supports functional state updates");
  it.todo("preserves the initial state after updates");
  it.todo("notifies subscribers with the current and previous state");
  it.todo("stops notifying a subscriber after unsubscribe");
});
