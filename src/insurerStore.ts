import { useSyncExternalStore } from "react";
import { INSURERS, type Insurer } from "./data";

const KEY = "aavm-insurers-v1";

function loadLocal(): Insurer[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INSURERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Insurer[];
    return INSURERS;
  } catch {
    return INSURERS;
  }
}

function saveLocal(list: Insurer[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

let cache: Insurer[] = loadLocal();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useInsurers = () => useSyncExternalStore(subscribe, () => cache);

export function setInsurers(next: Insurer[]) {
  cache = next;
  saveLocal(cache);
  notify();
}

export const addInsurer = (ins: Insurer) => setInsurers([...cache, ins]);
export const removeInsurer = (name: string) => setInsurers(cache.filter((i) => i.name !== name));
export const resetInsurers = () => setInsurers([...INSURERS]);
