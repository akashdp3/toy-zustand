type StateCreator<T> = Function;

type StoreApi<T> = {
  setState: Function;
  getState: Function;
  getInitialState: Function;
  subscribe: Function;
};

export function createStore<T>() {
  let initialState: T;
  let state: T;

  function setState() {
    // TODO
  }

  function getState() {
    return state;
  }

  function getInitialState() {
    // TODO
  }

  function subscribe() {
    // TODO
  }

  return function (stateCreatorFn: StateCreator<T>): StoreApi<T> {
    initialState = stateCreatorFn();
    state = Object.assign({}, initialState);

    return {
      setState,
      getState,
      getInitialState,
      subscribe,
    };
  };
}
