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

  it("shalow-merges partial updates and keep other keys", () => {
    const store = createStore<{ a: number; b: number }>()(() => ({
      a: 1,
      b: 2,
    }));
    store.setState({ a: 10 });
    expect(store.getState()).toStrictEqual({ a: 10, b: 2 });
  });

  it("setState accepts an updater function receiving current state", () => {
    const store = createStore<{ a: number; b: number }>()(() => ({
      a: 1,
      b: 2,
    }));
    store.setState((s) => ({ b: s.b * 10 }));
    expect(store.getState()).toStrictEqual({ a: 1, b: 20 });
  });

  it("setState with replace=true replaces the whole state", () => {
    const store = createStore<{ a: number; b: number }>()(() => ({
      a: 1,
      b: 2,
    }));
    store.setState((s) => ({ a: 5 }), true);
    expect(store.getState()).toStrictEqual({ a: 5 });
  });

  it("produces a new state object on change (immutability)", () => {
    const store = createAgeStore();
    const before = store.getState();
    store.getState().setAge(1);

    expect(store.getState()).not.toBe(before);
    expect(before.age).toBe(42);
  });

  it("getInitialState returns the initial state even after updates", () => {
    const store = createAgeStore();
    store.getState().setAge(50);

    expect(store.getInitialState().age).toBe(42);
  });

  it("notifies subscribers with (state, prevState)", () => {
    const store = createAgeStore();
    const listener = vi.fn();
    store.subscribe(listener);
    const prev = store.getState();
    store.getState().setAge(50);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(store.getState(), prev);
    expect(listener.mock.calls[0][0].age).toBe(50);
    expect(listener.mock.calls[0][1].age).toBe(42);
  });

  it("notifies all subscribers", () => {
    const store = createAgeStore();
    const l1 = vi.fn();
    const l2 = vi.fn();
    store.subscribe(l1);
    store.subscribe(l2);
    store.getState().setAge(50);

    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });

  it("does not notify when next state is the same reference", () => {
    const store = createAgeStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.setState((s) => s);

    expect(listener).not.toHaveBeenCalled();
  });

  it("unsubscribe stops notification", () => {
    const store = createAgeStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.getState().setAge(50);

    expect(listener).not.toHaveBeenCalled();
  });

  it("get() inside the actions reads the latest state", () => {
    const store = createStore<{ n: number; double: () => number }>()(
      (_set, get) => ({
        n: 2,
        double: () => get().n * 2,
      }),
    );

    store.setState({ n: 5 });

    expect(store.getState().double()).toBe(10);
  });
});
