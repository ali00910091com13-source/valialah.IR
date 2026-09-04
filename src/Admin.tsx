import { useMemo, useState, type FormEvent } from "react";
import {
  DOCTOR_SPECS,
  ARTICLE_CATS,
  LOGO,
  faNum,
  faDateNow,
  readMinutes,
  type Doctor,
  type Article,
  type Insurer,
  type SpecId,
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
import {
  useInsurers,
  useInsurerSync,
  addInsurer,
  updateInsurer,
  removeInsurer,
  resetInsurers,
  publishInsurersNow,
  isDefaultInsurers,
} from "./insurerStore";
import { isEmbeddedCfg, SETUP_SQL, ARTICLES_SQL, INSURERS_SQL } from "./cloud";
import ImagePicker from "./ImagePicker";
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
  IconShield,
  IconCheck,
  IconArrow,
  LogoImg,
} from "./Icons";

const PASS = "avayemehr";
const AUTH_KEY = "aavm-admin-auth";

const SPEC_LABEL = Object.fromEntries(DOCTOR_SPECS.map((s) => [s.id, s.label]));
const TINTS = ["#d69a25", "#1ba396", "#b65a45", "#5d7c2e", "#24408e", "#8a5a12", "#0e7490", "#5b5bd6", "#b03052", "#12a594", "#2f7d4f", "#1f6fb2", "#cf7a1c"];
const tintOf = (spec: string) => {
  const i = DOCTOR_SPECS.findIndex((s) => s.id === spec);
  return TINTS[(i < 0 ? 0 : i) % TINTS.length];
};
const monoOf = (name: string) => name.replace(/^دکتر\s*/, "").trim().charAt(0) || "؟";

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
        <Gate onOk={() => setAuthed(true)} />
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
    if (pass === PASS) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onOk();
    } else {
      setErr(true);
      setPass("");
      setTimeout(() => setErr(false), 600);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className={`w-full max-w-sm ${err ? "shake" : ""}`}>
        <div className="fadeup rounded-[20px] border border-foam/12 bg-pine2/80 p-7 shadow-2xl">
          <span className="arch-ring mx-auto grid h-20 w-20 place-items-center overflow-hidden bg-card shadow-xl ring-1 ring-gold/40">
            <LogoImg src={LOGO} className="h-full w-full object-cover" />
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
  const [panel, setPanel] = useState<"doctors" | "articles" | "insurers">("doctors");
  const [toast, setToast] = useState<Toast | null>(null);
  const doctors = useDoctors();
  const insurersCount = useInsurers().length;
  const articles = useArticles();

  const notify = (msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="relative">
      {toast && (
        <div
          className={`menu-pop fixed bottom-5 start-1/2 z-[90] w-max max-w-[92vw] translate-x-1/2 rounded-full border px-5 py-3 text-center text-sm font-extrabold shadow-2xl ${
            toast.kind === "ok"
              ? "border-teal/50 bg-seadeep text-foam"
              : "border-clay/60 bg-[#5a2015] text-[#f6d3c8]"
          }`}
          role="status"
        >
          {toast.msg}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-foam/10 bg-pine/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="arch-ring grid h-11 w-11 place-items-center bg-gold text-pine">
              <IconGear className="h-5.5 w-5.5" />
            </span>
            <div>
              <span className="font-display block text-lg leading-6">کنسول مدیریت</span>
              <span className="block text-[0.68rem] text-foam/50">
                آوای مهر ولی‌الله — پزشکان: {faNum(doctors.length)} • مقالات: {faNum(articles.length)}
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
        {/* سوییچر بخش‌ها */}
        <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:px-6">
          <div className="flex w-max gap-1.5 rounded-[13px] border border-foam/12 bg-pine2/70 p-1.5">
            {(
              [
                { id: "doctors", label: "پزشکان", icon: IconDoctor, n: doctors.length },
                { id: "articles", label: "مقالات", icon: IconNews, n: articles.length },
                { id: "insurers", label: "بیمه‌ها", icon: IconShield, n: insurersCount },
              ] as const
            ).map((p) => {
              const active = panel === p.id;
              const Ic = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setPanel(p.id)}
                  className={`flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm font-extrabold transition-all ${
                    active ? "bg-gold text-pine shadow" : "text-foam/60 hover:bg-foam/5 hover:text-foam"
                  }`}
                >
                  <Ic className="h-4.5 w-4.5" />
                  {p.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[0.62rem] ${active ? "bg-pine/15" : "bg-foam/10"}`}>
                    {faNum(p.n)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">
        <CloudPanel onToast={notify} />
        {panel === "doctors" && <DoctorsPanel onToast={notify} />}
        {panel === "articles" && <ArticlesPanel onToast={notify} />}
        {panel === "insurers" && <InsurersPanel onToast={notify} />}
      </main>
    </div>
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

  const dentists = doctors.filter((d) => d.spec === "dent").length;
  const specCount = new Set(doctors.map((d) => d.spec)).size;

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { n: doctors.length, label: "پزشک و متخصص", tint: "#d69a25" },
          { n: dentists, label: "دندانپزشک", tint: "#1ba396" },
          { n: specCount, label: "تخصص فعال", tint: "#b65a45" },
        ].map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-[16px] border border-foam/10 bg-pine2/70 px-4 py-4">
            <span className="absolute inset-y-0 start-0 w-1" style={{ background: s.tint }} aria-hidden="true" />
            <span className="font-display block text-3xl sm:text-4xl" style={{ color: s.tint }}>
              {faNum(s.n)}
            </span>
            <span className="mt-1 block text-[0.7rem] font-bold text-foam/55 sm:text-[0.78rem]">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="scroll-mt-24 rounded-[20px] border border-foam/10 bg-pine2/70 p-5 lg:col-span-2 lg:sticky lg:top-40 lg:self-start">
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
                  if (window.confirm("فهرست پزشکان به حالت پیش‌فرض سایت برگردد؟ تغییرات شما پاک می‌شود.")) {
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
              <div className="rounded-[16px] border border-dashed border-foam/20 p-10 text-center text-sm font-bold text-foam/50">موردی یافت نشد.</div>
            )}
            {list.map(({ d, i }) => (
              <div
                key={`${d.name}-${i}`}
                className={`fadeup group flex flex-wrap items-center gap-3.5 rounded-[14px] border px-4 py-3 transition-colors sm:flex-nowrap ${
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
    </>
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
  const empty = { name: "", spec: DOCTOR_SPECS[0].id as SpecId, title: "", focus: "", photo: "" };
  const [form, setForm] = useState(empty);
  const [errs, setErrs] = useState<{ name?: boolean; title?: boolean }>({});
  const [loadedFor, setLoadedFor] = useState<number | null>(null);
  const sync = useSyncState();

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
  const field = (bad?: boolean) => `${inputCls} ${bad ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.18)]" : ""}`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const title = form.title.trim();
    const next = { name: !name || undefined, title: !title || undefined };
    setErrs(next);
    if (next.name || next.title) return;

    const doc: Doctor = {
      name,
      spec: form.spec,
      title,
      focus: form.focus.trim() || undefined,
      photo: form.photo.trim() || undefined,
    };
    if (isEdit) {
      updateDoctor(editing, doc);
      onDone(`تغییرات «${name}» ذخیره شد${sync === "cloud" ? " و برای همه منتشر شد" : ""}`);
    } else {
      addDoctor(doc);
      onDone(`«${name}» به فهرست پزشکان اضافه شد${sync === "cloud" ? " و برای همه منتشر شد" : ""}`);
    }
    setForm(empty);
  };

  return (
    <form onSubmit={submit} id="admin-form" className="scroll-mt-44">
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
          <select value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value as SpecId })} className={inputCls}>
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
          <input value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} placeholder="مثلاً: بیماری‌های گوارشی" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>عکس پزشک (اختیاری)</label>
          <ImagePicker value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} />
        </div>
      </div>

      <button type="submit" className={`btn mt-6 w-full justify-center ${isEdit ? "btn-gold" : "btn-sea"}`}>
        {isEdit ? (
          <>
            <IconCheck className="h-4.5 w-4.5" strokeWidth={2.2} />
            ذخیره تغییرات
          </>
        ) : (
          <>
            <IconPlus className="h-4.5 w-4.5" strokeWidth={2.2} />
            افزودن به فهرست
          </>
        )}
      </button>

      <p className="mt-3 flex items-start gap-2 text-[0.7rem] leading-6 text-foam/45">
        <IconGear className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {sync === "cloud"
          ? "اتصال ابری برقرار است؛ تغییرات همان لحظه برای همه‌ی بازدیدکنندگان منتشر می‌شود."
          : "اتصال ابری برقرار نیست یا در حال بارگذاری است؛ تغییرات فعلاً در همین مرورگر ذخیره می‌شود."}
      </p>
    </form>
  );
}

/* ─────────────── پنل مقالات ─────────────── */
function ArticlesPanel({ onToast }: { onToast: (msg: string, kind?: "ok" | "err") => void }) {
  const articles = useArticles();
  const sync = useArticleSync();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim();
    return articles.filter((a) => !q || `${a.title} ${a.category}`.includes(q));
  }, [articles, query]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      <section className="scroll-mt-24 rounded-[20px] border border-foam/10 bg-pine2/70 p-5 lg:col-span-2 lg:sticky lg:top-40 lg:self-start">
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
            فهرست مقالات
            <span className="rounded-full bg-foam/10 px-2.5 py-0.5 text-[0.72rem] font-bold text-foam/70">{faNum(list.length)}</span>
          </h2>
          <div className="flex items-center gap-2">
            {!isDefaultArticles() && (
              <button
                onClick={() => {
                  if (window.confirm("مقالات به حالت پیش‌فرض سایت برگردند؟ تغییرات شما پاک می‌شود.")) {
                    resetArticles();
                    onToast("مقالات به حالت پیش‌فرض برگشتند");
                  }
                }}
                className="flex items-center gap-1.5 rounded-[10px] border border-clay/50 bg-clay/10 px-3.5 py-2 text-[0.74rem] font-extrabold text-[#f0b3a3] transition-colors hover:bg-clay/20"
              >
                <IconRefresh className="h-4 w-4" />
                بازنشانی
              </button>
            )}
            {sync !== "cloud" && !isEmbeddedCfg() && (
              <button
                onClick={async () => {
                  const ok = await publishArticlesNow();
                  onToast(ok ? "مقالات برای همه منتشر شد ✅" : "انتشار ناموفق بود ❌", ok ? "ok" : "err");
                }}
                className="flex items-center gap-1.5 rounded-[10px] bg-gold px-3.5 py-2 text-[0.74rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95"
              >
                <IconRefresh className="h-4 w-4" />
                انتشار فوری
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-4">
          <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-foam/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی عنوان مقاله…" className={`${inputCls} pr-10`} />
        </div>

        <div className="mt-4 space-y-2.5">
          {list.length === 0 && (
            <div className="rounded-[16px] border border-dashed border-foam/20 p-10 text-center text-sm font-bold text-foam/50">مقاله‌ای یافت نشد.</div>
          )}
          {list.map((a) => (
            <div
              key={a.id}
              className={`fadeup flex flex-wrap items-center gap-3.5 rounded-[14px] border px-4 py-3 transition-colors sm:flex-nowrap ${
                editingId === a.id ? "border-gold/60 bg-gold/10" : "border-foam/10 bg-pine2/60 hover:border-foam/25"
              }`}
            >
              {a.cover ? (
                <img src={a.cover} alt="" className="h-12 w-12 shrink-0 rounded-[13px] border border-foam/20 object-cover" />
              ) : (
                <span className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-[13px] text-lg" style={{ background: "#0e7c7422", color: "#7fd6cb" }}>
                  {a.title.trim().charAt(0)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-display block truncate text-lg leading-6">{a.title}</span>
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
    cover: "",
  };
  const [form, setForm] = useState(empty);
  const [errs, setErrs] = useState<{ title?: boolean; excerpt?: boolean; body?: boolean }>({});
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const sync = useArticleSync();

  const editing = editingId ? (articles.find((a) => a.id === editingId) ?? null) : null;

  if (editing && loadedFor !== editing.id) {
    setLoadedFor(editing.id);
    setForm({
      title: editing.title,
      category: editing.category,
      excerpt: editing.excerpt,
      body: editing.body.join("\n\n"),
      cover: editing.cover ?? "",
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
  const field = (bad?: boolean) => `${inputCls} ${bad ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.18)]" : ""}`;

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
      cover: form.cover.trim() || undefined,
    };
    if (editing) {
      updateArticle(editing.id, art);
      onDone(`مقاله‌ی «${title}» ویرایش شد${sync === "cloud" ? " و برای همه منتشر شد" : ""}`);
    } else {
      addArticle(art);
      onDone(`مقاله‌ی «${title}» منتشر شد${sync === "cloud" ? " و برای همه" : ""}`);
    }
    setForm(empty);
  };

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
          <label className={labelCls}>عکس کاور مقاله (اختیاری)</label>
          <ImagePicker
            value={form.cover}
            onChange={(v) => setForm({ ...form, cover: v })}
            maxSize={900}
            preview="rect"
            emptyIcon="news"
          />
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

/* ─────────────── پنل بیمه‌ها ─────────────── */
function InsurersPanel({ onToast }: { onToast: (msg: string, kind?: "ok" | "err") => void }) {
  const insurers = useInsurers();
  const sync = useInsurerSync();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);

  const list = useMemo(() => {
    const q = query.trim();
    return insurers.map((x, i) => ({ x, i })).filter(({ x }) => !q || x.name.includes(q));
  }, [insurers, query]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      <section className="scroll-mt-24 rounded-[20px] border border-foam/10 bg-pine2/70 p-5 lg:sticky lg:top-24 lg:col-span-2 lg:self-start">
        <InsurerForm
          editing={editing}
          insurers={insurers}
          sync={sync}
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
            <IconShield className="h-6 w-6 text-gold" />
            بیمه‌های طرف قرارداد
            <span className="rounded-full bg-foam/10 px-2.5 py-0.5 text-[0.72rem] font-bold text-foam/70">
              {faNum(list.length)} مورد
            </span>
          </h2>
          {!isDefaultInsurers() && (
            <button
              onClick={() => {
                if (window.confirm("فهرست بیمه‌ها به حالت پیش‌فرض سایت برگردد؟")) {
                  resetInsurers();
                  onToast("فهرست بیمه‌ها به حالت پیش‌فرض برگشت");
                }
              }}
              className="flex items-center gap-1.5 rounded-[10px] border border-clay/50 bg-clay/10 px-3.5 py-2 text-[0.74rem] font-extrabold text-[#f0b3a3] transition-colors hover:bg-clay/20"
            >
              <IconRefresh className="h-4 w-4" />
              بازنشانی پیش‌فرض
            </button>
          )}
        </div>

        <div className="relative mt-4">
          <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-foam/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام بیمه…"
            className={`${inputCls} pr-10`}
          />
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {list.length === 0 && (
            <div className="rounded-[16px] border border-dashed border-foam/20 p-10 text-center text-sm font-bold text-foam/50 sm:col-span-2">
              موردی یافت نشد.
            </div>
          )}
          {list.map(({ x, i }) => (
            <div
              key={`${x.name}-${i}`}
              className={`fadeup flex items-center gap-3.5 rounded-[14px] border px-4 py-3 transition-colors ${
                editing === i ? "border-gold/60 bg-gold/10" : "border-foam/10 bg-pine2/60 hover:border-foam/25"
              }`}
            >
              {x.logo ? (
                <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-card p-1.5 ring-1 ring-foam/20">
                  <img src={x.logo} alt="" className="h-full w-full object-contain" />
                </span>
              ) : (
                <span
                  className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-[12px] text-lg"
                  style={{ background: `${x.color}22`, color: x.color }}
                >
                  {x.mono}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-display block truncate text-base leading-6">{x.name}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[0.68rem] font-bold text-foam/50">
                  <span className="h-2.5 w-2.5 rounded-full ring-1 ring-foam/30" style={{ background: x.color }} />
                  رنگ برند
                  {x.logo && " • دارای لوگو"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {confirming === i ? (
                  <>
                    <button
                      onClick={() => {
                        removeInsurer(i);
                        setConfirming(null);
                        onToast(`«${x.name}» حذف شد`, "err");
                      }}
                      className="rounded-[9px] bg-clay px-2.5 py-1.5 text-[0.68rem] font-extrabold text-foam transition-transform active:scale-95"
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="rounded-[9px] border border-foam/20 px-2.5 py-1.5 text-[0.68rem] font-bold text-foam/70 hover:bg-foam/10"
                    >
                      انصراف
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(i);
                        document.getElementById("insurer-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      aria-label={`ویرایش ${x.name}`}
                      className="grid h-9 w-9 place-items-center rounded-[10px] border border-foam/15 text-foam/70 transition-colors hover:border-gold hover:text-gold"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirming(i)}
                      aria-label={`حذف ${x.name}`}
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

        {sync === "pushfail" && (
          <button
            onClick={async () => {
              const ok = await publishInsurersNow();
              onToast(ok ? "فهرست بیمه‌ها منتشر شد ✅" : "انتشار ناموفق — اتصال را بررسی کنید ❌", ok ? "ok" : "err");
            }}
            className="btn btn-gold mt-4 w-full justify-center py-2.5! text-sm"
          >
            <IconRefresh className="h-4 w-4" />
            انتشار فوری فهرست بیمه‌ها
          </button>
        )}
      </section>
    </div>
  );
}

/* ─────────────── فرم بیمه ─────────────── */
function InsurerForm({
  editing,
  insurers,
  sync,
  onDone,
  onCancel,
}: {
  editing: number | null;
  insurers: Insurer[];
  sync: string;
  onDone: (msg: string) => void;
  onCancel: () => void;
}) {
  const empty = { name: "", mono: "", color: "#0e7c74", logo: "" };
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState(false);
  const [loadedFor, setLoadedFor] = useState<number | null>(null);

  if (editing !== null && loadedFor !== editing) {
    const x = insurers[editing];
    if (x) {
      setLoadedFor(editing);
      setForm({ name: x.name, mono: x.mono, color: x.color, logo: x.logo ?? "" });
      setErr(false);
    }
  }
  if (editing === null && loadedFor !== null) {
    setLoadedFor(null);
    setForm(empty);
    setErr(false);
  }

  const isEdit = editing !== null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setErr(true);
      return;
    }
    const mono = form.mono.trim() || name.replace(/^بیمه\s*/, "").slice(0, 2);
    const ins: Insurer = {
      name,
      mono,
      color: form.color || "#0e7c74",
      logo: form.logo.trim() || undefined,
    };
    if (isEdit) {
      updateInsurer(editing, ins);
      onDone(`تغییرات «${name}» ذخیره شد${sync === "cloud" ? " و برای همه منتشر شد" : ""}`);
    } else {
      addInsurer(ins);
      onDone(`بیمه‌ی «${name}» اضافه شد${sync === "cloud" ? " و برای همه منتشر شد" : ""}`);
    }
    setForm(empty);
  };

  return (
    <form onSubmit={submit} id="insurer-form" className="scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display flex items-center gap-2.5 text-2xl">
          <span className={`grid h-9 w-9 place-items-center rounded-[11px] ${isEdit ? "bg-gold/20 text-gold" : "bg-sea/25 text-[#7fd6cb]"}`}>
            {isEdit ? <IconEdit className="h-4.5 w-4.5" /> : <IconShield className="h-4.5 w-4.5" />}
          </span>
          {isEdit ? "ویرایش بیمه" : "افزودن بیمه"}
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
          <label className={labelCls}>نام بیمه *</label>
          <input
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setErr(false);
            }}
            placeholder="مثلاً: بیمه سامان"
            className={`${inputCls} ${err ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.18)]" : ""}`}
          />
          {err && <p className={errCls}>نام بیمه الزامی است</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>حروف اختصاری (مونوگرام)</label>
            <input
              value={form.mono}
              onChange={(e) => setForm({ ...form, mono: e.target.value })}
              placeholder="مثلاً: سا"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>رنگ برند</label>
            <div className="flex items-center gap-2 rounded-[10px] border border-foam/15 bg-pine2 px-2 py-1.5">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded-[6px] border-none bg-transparent p-0"
                aria-label="انتخاب رنگ برند"
              />
              <span dir="ltr" className="text-[0.7rem] font-bold text-foam/50">{form.color}</span>
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>لوگوی بیمه (اختیاری — جایگزین مونوگرام می‌شود)</label>
          <ImagePicker
            value={form.logo}
            onChange={(v) => setForm({ ...form, logo: v })}
            maxSize={240}
            preview="rect"
            emptyIcon="news"
            placeholder="آدرس اینترنتی لوگو (URL)…"
          />
        </div>
      </div>

      <button type="submit" className={`btn mt-6 w-full justify-center ${isEdit ? "btn-gold" : "btn-sea"}`}>
        {isEdit ? (
          <>
            <IconCheck className="h-4.5 w-4.5" strokeWidth={2.2} />
            ذخیره تغییرات
          </>
        ) : (
          <>
            <IconPlus className="h-4.5 w-4.5" strokeWidth={2.2} />
            افزودن به فهرست
          </>
        )}
      </button>

      <p className="mt-3 flex items-start gap-2 text-[0.7rem] leading-6 text-foam/45">
        <IconGear className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {sync === "cloud"
          ? "اتصال ابری برقرار است؛ تغییرات همان لحظه برای همه منتشر می‌شود."
          : "اتصال ابری کامل نیست؛ تغییرات در همین مرورگر ذخیره می‌شود."}
      </p>
    </form>
  );
}

/* ─────────────── پنل اتصال ابری ─────────────── */
const SYNC_META: Record<string, { text: string; cls: string; dot: string }> = {
  off: { text: "ذخیره‌سازی محلی — تغییرات فقط در همین مرورگر دیده می‌شود", cls: "border-gold/50 bg-gold/10 text-gold", dot: "bg-gold" },
  loading: { text: "در حال دریافت فهرست مشترک از فضای ابری…", cls: "border-foam/20 bg-foam/5 text-foam/80", dot: "bg-foam/70 pulse-ring" },
  cloud: { text: "متصل به فضای ابری — هر تغییر، همان لحظه برای همه منتشر می‌شود", cls: "border-sea/50 bg-sea/15 text-[#7fd6cb]", dot: "bg-teal pulse-ring" },
  error: { text: "ارتباط با فضای ابری برقرار نشد — حالت محلی فعال است", cls: "border-clay/50 bg-clay/10 text-[#f0b3a3]", dot: "bg-clay" },
  pushfail: { text: "انتشار ناموفق — SQL را دوباره اجرا کنید یا «انتشار فوری» را بزنید", cls: "border-clay/50 bg-clay/10 text-[#f0b3a3]", dot: "bg-clay pulse-ring" },
};

function CloudPanel({ onToast }: { onToast: (msg: string, kind?: "ok" | "err") => void }) {
  const sync = useSyncState();
  const artSync = useArticleSync();
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState<"d" | "a" | null>(null);
  const [publishing, setPublishing] = useState(false);

  const meta = SYNC_META[sync] ?? SYNC_META.off;
  const artMeta = SYNC_META[artSync] ?? SYNC_META.off;

  const copy = async (kind: "d" | "a") => {
    try {
      await navigator.clipboard.writeText(kind === "d" ? SETUP_SQL : ARTICLES_SQL);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard در دسترس نیست */
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const [okD, okA] = await Promise.all([publishNow(), publishArticlesNow()]);
    setPublishing(false);
    onToast(
      okD && okA
        ? "پزشکان و مقالات برای همه‌ی بازدیدکنندگان منتشر شد ✅"
        : okD || okA
          ? "بخشی منتشر شد؛ برای بخش دیگر SQL مربوطه را اجرا کنید"
          : "انتشار ناموفق بود — اتصال را بررسی کنید ❌",
      okD && okA ? "ok" : "err",
    );
  };

  return (
    <section className="overflow-hidden rounded-[18px] border border-foam/10 bg-pine2/70">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[0.72rem] font-extrabold ${meta.cls}`}>
            <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
            پزشکان: {meta.text}
          </span>
          <span className={`flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[0.72rem] font-extrabold ${artMeta.cls}`}>
            <span className={`h-2 w-2 shrink-0 rounded-full ${artMeta.dot}`} />
            مقالات: {artMeta.text}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 rounded-[10px] bg-gold px-3.5 py-2 text-[0.76rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95 disabled:opacity-60"
          >
            <IconRefresh className={`h-4 w-4 ${publishing ? "animate-spin" : ""}`} />
            {publishing ? "در حال انتشار…" : "انتشار فوری همه"}
          </button>
          <button
            onClick={() => setShowSql((s) => !s)}
            className="rounded-[10px] border border-foam/15 px-3 py-2 text-[0.72rem] font-bold text-foam/60 transition-colors hover:bg-foam/10 hover:text-foam"
          >
            {showSql ? "بستن راهنمای SQL" : "راهنمای SQL"}
          </button>
        </div>
      </div>

      {showSql && (
        <div className="border-t border-foam/10 px-4 py-5 sm:px-6">
          <p className="text-[0.8rem] leading-7 text-foam/80">
            {isEmbeddedCfg() ? (
              <>اتصال این سایت به فضای ابری انجام شده است. اگر جدول <b className="text-foam">مقالات</b> وجود ندارد، کد زیر را در <b className="text-foam">SQL Editor</b> پروژه اجرا کنید:</>
            ) : (
              <>برای راه‌اندازی، این دو کد را در <b className="text-foam">SQL Editor</b> پروژه‌ی Supabase اجرا (Run) کنید:</>
            )}
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {([
              { kind: "d" as const, title: "جدول پزشکان", sql: SETUP_SQL },
              { kind: "a" as const, title: "جدول مقالات", sql: ARTICLES_SQL },
            ]).map((b) => (
              <div key={b.kind} className="relative">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[0.74rem] font-extrabold text-gold">{b.title}</span>
                  <button
                    onClick={() => copy(b.kind)}
                    className="flex items-center gap-1.5 rounded-[8px] bg-gold px-2.5 py-1.5 text-[0.66rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95"
                  >
                    {copied === b.kind ? <IconCheck className="h-3.5 w-3.5" strokeWidth={2.4} /> : <IconPlus className="h-3.5 w-3.5 rotate-45" strokeWidth={2.4} />}
                    {copied === b.kind ? "کپی شد" : "کپی کد"}
                  </button>
                </div>
                <pre dir="ltr" className="no-scrollbar overflow-x-auto rounded-[12px] border border-foam/10 bg-[#082a2c] p-4 text-left text-[0.66rem] leading-6 text-[#9fdcd3]">
                  {b.sql}
                </pre>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.68rem] leading-6 text-foam/45">
            بعد از اجرا، «انتشار فوری همه» را بزنید تا فهرست‌های فعلی برای همه‌ی بازدیدکنندگان ارسال شود.
          </p>
        </div>
      )}
    </section>
  );
}
