type setStateArg<T> = Partial<T> | ((state: T) => Partial<T>);

type setFn<T> = (callback: setStateArg<T>) => T;

export type StateCreator<T> = (
  set: setFn<T>,
  get: () => T,
  api: StoreApi<T>,
) => T;

export type StoreApi<T> = {
  setState: (partial: setStateArg<T>, replace?: boolean) => void;
  getState: () => T;
  getInitialState: () => T;
  subscribe: (listener: Listener<T>) => () => void;
};

type Listener<T> = (state: T, prevState: T) => void;

export function createStore<T extends object>() {
  let initialState: T;
  let state: T;
  let listeners: Listener<T>[] = [];

  function setState(partial: setStateArg<T>, replace: boolean = false) {
    let nextState: Partial<T>;

    if (typeof partial === "function") {
      nextState = partial(state);
    } else {
      nextState = partial;
    }

    if (Object.is(nextState, state)) return;

    let prevState = state as T;

    if (replace) {
      state = nextState as T;
    } else {
      state = Object.assign({}, state, nextState);
    }

    listeners.forEach((listener) => {
      listener(state, prevState);
    });
  }

  function getState() {
    return state;
  }

  function getInitialState() {
    return initialState;
  }

  function subscribe(listener: Listener<T>) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((li) => li !== listener);
    };
  }

  return function (stateCreatorFn: StateCreator<T>): StoreApi<T> {
    function set(callback: setStateArg<T>): T {
      setState(callback);

      return Object.assign({}, state);
    }

    const api = {
      setState,
      getState,
      getInitialState,
      subscribe,
    };

    initialState = stateCreatorFn(set, getState, api);
    state = Object.assign({}, initialState);

    return api;
  };
}
