"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns false on the server and during the first client render, true after.
 *
 * Use it to gate anything the server cannot know - most importantly the
 * client-side auth session. Reading `session` while rendering on the server
 * gives one result and on the client another, which React reports as a
 * hydration mismatch and then throws away the whole tree.
 *
 * Preferred over a useState + useEffect "mounted" flag because it needs no
 * state update during render, so it does not trip react-hooks/set-state-in-effect.
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
