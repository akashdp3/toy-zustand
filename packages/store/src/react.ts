import { useSyncExternalStore } from "react";

import { createStore } from "./vanilla";
import type { StateCreator, StoreApi } from "./vanilla";

type StateGetter<T> = (state: T) => Partial<T>;

export function create<T extends object>() {
  return function (stateCreatorFn: StateCreator<T>) {
    const api: StoreApi<T> = createStore<T>()(stateCreatorFn);

    return function (callback: StateGetter<T>) {
      return useSyncExternalStore(api.subscribe, () =>
        callback(api.getState()),
      );
    };
  };
}
