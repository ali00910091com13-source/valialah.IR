import type { Article, Doctor } from "./data";

// آدرس API - این را با آدرس هاست خود تغییر دهید
const API_BASE = "/api";

export type CloudCfg = { url: string };

export function getCloudCfg(): CloudCfg | null {
  return { url: API_BASE };
}

export function isEmbeddedCfg(): boolean {
  return true;
}

export function normalizeProjectUrl(raw: string): string | null {
  return raw.trim();
}

export const saveCloudCfg = (url: string) => {};
export const clearCloudCfg = () => {};

async function fetchData(endpoint: string): Promise<any[] | null> {
  try {
    const res = await fetch(`${API_BASE}/index.php?path=${endpoint}`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

async function pushData(endpoint: string, data: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/index.php?path=${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCloudDoctors(): Promise<Doctor[] | null> {
  return fetchData("doctors");
}

export async function pushCloudDoctors(list: Doctor[]): Promise<boolean> {
  return pushData("doctors", list);
}

export async function fetchCloudArticles(): Promise<Article[] | null> {
  return fetchData("articles");
}

export async function pushCloudArticles(list: Article[]): Promise<boolean> {
  return pushData("articles", list);
}

export type TestResult =
  | { status: "ok" }
  | { status: "network"; detail: string };

export async function testCloud(): Promise<TestResult> {
  try {
    const res = await fetch(`${API_BASE}/index.php?path=doctors`);
    if (res.ok) return { status: "ok" };
    return { status: "network", detail: `HTTP ${res.status}` };
  } catch (e) {
    return { status: "network", detail: e instanceof Error ? e.message : String(e) };
  }
}

export const SETUP_SQL = "";
export const ARTICLES_SQL = "";
