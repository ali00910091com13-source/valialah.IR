import { useSyncExternalStore } from "react";
import { INSURERS, type Insurer } from "./data";
import { fetchCloudInsurers, pushCloudInsurers, getCloudCfg } from "./cloud";
import type { SyncState } from "./doctorStore";

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
  } catch {
    /* حافظه مرورگر در دسترس نیست */
  }
}

let cache: Insurer[] = loadLocal();
let sync: SyncState = getCloudCfg() ? "loading" : "off";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let initStarted = false;

/*
 * بیمه‌ها در همان جدول پزشک‌ها (ردیف ۲) ذخیره می‌شوند؛ بنابراین به‌محض اینکه
 * اتصال پزشک‌ها برقرار باشد، بیمه‌ها هم بدون هیچ SQL جدیدی برای همه منتشر می‌شوند.
 */
export function initInsurersCloud(force = false) {
  if (initStarted && !force) return;
  initStarted = true;
  if (!getCloudCfg()) {
    sync = "off";
    notify();
    return;
  }
  sync = "loading";
  notify();
  void fetchCloudInsurers().then((remote) => {
    if (remote === null) {
      // خطا در ارتباط — فهرست محلی نمایش داده می‌شود
      sync = "error";
      notify();
      return;
    }
    if (remote.length > 0) {
      cache = remote;
      saveLocal(cache);
      sync = "cloud";
      notify();
      return;
    }
    // ردیف خالی است → بیمه‌های پیش‌فرض همان لحظه منتشر می‌شوند
    void pushCloudInsurers(cache).then((ok) => {
      sync = ok ? "cloud" : "pushfail";
      notify();
    });
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useInsurers = () => useSyncExternalStore(subscribe, () => cache);
export const useInsurerSync = () => useSyncExternalStore(subscribe, () => sync);

function commit(next: Insurer[]) {
  cache = next;
  saveLocal(cache);
  notify();
  if (getCloudCfg()) {
    void pushCloudInsurers(cache).then((ok) => {
      const nextSync: SyncState = ok ? "cloud" : "pushfail";
      if (sync !== nextSync) {
        sync = nextSync;
        notify();
      }
    });
  }
}

export const addInsurer = (x: Insurer) => commit([...cache, x]);

export const updateInsurer = (index: number, x: Insurer) =>
  commit(cache.map((c, j) => (j === index ? x : c)));

export const removeInsurer = (index: number) => commit(cache.filter((_, j) => j !== index));

export const resetInsurers = () => commit([...INSURERS]);

export const publishInsurersNow = () => pushCloudInsurers(cache);

export const isDefaultInsurers = () =>
  cache.length === INSURERS.length && cache.every((x, i) => x.name === INSURERS[i].name);

initInsurersCloud();
