import { useSyncExternalStore } from "react";
import { DOCTORS, type Doctor } from "./data";

const KEY = "aavm-doctors-v1";

function load(): Doctor[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DOCTORS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Doctor[];
    return DOCTORS;
  } catch {
    return DOCTORS;
  }
}

let cache: Doctor[] = load();
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => cache;

function commit(next: Doctor[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* حافظه مرورگر در دسترس نیست */
  }
  listeners.forEach((l) => l());
}

export const useDoctors = () => useSyncExternalStore(subscribe, getSnapshot);

export const addDoctor = (d: Doctor) => commit([d, ...cache]);

export const updateDoctor = (index: number, d: Doctor) =>
  commit(cache.map((x, j) => (j === index ? d : x)));

export const removeDoctor = (index: number) =>
  commit(cache.filter((_, j) => j !== index));

export const resetDoctors = () => commit([...DOCTORS]);

export const isDefaultList = () =>
  cache.length === DOCTORS.length &&
  cache.every((d, i) => d.name === DOCTORS[i].name);
