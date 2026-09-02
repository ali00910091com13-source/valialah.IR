import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  DOCTOR_SPECS,
  ARTICLE_CATS,
  faNum,
  faDateNow,
  readMinutes,
  type Doctor,
  type Article,
} from "./data";
import {
  useDoctors,
  useSyncState,
  addDoctor,
  updateDoctor,
  removeDoctor,
  resetDoctors,
  publishNow,
  isDefaultList,
} from "./doctorStore";
import {
  useArticles,
  useArticleSync,
  addArticle,
  updateArticle,
  removeArticle,
  resetArticles,
  publishArticlesNow,
  isDefaultArticles,
  newArticleId,
} from "./articleStore";
import { isEmbeddedCfg, ARTICLES_SQL } from "./cloud";
import {
  IconGear,
  IconKey,
  IconPlus,
  IconTrash,
  IconEdit,
  IconRefresh,
  IconClose,
  IconSearch,
  IconDoctor,
  IconNews,
  IconCheck,
  IconArrow,
  LogoMark,
} from "./Icons";

const PASS = "avayemehr";
const AUTH_KEY = "aavm-admin-auth";

const SPEC_LABEL = Object.fromEntries(DOCTOR_SPECS.map((s) => [s.id, s.label]));
const TINTS = [
  "#d69a25", "#0e7c74", "#b65a45", "#5d7c2e", "#24408e",
  "#8a5a12", "#0e7490", "#5b5bd6", "#b03052", "#12a594",
];
const tintOf = (spec: string) => {
  const i = DOCTOR_SPECS.findIndex((s) => s.id === spec);
  return TINTS[(i < 0 ? 0 : i) % TINTS.length];
};
const monoOf = (name: string) =>
  name.replace(/^دکتر\s*/, "").replace(/^مهندس\s*/, "").trim().charAt(0) || "؟";

const inputCls =
  "w-full rounded-[10px] border border-foam/15 bg-pine2 px-3.5 py-2.5 text-sm text-foam outline-none transition-all placeholder:text-foam/35 focus:border-gold focus:shadow-[0_0_0_3px_rgba(214,154,37,0.18)]";
const labelCls = "mb-1.5 block text-[0.72rem] font-extrabold text-foam/60";
const errCls = "mt-1 text-[0.68rem] font-bold text-[#f0b3a3]";

type Toast = { msg: string; kind: "ok" | "err" };

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1",
  );

  return (
    <div className="relative min-h-screen bg-pine text-foam">
      <div className="girih-light pointer-events-none fixed inset-0" aria-hidden="true" />
      {authed ? (
        <Dashboard
          onLogout={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setAuthed(false);
          }}
        />
      ) : (
        <Gate
          onOk={() => {
            sessionStorage.setItem(AUTH_KEY, "1");
            setAuthed(true);
          }}
        />
      )}
    </div>
  );
}

/* ─────────────── دروازه رمز ─────────────── */
function Gate({ onOk }: { onOk: () => void }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pass === PASS) onOk();
    else {
      setErr(true);
      setPass("");
      setTimeout(() => setErr(false), 600);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className={`w-full max-w-sm ${err ? "shake" : ""}`}>
        <div className="fadeup rounded-[20px] border border-foam/12 bg-pine2/80 p-7 shadow-2xl">
          <span className="arch-ring mx-auto grid h-16 w-16 place-items-center bg-gold text-pine">
            <LogoMark className="h-10 w-10" />
          </span>
          <h1 className="font-display mt-5 text-center text-3xl">کنسول مدیریت</h1>
          <p className="mt-2 text-center text-[0.78rem] font-bold text-foam/55">
            درمانگاه خیریه آوای مهر ولی‌الله — فقط برای مدیر مجموعه
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className={labelCls}>رمز عبور</label>
              <input
                dir="ltr"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className={`${inputCls} text-center text-lg tracking-[0.3em] ${
                  err ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.2)]" : ""
                }`}
              />
              {err && <p className="mt-2 text-center text-[0.72rem] font-bold text-[#f0b3a3]">رمز اشتباه است؛ دوباره تلاش کنید.</p>}
            </div>
            <button type="submit" className="btn btn-gold w-full">
              <IconKey className="h-4.5 w-4.5" />
              ورود به پنل
            </button>
          </form>
        </div>
        <a href="#/" className="mt-4 flex items-center justify-center gap-2 text-[0.78rem] font-bold text-foam/50 transition-colors hover:text-gold">
          <IconArrow className="h-4 w-4" />
          بازگشت به سایت
        </a>
      </div>
    </div>
  );
}

/* ─────────────── داشبورد ─────────────── */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [mode, setMode] = useState<"doctors" | "articles">("doctors");
  const [toast, setToast] = useState<Toast | null>(null);

  const notify = (msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast(null), 3200);
  };

  const doctors = useDoctors();
  const articles = useArticles();
  const doctorsSync = useSyncState();
  const articlesSync = useArticleSync();

  const worst: "cloud" | "loading" | "error" =
    doctorsSync === "error" || articlesSync === "error"
      ? "error"
      : doctorsSync === "loading" || articlesSync === "loading"
        ? "loading"
        : "cloud";

  return (
    <div className="relative">
      {toast && (
        <div
          className={`menu-pop fixed bottom-5 start-1/2 z-[90] translate-x-1/2 rounded-full border px-5 py-3 text-sm font-extrabold shadow-2xl ${
            toast.kind === "ok"
              ? "border-teal/50 bg-seadeep text-foam"
              : "border-clay/60 bg-[#5a2015] text-[#f6d3c8]"
          }`}
          role="status"
        >
          {toast.msg}
        </div>
      )}

      {/* سربرگ */}
      <header className="sticky top-0 z-40 border-b border-foam/10 bg-pine/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="arch-ring grid h-11 w-11 place-items-center bg-gold text-pine">
              <IconGear className="h-5.5 w-5.5" />
            </span>
            <div>
              <span className="font-display block text-lg leading-6">کنسول مدیریت</span>
              <span className="block text-[0.68rem] text-foam/50">
                پزشکان و مقالات — تغییرات برای همه‌ی بازدیدکنندگان منتشر می‌شود
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#/" className="btn btn-line border-gold/50! px-4! py-2! text-sm text-gold!">
              <IconArrow className="h-4 w-4" />
              مشاهده سایت
            </a>
            <button onClick={onLogout} className="btn px-4! py-2! text-sm text-foam/70 hover:bg-foam/10 hover:text-foam">
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        {/* ── وضعیت همگام‌سازی ── */}
        <SyncBar worst={worst} doctorsSync={doctorsSync} articlesSync={articlesSync} onToast={notify} />

        {/* ── انتخاب بخش ── */}
        <div className="mt-6 flex w-full max-w-md rounded-full border border-foam/15 bg-pine2/70 p-1.5">
          {(
            [
              { id: "doctors", label: "پزشکان", n: doctors.length, Ic: IconDoctor },
              { id: "articles", label: "مقالات", n: articles.length, Ic: IconNews },
            ] as const
          ).map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition-all duration-200 ${
                  active ? "bg-gold text-pine shadow-lg" : "text-foam/60 hover:text-foam"
                }`}
              >
                <m.Ic className="h-4.5 w-4.5" />
                {m.label}
                <span className={`rounded-full px-2 py-0.5 text-[0.66rem] ${active ? "bg-pine/15" : "bg-foam/10"}`}>
                  {faNum(m.n)}
                </span>
              </button>
            );
          })}
        </div>

        {mode === "doctors" ? <DoctorsPanel onToast={notify} /> : <ArticlesPanel onToast={notify} />}
      </main>
    </div>
  );
}

/* ─────────────── نوار وضعیت ابری ─────────────── */
function SyncBar({
  worst,
  doctorsSync,
  articlesSync,
  onToast,
}: {
  worst: "cloud" | "loading" | "error";
  doctorsSync: string;
  articlesSync: string;
  onToast: (msg: string, kind?: "ok" | "err") => void;
}) {
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const embedded = isEmbeddedCfg();

  const meta =
    worst === "cloud"
      ? {
          text: "متصل به فضای ابری — هر تغییر، همان لحظه برای همه منتشر می‌شود",
          cls: "border-sea/50 bg-sea/15 text-[#7fd6cb]",
          dot: "bg-teal pulse-ring",
        }
      : worst === "loading"
        ? {
            text: "در حال دریافت فهرست مشترک از فضای ابری…",
            cls: "border-foam/20 bg-foam/5 text-foam/80",
            dot: "bg-foam/70 pulse-ring",
          }
        : {
            text: "ارتباط با فضای ابری برقرار نشد — تغییرات فقط در همین مرورگر ذخیره می‌شود",
            cls: "border-clay/50 bg-clay/10 text-[#f0b3a3]",
            dot: "bg-clay",
          };

  const publish = async () => {
    setPublishing(true);
    const ok1 = await publishNow();
    const ok2 = await publishArticlesNow();
    setPublishing(false);
    onToast(
      ok1 && ok2
        ? "پزشکان و مقالات برای همه منتشر شد ✅"
        : ok1 || ok2
          ? "بخشی از انتشار انجام شد؛ برای بخش ناموفق، SQL را بررسی کنید ❌"
          : "انتشار ناموفق بود — اتصال را بررسی کنید ❌",
      ok1 && ok2 ? "ok" : "err",
    );
  };

  return (
    <section className="rounded-[18px] border border-foam/10 bg-pine2/70 px-4 py-3.5 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[0.74rem] font-extrabold ${meta.cls}`}>
          <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
          {meta.text}
        </span>
        <button
          onClick={publish}
          disabled={publishing}
          className="flex items-center gap-1.5 rounded-[10px] bg-gold px-3.5 py-2 text-[0.76rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95 disabled:opacity-60"
        >
          <IconRefresh className={`h-4 w-4 ${publishing ? "animate-spin" : ""}`} />
          {publishing ? "در حال انتشار…" : "انتشار فوری"}
        </button>
      </div>

      {/* جدول مقالات ساخته نشده؟ */}
      {doctorsSync !== "error" && articlesSync === "error" && (
        <div className="mt-3 rounded-[12px] border border-clay/50 bg-clay/10 p-4">
          <p className="text-[0.76rem] font-bold leading-7 text-[#f0b3a3]">
            جدول <span dir="ltr">doctors</span> کار می‌کند ولی جدول <span dir="ltr">articles</span> هنوز در
            دیتابیس ساخته نشده. این کد را یک‌بار در <b>SQL Editor</b> پروژه‌ی Supabase اجرا (Run) کنید،
            سپس «انتشار فوری» را بزنید:
          </p>
          <div className="relative mt-2.5">
            <pre dir="ltr" className="no-scrollbar overflow-x-auto rounded-[12px] border border-foam/10 bg-[#082a2c] p-4 text-left text-[0.68rem] leading-6 text-[#9fdcd3]">
              {ARTICLES_SQL}
            </pre>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(ARTICLES_SQL);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  /* clipboard در دسترس نیست */
                }
              }}
              className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-[8px] bg-gold px-2.5 py-1.5 text-[0.66rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95"
            >
              {copied ? <IconCheck className="h-3.5 w-3.5" strokeWidth={2.4} /> : <IconPlus className="h-3.5 w-3.5 rotate-45" strokeWidth={2.4} />}
              {copied ? "کپی شد" : "کپی کد"}
            </button>
          </div>
        </div>
      )}

      {embedded && (
        <p className="mt-3 text-[0.66rem] font-bold leading-6 text-foam/40">
          اتصال ابری داخل خود سایت پیکربندی شده؛ نیازی به وارد کردن آدرس و کلید نیست.
        </p>
      )}
    </section>
  );
}

/* ─────────────── پنل پزشکان ─────────────── */
function DoctorsPanel({ onToast }: { onToast: (msg: string, kind?: "ok" | "err") => void }) {
  const doctors = useDoctors();
  const [query, setQuery] = useState("");
  const [spec, setSpec] = useState("all");
  const [editing, setEditing] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);

  const list = useMemo(() => {
    const q = query.trim();
    return doctors
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => {
        if (spec !== "all" && d.spec !== spec) return false;
        if (!q) return true;
        return `${d.name} ${d.title} ${SPEC_LABEL[d.spec] ?? ""}`.includes(q);
      });
  }, [doctors, query, spec]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      <section className="scroll-mt-24 rounded-[20px] border border-foam/10 bg-pine2/70 p-5 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
        <DoctorForm
          editing={editing}
          doctors={doctors}
          onDone={(msg) => {
            setEditing(null);
            onToast(msg);
          }}
          onCancel={() => setEditing(null)}
        />
      </section>

      <section className="lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display flex items-center gap-2.5 text-2xl">
            <IconDoctor className="h-6 w-6 text-gold" />
            فهرست پزشکان
            <span className="rounded-full bg-foam/10 px-2.5 py-0.5 text-[0.72rem] font-bold text-foam/70">
              {faNum(list.length)} نفر
            </span>
          </h2>
          {!isDefaultList() && (
            <button
              onClick={() => {
                if (window.confirm("فهرست پزشکان به حالت پیش‌فرض سایت برگردد؟")) {
                  resetDoctors();
                  onToast("فهرست به حالت پیش‌فرض برگشت");
                }
              }}
              className="flex items-center gap-1.5 rounded-[10px] border border-clay/50 bg-clay/10 px-3.5 py-2 text-[0.74rem] font-extrabold text-[#f0b3a3] transition-colors hover:bg-clay/20"
            >
              <IconRefresh className="h-4 w-4" />
              بازنشانی پیش‌فرض
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-foam/40" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی نام پزشک…" className={`${inputCls} pr-10`} />
          </div>
          <select value={spec} onChange={(e) => setSpec(e.target.value)} className={`${inputCls} sm:w-48`}>
            <option value="all">همه تخصص‌ها</option>
            {DOCTOR_SPECS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 space-y-2.5">
          {list.length === 0 && (
            <div className="rounded-[16px] border border-dashed border-foam/20 p-10 text-center text-sm font-bold text-foam/50">
              موردی یافت نشد.
            </div>
          )}
          {list.map(({ d, i }) => (
            <div
              key={`${d.name}-${i}`}
              className={`fadeup flex flex-wrap items-center gap-3.5 rounded-[14px] border px-4 py-3 transition-colors sm:flex-nowrap ${
                editing === i ? "border-gold/60 bg-gold/10" : "border-foam/10 bg-pine2/60 hover:border-foam/25"
              }`}
            >
              {d.photo ? (
                <img src={d.photo} alt={d.name} className="h-12 w-12 shrink-0 rounded-[13px] border border-foam/20 object-cover" />
              ) : (
                <span
                  className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-[13px] text-xl"
                  style={{ background: `${tintOf(d.spec)}22`, color: tintOf(d.spec) }}
                >
                  {monoOf(d.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg leading-6">{d.name}</span>
                  <span className="rounded-full px-2 py-0.5 text-[0.64rem] font-extrabold" style={{ background: `${tintOf(d.spec)}22`, color: tintOf(d.spec) }}>
                    {SPEC_LABEL[d.spec] ?? d.spec}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[0.78rem] text-foam/60">
                  {d.title}
                  {d.focus ? ` • ${d.focus}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {confirming === i ? (
                  <>
                    <span className="text-[0.72rem] font-bold text-[#f0b3a3]">حذف شود؟</span>
                    <button
                      onClick={() => {
                        removeDoctor(i);
                        setConfirming(null);
                        onToast(`«${d.name}» حذف شد`, "err");
                      }}
                      className="rounded-[9px] bg-clay px-3 py-1.5 text-[0.72rem] font-extrabold text-foam transition-transform active:scale-95"
                    >
                      بله
                    </button>
                    <button onClick={() => setConfirming(null)} className="rounded-[9px] border border-foam/20 px-3 py-1.5 text-[0.72rem] font-bold text-foam/70 hover:bg-foam/10">
                      انصراف
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(i);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      aria-label={`ویرایش ${d.name}`}
                      className="grid h-9 w-9 place-items-center rounded-[10px] border border-foam/15 text-foam/70 transition-colors hover:border-gold hover:text-gold"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirming(i)}
                      aria-label={`حذف ${d.name}`}
                      className="grid h-9 w-9 place-items-center rounded-[10px] border border-foam/15 text-foam/70 transition-colors hover:border-clay hover:text-[#f0b3a3]"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────── فرم پزشک ─────────────── */
function DoctorForm({
  editing,
  doctors,
  onDone,
  onCancel,
}: {
  editing: number | null;
  doctors: Doctor[];
  onDone: (msg: string) => void;
  onCancel: () => void;
}) {
  const empty = { name: "", spec: DOCTOR_SPECS[0].id as string, title: "", focus: "", photo: "" };
  const [form, setForm] = useState(empty);
  const [errs, setErrs] = useState<{ name?: boolean; title?: boolean }>({});
  const [photoErr, setPhotoErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [loadedFor, setLoadedFor] = useState<number | null>(null);

  if (editing !== null && loadedFor !== editing) {
    const d = doctors[editing];
    if (d) {
      setLoadedFor(editing);
      setForm({ name: d.name, spec: d.spec, title: d.title, focus: d.focus ?? "", photo: d.photo ?? "" });
      setErrs({});
    }
  }
  if (editing === null && loadedFor !== null) {
    setLoadedFor(null);
    setForm(empty);
    setErrs({});
  }

  const isEdit = editing !== null;

  const onPickFile = (file: File | undefined) => {
    setPhotoErr("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoErr("فایل انتخابی تصویر نیست؛ لطفاً JPG یا PNG انتخاب کنید.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 360;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setForm((f) => ({ ...f, photo: String(reader.result) }));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setForm((f) => ({ ...f, photo: canvas.toDataURL("image/jpeg", 0.82) }));
      };
      img.onerror = () => setPhotoErr("خواندن تصویر ممکن نشد؛ فایل دیگری امتحان کنید.");
      img.src = String(reader.result);
    };
    reader.onerror = () => setPhotoErr("خواندن فایل ممکن نشد.");
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const title = form.title.trim();
    const next: { name?: boolean; title?: boolean } = {};
    if (!name) next.name = true;
    if (!title) next.title = true;
    setErrs(next);
    if (next.name || next.title) return;

    const doc: Doctor = {
      name,
      spec: form.spec as Doctor["spec"],
      title,
      focus: form.focus.trim() || undefined,
      photo: form.photo.trim() || undefined,
    };
    if (isEdit) {
      updateDoctor(editing, doc);
      onDone(`تغییرات «${name}» ذخیره و منتشر شد`);
    } else {
      addDoctor(doc);
      onDone(`«${name}» به فهرست پزشکان اضافه و منتشر شد`);
    }
    setForm(empty);
  };

  const field = (bad?: boolean) => `${inputCls} ${bad ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.18)]" : ""}`;

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display flex items-center gap-2.5 text-2xl">
          <span className={`grid h-9 w-9 place-items-center rounded-[11px] ${isEdit ? "bg-gold/20 text-gold" : "bg-sea/25 text-[#7fd6cb]"}`}>
            {isEdit ? <IconEdit className="h-4.5 w-4.5" /> : <IconPlus className="h-4.5 w-4.5" />}
          </span>
          {isEdit ? "ویرایش پزشک" : "افزودن پزشک جدید"}
        </h3>
        {isEdit && (
          <button type="button" onClick={onCancel} className="flex items-center gap-1 rounded-full border border-foam/15 px-3 py-1.5 text-[0.7rem] font-bold text-foam/60 hover:bg-foam/10">
            <IconClose className="h-3.5 w-3.5" />
            انصراف
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className={labelCls}>نام و نام خانوادگی *</label>
          <input
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setErrs((x) => ({ ...x, name: false }));
            }}
            placeholder="مثلاً: دکتر سارا محمدی"
            className={field(errs.name)}
          />
          {errs.name && <p className={errCls}>نام پزشک الزامی است</p>}
        </div>

        <div>
          <label className={labelCls}>تخصص *</label>
          <select value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value })} className={inputCls}>
            {DOCTOR_SPECS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>عنوان / سمت *</label>
          <input
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setErrs((x) => ({ ...x, title: false }));
            }}
            placeholder="مثلاً: متخصص داخلی"
            className={field(errs.title)}
          />
          {errs.title && <p className={errCls}>عنوان الزامی است</p>}
        </div>

        <div>
          <label className={labelCls}>حوزه تمرکز (اختیاری)</label>
          <input
            value={form.focus}
            onChange={(e) => setForm({ ...form, focus: e.target.value })}
            placeholder="مثلاً: بیماری‌های گوارشی"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>عکس پزشک (اختیاری)</label>
          <div className="flex items-center gap-3">
            <span className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 ${form.photo ? "border-gold" : "border-foam/15"} bg-pine2`}>
              {form.photo ? (
                <img src={form.photo} alt="پیش‌نمایش عکس پزشک" className="h-full w-full object-cover" />
              ) : (
                <IconDoctor className="h-6 w-6 text-foam/30" />
              )}
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <input
                dir="ltr"
                value={form.photo}
                onChange={(e) => {
                  setForm({ ...form, photo: e.target.value });
                  setPhotoErr("");
                }}
                placeholder="آدرس اینترنتی عکس (URL)…"
                className={inputCls}
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-[9px] border border-gold/50 bg-gold/10 px-3 py-1.5 text-[0.72rem] font-extrabold text-gold transition-colors hover:bg-gold/20"
                >
                  <IconPlus className="h-3.5 w-3.5" strokeWidth={2.2} />
                  بارگذاری از دستگاه
                </button>
                {form.photo && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, photo: "" })}
                    className="flex items-center gap-1.5 rounded-[9px] border border-clay/50 bg-clay/10 px-3 py-1.5 text-[0.72rem] font-extrabold text-[#f0b3a3] transition-colors hover:bg-clay/20"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                    حذف عکس
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  onPickFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
          {photoErr && <p className={errCls}>{photoErr}</p>}
        </div>
      </div>

      <button type="submit" className={`btn mt-6 w-full justify-center ${isEdit ? "btn-gold" : "btn-sea"}`}>
        {isEdit ? (
          <>
            <IconCheck className="h-4.5 w-4.5" strokeWidth={2.2} />
            ذخیره و انتشار
          </>
        ) : (
          <>
            <IconPlus className="h-4.5 w-4.5" strokeWidth={2.2} />
            افزودن و انتشار
          </>
        )}
      </button>
    </form>
  );
}

/* ─────────────── پنل مقالات ─────────────── */
function ArticlesPanel({ onToast }: { onToast: (msg: string, kind?: "ok" | "err") => void }) {
  const articles = useArticles();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim();
    return articles.filter((a) => !q || `${a.title} ${a.category}`.includes(q));
  }, [articles, query]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      <section className="scroll-mt-24 rounded-[20px] border border-foam/10 bg-pine2/70 p-5 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
        <ArticleForm
          editingId={editingId}
          articles={articles}
          onDone={(msg) => {
            setEditingId(null);
            onToast(msg);
          }}
          onCancel={() => setEditingId(null)}
        />
      </section>

      <section className="lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display flex items-center gap-2.5 text-2xl">
            <IconNews className="h-6 w-6 text-gold" />
            مقالات منتشرشده
            <span className="rounded-full bg-foam/10 px-2.5 py-0.5 text-[0.72rem] font-bold text-foam/70">
              {faNum(list.length)} مورد
            </span>
          </h2>
          {!isDefaultArticles() && (
            <button
              onClick={() => {
                if (window.confirm("مقالات به حالت پیش‌فرض سایت برگردند؟")) {
                  resetArticles();
                  onToast("مقالات به حالت پیش‌فرض برگشتند");
                }
              }}
              className="flex items-center gap-1.5 rounded-[10px] border border-clay/50 bg-clay/10 px-3.5 py-2 text-[0.74rem] font-extrabold text-[#f0b3a3] transition-colors hover:bg-clay/20"
            >
              <IconRefresh className="h-4 w-4" />
              بازنشانی پیش‌فرض
            </button>
          )}
        </div>

        <div className="mt-4 relative">
          <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-foam/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی عنوان مقاله…" className={`${inputCls} pr-10`} />
        </div>

        <div className="mt-4 space-y-2.5">
          {list.length === 0 && (
            <div className="rounded-[16px] border border-dashed border-foam/20 p-10 text-center text-sm font-bold text-foam/50">
              موردی یافت نشد.
            </div>
          )}
          {list.map((a) => (
            <div
              key={a.id}
              className={`fadeup flex flex-wrap items-center gap-3.5 rounded-[14px] border px-4 py-3.5 transition-colors sm:flex-nowrap ${
                editingId === a.id ? "border-gold/60 bg-gold/10" : "border-foam/10 bg-pine2/60 hover:border-foam/25"
              }`}
            >
              <span
                className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-[13px] text-lg"
                style={{ background: "#0e7c7422", color: "#7fd6cb" }}
              >
                {a.title.trim().charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display truncate text-lg leading-6">{a.title}</span>
                </div>
                <p className="mt-0.5 truncate text-[0.76rem] text-foam/60">
                  {a.category} • {a.date} • {faNum(readMinutes(a.body))} دقیقه مطالعه
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {confirming === a.id ? (
                  <>
                    <span className="text-[0.72rem] font-bold text-[#f0b3a3]">حذف شود؟</span>
                    <button
                      onClick={() => {
                        removeArticle(a.id);
                        setConfirming(null);
                        onToast(`«${a.title}» حذف شد`, "err");
                      }}
                      className="rounded-[9px] bg-clay px-3 py-1.5 text-[0.72rem] font-extrabold text-foam transition-transform active:scale-95"
                    >
                      بله
                    </button>
                    <button onClick={() => setConfirming(null)} className="rounded-[9px] border border-foam/20 px-3 py-1.5 text-[0.72rem] font-bold text-foam/70 hover:bg-foam/10">
                      انصراف
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(a.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      aria-label={`ویرایش ${a.title}`}
                      className="grid h-9 w-9 place-items-center rounded-[10px] border border-foam/15 text-foam/70 transition-colors hover:border-gold hover:text-gold"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirming(a.id)}
                      aria-label={`حذف ${a.title}`}
                      className="grid h-9 w-9 place-items-center rounded-[10px] border border-foam/15 text-foam/70 transition-colors hover:border-clay hover:text-[#f0b3a3]"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────── فرم مقاله ─────────────── */
function ArticleForm({
  editingId,
  articles,
  onDone,
  onCancel,
}: {
  editingId: string | null;
  articles: Article[];
  onDone: (msg: string) => void;
  onCancel: () => void;
}) {
  const empty = {
    title: "",
    category: ARTICLE_CATS[0].id as string,
    excerpt: "",
    body: "",
  };
  const [form, setForm] = useState(empty);
  const [errs, setErrs] = useState<{ title?: boolean; excerpt?: boolean; body?: boolean }>({});
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const editing = editingId ? (articles.find((a) => a.id === editingId) ?? null) : null;

  if (editing && loadedFor !== editing.id) {
    setLoadedFor(editing.id);
    setForm({
      title: editing.title,
      category: editing.category,
      excerpt: editing.excerpt,
      body: editing.body.join("\n\n"),
    });
    setErrs({});
  }
  if (!editing && loadedFor !== null) {
    setLoadedFor(null);
    setForm(empty);
    setErrs({});
  }

  const isEdit = !!editing;
  const bodyParas = form.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const previewMin = bodyParas.length ? readMinutes(bodyParas) : 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    const excerpt = form.excerpt.trim();
    const next = {
      title: !title || undefined,
      excerpt: !excerpt || undefined,
      body: bodyParas.length === 0 || undefined,
    };
    setErrs(next);
    if (next.title || next.excerpt || next.body) return;

    const art: Article = {
      id: editing ? editing.id : newArticleId(),
      title,
      category: form.category,
      excerpt,
      body: bodyParas,
      date: editing ? editing.date : faDateNow(),
      author: editing?.author ?? "واحد آموزش سلامت درمانگاه",
    };
    if (editing) {
      updateArticle(editing.id, art);
      onDone(`مقاله‌ی «${title}» ویرایش و منتشر شد`);
    } else {
      addArticle(art);
      onDone(`مقاله‌ی «${title}» منتشر شد`);
    }
    setForm(empty);
  };

  const field = (bad?: boolean) => `${inputCls} ${bad ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.18)]" : ""}`;

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display flex items-center gap-2.5 text-2xl">
          <span className={`grid h-9 w-9 place-items-center rounded-[11px] ${isEdit ? "bg-gold/20 text-gold" : "bg-sea/25 text-[#7fd6cb]"}`}>
            {isEdit ? <IconEdit className="h-4.5 w-4.5" /> : <IconNews className="h-4.5 w-4.5" />}
          </span>
          {isEdit ? "ویرایش مقاله" : "مقاله‌ی جدید"}
        </h3>
        {isEdit && (
          <button type="button" onClick={onCancel} className="flex items-center gap-1 rounded-full border border-foam/15 px-3 py-1.5 text-[0.7rem] font-bold text-foam/60 hover:bg-foam/10">
            <IconClose className="h-3.5 w-3.5" />
            انصراف
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className={labelCls}>عنوان مقاله *</label>
          <input
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setErrs((x) => ({ ...x, title: false }));
            }}
            placeholder="مثلاً: چرا جرم‌گیری سالانه لازم است؟"
            className={field(errs.title)}
          />
          {errs.title && <p className={errCls}>عنوان الزامی است</p>}
        </div>

        <div>
          <label className={labelCls}>دسته‌بندی *</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {ARTICLE_CATS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>چکیده (در کارت مقاله نمایش داده می‌شود) *</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => {
              setForm({ ...form, excerpt: e.target.value });
              setErrs((x) => ({ ...x, excerpt: false }));
            }}
            rows={2}
            placeholder="یک یا دو جمله که خواننده را ترغیب کند…"
            className={`${field(errs.excerpt)} resize-y`}
          />
          {errs.excerpt && <p className={errCls}>چکیده الزامی است</p>}
        </div>

        <div>
          <label className={labelCls}>متن کامل *</label>
          <textarea
            value={form.body}
            onChange={(e) => {
              setForm({ ...form, body: e.target.value });
              setErrs((x) => ({ ...x, body: false }));
            }}
            rows={8}
            placeholder={"پاراگراف‌ها را با یک خط خالی جدا کنید…\n\nبرای تیتر فرعی، خط را با ## شروع کنید"}
            className={`${field(errs.body)} resize-y leading-7`}
          />
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[0.66rem] font-bold text-foam/45">
            <span>
              {faNum(bodyParas.length)} پاراگراف
              {previewMin > 0 && ` • حدود ${faNum(previewMin)} دقیقه مطالعه`}
            </span>
            <span>خط‌های شروع‌شده با ## تیتر فرعی می‌شوند</span>
          </div>
          {errs.body && <p className={errCls}>متن مقاله خالی است</p>}
        </div>
      </div>

      <button type="submit" className={`btn mt-6 w-full justify-center ${isEdit ? "btn-gold" : "btn-sea"}`}>
        {isEdit ? (
          <>
            <IconCheck className="h-4.5 w-4.5" strokeWidth={2.2} />
            ذخیره و انتشار
          </>
        ) : (
          <>
            <IconNews className="h-4.5 w-4.5" />
            انتشار مقاله
          </>
        )}
      </button>
    </form>
  );
}
