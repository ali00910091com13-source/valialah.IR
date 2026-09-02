import { useSyncExternalStore } from "react";
import { ARTICLES, type Article } from "./data";
import { fetchCloudArticles, pushCloudArticles, getCloudCfg } from "./cloud";
import type { SyncState } from "./doctorStore";

const KEY = "aavm-articles-v1";

function loadLocal(): Article[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return ARTICLES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Article[];
    return ARTICLES;
  } catch {
    return ARTICLES;
  }
}

function saveLocal(list: Article[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* حافظه مرورگر در دسترس نیست */
  }
}

let cache: Article[] = loadLocal();
let sync: SyncState = getCloudCfg() ? "loading" : "off";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let initStarted = false;

/** دریافت مقالات مشترک از فضای ابری */
export function initArticlesCloud(force = false) {
  if (initStarted && !force) return;
  initStarted = true;
  if (!getCloudCfg()) {
    sync = "off";
    notify();
    return;
  }
  sync = "loading";
  notify();
  void fetchCloudArticles().then((remote) => {
    if (remote === null) {
      // احتمالاً جدول articles هنوز ساخته نشده — فهرست محلی نمایش داده می‌شود
      sync = "error";
      notify();
      return;
    }
    if (remote.length > 0) {
      cache = remote;
      saveLocal(cache);
    } else {
      // جدول خالی است → مقالات پیش‌فرض منتشر می‌شوند
      void pushCloudArticles(cache).then((ok) => {
        sync = ok ? "cloud" : "pushfail";
        notify();
        return;
      });
      sync = "cloud";
      notify();
      return;
    }
    sync = "cloud";
    notify();
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useArticles = () => useSyncExternalStore(subscribe, () => cache);
export const useArticleSync = () => useSyncExternalStore(subscribe, () => sync);

function commit(next: Article[]) {
  cache = next;
  saveLocal(cache);
  notify();
  if (getCloudCfg()) {
    void pushCloudArticles(cache).then((ok) => {
      const nextSync: SyncState = ok ? "cloud" : "pushfail";
      if (sync !== nextSync) {
        sync = nextSync;
        notify();
      }
    });
  }
}

export const newArticleId = () => `a-${Date.now().toString(36)}`;

export const addArticle = (a: Article) => commit([a, ...cache]);

export const updateArticle = (id: string, a: Article) =>
  commit(cache.map((x) => (x.id === id ? a : x)));

export const removeArticle = (id: string) =>
  commit(cache.filter((x) => x.id !== id));

export const resetArticles = () => commit([...ARTICLES]);

export const publishArticlesNow = () => pushCloudArticles(cache);

export const isDefaultArticles = () =>
  cache.length === ARTICLES.length && cache.every((a, i) => a.id === ARTICLES[i].id);

/* به‌محض باز شدن سایت، مقالات مشترک دریافت می‌شوند */
initArticlesCloud();
