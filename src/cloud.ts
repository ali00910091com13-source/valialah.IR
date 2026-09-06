import type { Article, Doctor, Insurer } from "./data";

const CFG_KEY = "aavm-cloud-cfg";

export type CloudCfg = { url: string; key: string };

/**
 * تنظیمات اتصالِ خود سایت — مستقیم داخل کد قرار گرفته تا «همه‌ی بازدیدکنندگان»
 * در هر مرورگر و دستگاهی، به‌طور خودکار از فهرست مشترک استفاده کنند.
 */
export const DEFAULT_CFG: CloudCfg = {
  url: "https://nrcezlwxksqmfzfsjsyw.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yY2V6bHd4a3NxbWZ6ZnNqc3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDUwNjAsImV4cCI6MjEwMzc4MTA2MH0.cr3NNjFGb4zXINrVL0cA18FKdCbatVorWIxHGrkEztE",
};

export function getCloudCfg(): CloudCfg | null {
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

const doctorsUrl = (cfg: CloudCfg) => `${cfg.url}/rest/v1/doctors`;
const articlesUrl = (cfg: CloudCfg) => `${cfg.url}/rest/v1/articles`;

/** خواندن یک ردیف از جدول بر اساس شناسه — null یعنی خطا در ارتباط */
async function fetchRowById(url: string, key: string, id: number): Promise<unknown[] | null> {
  try {
    const res = await fetch(`${url}?id=eq.${id}&select=data`, { headers: authHeaders(key) });
    if (!res.ok) return null;
    const rows = (await res.json()) as { data?: unknown[] }[];
    const list = rows[0]?.data;
    return Array.isArray(list) ? list : [];
  } catch {
    return null;
  }
}

/** نوشتن یک ردیف (upsert با شناسه) */
async function pushRow(url: string, key: string, list: unknown[], id: number): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { ...authHeaders(key), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ id,  list, updated_at: new Date().toISOString() }),
    });
    return res.ok || res.status === 201;
  } catch {
    return false;
  }
}

/* ─────────────── پزشک‌ها → جدول doctors، ردیف ۱ ─────────────── */
export async function fetchCloudDoctors(): Promise<Doctor[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  const rows = await fetchRowById(doctorsUrl(cfg), cfg.key, 1);
  return rows as Doctor[] | null;
}

export async function pushCloudDoctors(list: Doctor[]): Promise<boolean> {
  const cfg = getCloudCfg();
  if (!cfg) return false;
  return pushRow(doctorsUrl(cfg), cfg.key, list, 1);
}

/* ─────────────── مقالات → جدول articles، ردیف ۱ ─────────────── */
export async function fetchCloudArticles(): Promise<Article[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  const rows = await fetchRowById(articlesUrl(cfg), cfg.key, 1);
  return rows as Article[] | null;
}

export async function pushCloudArticles(list: Article[]): Promise<boolean> {
  const cfg = getCloudCfg();
  if (!cfg) return false;
  return pushRow(articlesUrl(cfg), cfg.key, list, 1);
}

/*
 * ─────────────── بیمه‌ها → همان جدول doctors، ردیف ۲ ───────────────
 * برای اینکه بیمه‌ها بدون ساخت جدول جدید، همان لحظه برای همه منتشر شوند،
 * در همان جدول پزشک‌ها با شناسه‌ی ردیف ۲ ذخیره می‌شوند (ستون data از نوع jsonb
 * است و هر آرایه‌ای را می‌پذیرد). بنابراین نیازی به اجرای SQL جدید نیست.
 */
export async function fetchCloudInsurers(): Promise<Insurer[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  const rows = await fetchRowById(doctorsUrl(cfg), cfg.key, 2);
  return rows as Insurer[] | null;
}

export async function pushCloudInsurers(list: Insurer[]): Promise<boolean> {
  const cfg = getCloudCfg();
  if (!cfg) return false;
  return pushRow(doctorsUrl(cfg), cfg.key, list, 2);
}

/* ─────────────── آزمایش اتصال با تشخیص دقیق ─────────────── */
export type TestResult =
  | { status: "ok" }
  | { status: "bad-url" }
  | { status: "bad-key-format" }
  | { status: "network"; detail: string }
  | { status: "unauthorized"; detail: string }
  | { status: "no-table"; detail: string }
  | { status: "other"; code: number; detail: string };

export async function testCloud(urlRaw: string, keyRaw: string): Promise<TestResult> {
  const url = normalizeProjectUrl(urlRaw);
  const key = keyRaw.trim().replace(/^Bearer\s+/i, "");
  if (!url) return { status: "bad-url" };
  if (key.length < 20) return { status: "bad-key-format" };
  try {
    const res = await fetch(`${url}/rest/v1/doctors?id=eq.1&select=data`, {
      headers: authHeaders(key),
    });
    if (res.ok) return { status: "ok" };
    const detail = (await res.text().catch(() => "")).slice(0, 220) || `HTTP ${res.status}`;
    if (res.status === 401 || res.status === 403 || /invalid api key|jwt|signature/i.test(detail))
      return { status: "unauthorized", detail };
    if (res.status === 404 || /PGRST205|could not find the table|schema cache/i.test(detail))
      return { status: "no-table", detail };
    return { status: "other", code: res.status, detail };
  } catch (e) {
    return { status: "network", detail: e instanceof Error ? e.message : String(e) };
  }
}

export const SETUP_SQL = `create table if not exists doctors (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table doctors enable row level security;

drop policy if exists "public access" on doctors;
create policy "public access" on doctors
  for all using (true) with check (true);`;

export const ARTICLES_SQL = `create table if not exists articles (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table articles enable row level security;

drop policy if exists "public access" on articles;
create policy "public access" on articles
  for all using (true) with check (true);`;
