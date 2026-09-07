import type { Article, Doctor } from "./data";

const CFG_KEY = "aavm-cloud-cfg";

export type CloudCfg = { url: string; key: string };

export function getCloudCfg(): CloudCfg | null {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<CloudCfg>;
      if (p && typeof p.url === "string" && typeof p.key === "string" && p.url && p.key)
        return { url: p.url, key: p.key };
    }
  } catch {}
  return null;
}

export function isEmbeddedCfg(): boolean {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<CloudCfg>;
      if (p && p.url && p.key) return false;
    }
  } catch {}
  return true;
}

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

async function fetchRow(url: string, key: string, id = 1): Promise<unknown[] | null> {
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

async function pushRow(url: string, key: string, list: unknown[], id = 1): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { ...authHeaders(key), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ id, list, updated_at: new Date().toISOString() }),
    });
    return res.ok || res.status === 201;
  } catch {
    return false;
  }
}

export async function fetchCloudDoctors(): Promise<Doctor[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  const rows = await fetchRow(endpoint(cfg), cfg.key, 1);
  return rows as Doctor[] | null;
}

export async function pushCloudDoctors(list: Doctor[]): Promise<boolean> {
  const cfg = getCloudCfg();
  if (!cfg) return false;
  return pushRow(endpoint(cfg), cfg.key, list, 1);
}

export async function fetchCloudArticles(): Promise<Article[] | null> {
  const cfg = getCloudCfg();
  if (!cfg) return null;
  const rows = await fetchRow(articlesEndpoint(cfg), cfg.key, 1);
  return rows as Article[] | null;
}

export async function pushCloudArticles(list: Article[]): Promise<boolean> {
  const cfg = getCloudCfg();
  if (!cfg) return false;
  return pushRow(articlesEndpoint(cfg), cfg.key, list, 1);
}

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
