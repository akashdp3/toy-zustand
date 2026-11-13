type setStateArg<T> = Partial<T> | ((state: T) => Partial<T>);

type setFn<T> = (callback: setStateArg<T>) => T;

type StateCreator<T> = (set: setFn<T>, get: () => T, api: StoreApi<T>) => T;

type StoreApi<T> = {
  setState: (partial: setStateArg<T>, replace?: boolean) => void;
  getState: () => T;
  getInitialState: () => T;
  subscribe: Function;
};

export function createStore<T>() {
  let initialState: T;
  let state: T;

  function setState(partial: setStateArg<T>, replace: boolean = false) {
    let result: Partial<T>;

    if (typeof partial === "function") {
      result = partial(state);
    } else {
      result = partial;
    }

    if (replace) {
      state = Object.assign({}, result) as T;
    } else {
      state = { ...state, ...result };
    }
  }

  function getState() {
    return state;
  }

  function getInitialState() {
    return initialState;
  }

  function subscribe() {
    // TODO
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
