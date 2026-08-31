import type { Doctor } from "./data";

const CFG_KEY = "aavm-cloud-cfg";

export type CloudCfg = { url: string; key: string };

export function getCloudCfg(): CloudCfg | null {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<CloudCfg>;
    if (p && typeof p.url === "string" && typeof p.key === "string" && p.url && p.key)
      return { url: p.url, key: p.key };
    return null;
  } catch {
    return null;
  }
}

/**
 * آدرس پروژه را از هر شکلی که کاربر بچسباند استخراج و یکدست می‌کند:
 * - https://supabase.com/dashboard/project/xyzcompany/database/... → https://xyzcompany.supabase.co
 * - xyzcompany.supabase.co → https://xyzcompany.supabase.co
 * - https://xyzcompany.supabase.co/ → https://xyzcompany.supabase.co
 */
export function normalizeProjectUrl(raw: string): string | null {
  const t = raw.trim().replace(/\/+$/, "");
  if (!t) return null;
  const dash = t.match(/dashboard\/project\/([a-zA-Z0-9-]+)/);
  if (dash) return `https://${dash[1]}.supabase.co`;
  const plain = t.match(/^(?:https?:\/\/)?([a-zA-Z0-9-]+\.supabase\.(?:co|in|net))/);
  if (plain) return `https://${plain[1]}`;
  return null;
}

export const saveCloudCfg = (url: string, key: string) =>
  localStorage.setItem(
    CFG_KEY,
    JSON.stringify({ url: normalizeProjectUrl(url) ?? url.trim(), key: key.trim() }),
  );

export const clearCloudCfg = () => localStorage.removeItem(CFG_KEY);

const authHeaders = (key: string): Record<string, string> => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
});

const endpoint = (cfg: CloudCfg) => `${cfg.url}/rest/v1/doctors`;

/**
 * دریافت فهرست پزشک‌ها از فضای ابری.
 * - `null`  → خطا در ارتباط (قطع/تنظیمات اشتباه)
 * - `[]`    → اتصال برقرار است ولی هنوز فهرستی منتشر نشده
 */
export async function fetchCloudDoctors(): Promise<Doctor[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  try {
    const res = await fetch(`${endpoint(cfg)}?id=eq.1&select=data`, {
      headers: authHeaders(cfg.key),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { data?: unknown }[];
    const data = rows?.[0]?.data;
    return Array.isArray(data) ? (data as Doctor[]) : [];
  } catch {
    return null;
  }
}

/** انتشار فهرست پزشک‌ها برای همه‌ی بازدیدکنندگان */
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

/** آزمایش اتصال قبل از ذخیره‌ی تنظیمات */
export async function testCloud(
  urlRaw: string,
  key: string,
): Promise<{ ok: boolean; missingTable: boolean; badUrl?: boolean }> {
  const url = normalizeProjectUrl(urlRaw);
  if (!url) return { ok: false, missingTable: false, badUrl: true };
  try {
    const res = await fetch(`${url}/rest/v1/doctors?id=eq.1&select=data`, {
      headers: authHeaders(key.trim()),
    });
    if (res.ok) return { ok: true, missingTable: false };
    const text = await res.text().catch(() => "");
    const missingTable = /PGRST205|schema cache|could not find the table/i.test(text);
    return { ok: false, missingTable };
  } catch {
    return { ok: false, missingTable: false };
  }
}

/** کدی که یک‌بار در SQL Editor پروژه‌ی Supabase اجرا می‌شود */
export const SETUP_SQL = `create table if not exists doctors (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table doctors enable row level security;

create policy "public access" on doctors
  for all using (true) with check (true);`;
