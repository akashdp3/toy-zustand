import { describe, expect, it, vi } from "vitest";
import { createStore } from "./vanilla";

type AgeStoreState = { age: number };

type AgeStoreActions = {
  setAge: (
    nextAge:
      | AgeStoreState["age"]
      | ((currentAge: AgeStoreState["age"]) => AgeStoreState["age"]),
  ) => void;
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

  it("passes set, get and the api to the initalizer", () => {
    const initalizer = vi.fn(() => ({ age: 42 }));
    const store = createStore<{ age: number }>()(initalizer);
    const [set, get, api] = initalizer.mock.calls[0] as unknown as [
      unknown,
      () => unknown,
      unknown,
    ];

    expect(typeof set).toBe("function");
    expect(get()).toBe(store.getState());
    expect(api).toBe(store);
  });

  it("updates state via action with a value", () => {
    const store = createAgeStore();

    store.getState().setAge(10);
    expect(store.getState().age).toBe(10);
  });

  it("updates state via an action with an updater function", () => {
    const store = createAgeStore();

    store.getState().setAge((age) => age + 1);
    expect(store.getState().age).toBe(43);
  });
});
