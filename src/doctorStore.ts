import { useSyncExternalStore } from "react";
import { DOCTORS, type Doctor } from "./data";
import { fetchCloudDoctors, pushCloudDoctors, getCloudCfg, clearCloudCfg } from "./cloud";

const KEY = "aavm-doctors-v1";

function loadLocal(): Doctor[] {
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

function saveLocal(list: Doctor[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* حافظه مرورگر در دسترس نیست */
  }
}

export type SyncState = "off" | "loading" | "cloud" | "error" | "pushfail";

let cache: Doctor[] = loadLocal();
let sync: SyncState = getCloudCfg() ? "loading" : "off";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let initStarted = false;

export function initCloud(force = false) {
  if (initStarted && !force) return;
  initStarted = true;
  if (!getCloudCfg()) {
    sync = "off";
    notify();
    return;
  }
  sync = "loading";
  notify();
  void fetchCloudDoctors().then((remote) => {
    if (remote === null) {
      sync = "error";
      notify();
      return;
    }
    if (remote.length > 0) {
      cache = remote;
      saveLocal(cache);
    } else {
      void pushCloudDoctors(cache);
    }
    sync = "cloud";
    notify();
  });
}

export const reconnectCloud = () => initCloud(true);

export function disconnectCloud() {
  clearCloudCfg();
  initStarted = false;
  sync = getCloudCfg() ? "loading" : "off";
  cache = loadLocal();
  notify();
  if (getCloudCfg()) initCloud(true);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useDoctors = () => useSyncExternalStore(subscribe, () => cache);
export const useSyncState = () => useSyncExternalStore(subscribe, () => sync);

function commit(next: Doctor[]) {
  cache = next;
  saveLocal(cache);
  notify();
  if (getCloudCfg()) {
    void pushCloudDoctors(cache).then((ok) => {
      const nextSync: SyncState = ok ? "cloud" : "pushfail";
      if (sync !== nextSync) {
        sync = nextSync;
        notify();
      }
    });
  }
}

export const addDoctor = (d: Doctor) => commit([d, ...cache]);

export const updateDoctor = (index: number, d: Doctor) =>
  commit(cache.map((x, j) => (j === index ? d : x)));

export const removeDoctor = (index: number) => commit(cache.filter((_, j) => j !== index));

export const resetDoctors = () => commit([...DOCTORS]);

export const publishNow = () => pushCloudDoctors(cache);

export const isDefaultList = () =>
  cache.length === DOCTORS.length && cache.every((d, i) => d.name === DOCTORS[i].name);

initCloud();
