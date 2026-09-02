import type { Article, Doctor } from "./data";

const CFG_KEY = "aavm-cloud-cfg";

export type CloudCfg = { url: string; key: string };

/**
 * تنظیمات اتصالِ خود سایت — مستقیم داخل کد قرار گرفته تا «همه‌ی بازدیدکنندگان»
 * در هر مرورگر و دستگاهی، به‌طور خودکار از فهرست مشترک پزشکان استفاده کنند.
 * کلید anon برای استفاده‌ی عمومی طراحی شده و RLS از داده محافظت می‌کند.
 */
export const DEFAULT_CFG: CloudCfg = {
  url: "https://nrcezlwxksqmfzfsjsyw.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yY2V6bHd4a3NxbWZ6ZnNqc3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDUwNjAsImV4cCI6MjEwMzc4MTA2MH0.cr3NNjFGb4zXINrVL0cA18FKdCbatVorWIxHGrkEztE",
};

export function getCloudCfg(): CloudCfg | null {
  // اولویت با تنظیمات دستی (localStorage) است؛ در غیر این صورت تنظیمات خود سایت
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<CloudCfg>;
      if (p && typeof p.url === "string" && typeof p.key === "string" && p.url && p.key)
        return { url: p.url, key: p.key };
    }
  } catch {
    /* نادیده بگیر */
  }
  return DEFAULT_CFG;
}

/** آیا از تنظیمات داخل خود سایت استفاده می‌شود؟ */
export function isEmbeddedCfg(): boolean {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<CloudCfg>;
      if (p && p.url && p.key) return false;
    }
  } catch {
    /* نادیده بگیر */
  }
  return true;
}

/** آدرس پروژه را از هر شکلی که باشد یکدست می‌کند */
export function normalizeProjectUrl(raw: string): string | null {
  const t = raw.trim().replace(/\/+$/, "");
  if (!t) return null;
  const dash = t.match(/(?:dashboard\/)?project\/([a-zA-Z0-9-]+)/);
  if (dash) return `https://${dash[1]}.supabase.co`;
  const plain = t.match(/^(?:https?:\/\/)?([a-zA-Z0-9-]+\.supabase\.(?:co|in|net))/);
  if (plain) return `https://${plain[1]}`;
  return null;
}

export const saveCloudCfg = (url: string, key: string) =>
  localStorage.setItem(
    CFG_KEY,
    JSON.stringify({
      url: normalizeProjectUrl(url) ?? url.trim(),
      key: key.trim().replace(/^Bearer\s+/i, ""),
    }),
  );

export const clearCloudCfg = () => localStorage.removeItem(CFG_KEY);

const authHeaders = (key: string): Record<string, string> => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
});

const endpoint = (cfg: CloudCfg) => `${cfg.url}/rest/v1/doctors`;
const articlesEndpoint = (cfg: CloudCfg) => `${cfg.url}/rest/v1/articles`;

/**
 * دریافت فهرست پزشک‌ها از فضای ابری.
 * - `null` → خطا در ارتباط (قطع/تنظیمات اشتباه)
 * - `[]`   → اتصال برقرار است ولی هنوز فهرستی منتشر نشده
 */
export async function fetchCloudDoctors(): Promise<Doctor[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  try {
    const res = await fetch(`${endpoint(cfg)}?id=eq.1&select=data`, {
      headers: authHeaders(cfg.key),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { data?: Doctor[] }[];
    const list = rows[0]?.data;
    return Array.isArray(list) ? list : [];
  } catch {
    return null;
  }
}

/** انتشار فهرست برای همه‌ی بازدیدکنندگان */
export async function pushCloudDoctors(list: Doctor[]): Promise<boolean> {
  const cfg = getCloudCfg();
  if (!cfg) return false;
  try {
    const res = await fetch(endpoint(cfg), {
      method: "POST",
      headers: {
        ...authHeaders(cfg.key),
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ id: 1, data: list, updated_at: new Date().toISOString() }),
    });
    return res.ok || res.status === 201;
  } catch {
    return false;
  }
}

/**
 * دریافت مقالات از فضای ابری.
 * - `null` → خطا (مثلاً جدول articles هنوز ساخته نشده)
 * - `[]`   → اتصال برقرار است ولی هنوز مقاله‌ای منتشر نشده
 */
export async function fetchCloudArticles(): Promise<Article[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  try {
    const res = await fetch(`${articlesEndpoint(cfg)}?id=eq.1&select=data`, {
      headers: authHeaders(cfg.key),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { data?: Article[] }[];
    const list = rows[0]?.data;
    return Array.isArray(list) ? list : [];
  } catch {
    return null;
  }
}

/** انتشار مقالات برای همه‌ی بازدیدکنندگان */
export async function pushCloudArticles(list: Article[]): Promise<boolean> {
  const cfg = getCloudCfg();
  if (!cfg) return false;
  try {
    const res = await fetch(articlesEndpoint(cfg), {
      method: "POST",
      headers: {
        ...authHeaders(cfg.key),
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ id: 1, data: list, updated_at: new Date().toISOString() }),
    });
    return res.ok || res.status === 201;
  } catch {
    return false;
  }
}

/** کد ساخت جدول مقالات — یک‌بار در SQL Editor اجرا می‌شود */
export const ARTICLES_SQL = `create table if not exists articles (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table articles enable row level security;

drop policy if exists "public access" on articles;
create policy "public access" on articles
  for all using (true) with check (true);`;
