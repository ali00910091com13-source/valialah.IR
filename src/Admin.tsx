import { useMemo, useRef, useState, type FormEvent } from "react";
import { DOCTOR_SPECS, faNum, type Doctor } from "./data";
import {
  useDoctors,
  useSyncState,
  addDoctor,
  updateDoctor,
  removeDoctor,
  resetDoctors,
  publishNow,
  reconnectCloud,
  disconnectCloud,
  isDefaultList,
} from "./doctorStore";
import {
  testCloud,
  saveCloudCfg,
  SETUP_SQL,
  getCloudCfg,
  normalizeProjectUrl,
  type TestResult,
} from "./cloud";
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
  IconCheck,
  IconArrow,
  LogoMark,
} from "./Icons";

const PASS = "avayemehr";
const AUTH_KEY = "aavm-admin-auth";

const SPEC_LABEL = Object.fromEntries(DOCTOR_SPECS.map((s) => [s.id, s.label]));
const TINTS = [
  "#d69a25",
  "#0e7c74",
  "#b65a45",
  "#5d7c2e",
  "#24408e",
  "#8a5a12",
  "#0e7490",
  "#5b5bd6",
  "#b03052",
  "#12a594",
];
const tintOf = (spec: string) => {
  const i = DOCTOR_SPECS.findIndex((s) => s.id === spec);
  return TINTS[(i < 0 ? 0 : i) % TINTS.length];
};
const monoOf = (name: string) =>
  name.replace(/^دکتر\s*/, "").replace(/^مهندس\s*/, "").trim().charAt(0) || "؟";

const inputCls =
  "w-full rounded-[10px] border border-foam/15 bg-pine2 px-3.5 py-2.5 text-sm text-foam outline-none transition-all placeholder:text-foam/35 focus:border-gold focus:shadow-[0_0_0_3px_rgba(214,154,37,0.18)]";

type Toast = { msg: string; kind: "ok" | "err" };

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1",
  );

  return (
    <div className="relative min-h-screen bg-pine text-foam">
      <div className="girih-light pointer-events-none fixed inset-0" aria-hidden="true" />
      {authed ? (
        <Dashboard onLogout={() => {
          sessionStorage.removeItem(AUTH_KEY);
          setAuthed(false);
        }} />
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
          <span className="arch-ring mx-auto grid h-16 w-16 place-items-center bg-gold text-pine">
            <LogoMark className="h-10 w-10" />
          </span>
          <h1 className="font-display mt-5 text-center text-3xl">کنسول مدیریت</h1>
          <p className="mt-2 text-center text-[0.78rem] font-bold text-foam/55">
            درمانگاه خیریه آوای مهر ولی‌الله — فقط برای مدیر مجموعه
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[0.72rem] font-extrabold text-foam/60">
                رمز عبور
              </label>
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
              {err && (
                <p className="mt-2 text-center text-[0.72rem] font-bold text-[#f0b3a3]">
                  رمز اشتباه است؛ دوباره تلاش کنید.
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-gold w-full">
              <IconKey className="h-4.5 w-4.5" />
              ورود به پنل
            </button>
          </form>
        </div>
        <a
          href="#/"
          className="mt-4 flex items-center justify-center gap-2 text-[0.78rem] font-bold text-foam/50 transition-colors hover:text-gold"
        >
          <IconArrow className="h-4 w-4" />
          بازگشت به سایت
        </a>
      </div>
    </div>
  );
}

/* ─────────────── داشبورد ─────────────── */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const doctors = useDoctors();
  const [query, setQuery] = useState("");
  const [spec, setSpec] = useState("all");
  const [editing, setEditing] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const notify = (msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast(null), 3200);
  };

  const list = useMemo(() => {
    const q = query.trim();
    return doctors
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => {
        const okSpec = spec === "all" || d.spec === spec;
        if (!okSpec) return false;
        if (!q) return true;
        return `${d.name} ${d.title} ${SPEC_LABEL[d.spec] ?? ""}`.includes(q);
      });
  }, [doctors, query, spec]);

  const dentists = doctors.filter((d) => d.spec === "dent").length;
  const specCount = new Set(doctors.map((d) => d.spec)).size;

  return (
    <div className="relative">
      {/* توست */}
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
              <span className="font-display block text-lg leading-6">کنسول مدیریت پزشکان</span>
              <span className="block text-[0.68rem] text-foam/50">
                درمانگاه خیریه آوای مهر ولی‌الله — مدیریت فهرست پزشکان و انتشار عمومی
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#/" className="btn btn-line border-gold/50! px-4! py-2! text-sm text-gold!">
              <IconArrow className="h-4 w-4" />
              مشاهده سایت
            </a>
            <button
              onClick={onLogout}
              className="btn px-4! py-2! text-sm text-foam/70 hover:bg-foam/10 hover:text-foam"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        <CloudPanel onToast={notify} />

        {/* آمار */}
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
              <span className="mt-1 block text-[0.7rem] font-bold text-foam/55 sm:text-[0.78rem]">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* فرم */}
          <section className="scroll-mt-24 rounded-[20px] border border-foam/10 bg-pine2/70 p-5 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
            <DoctorForm
              editing={editing}
              doctors={doctors}
              onDone={(msg) => {
                setEditing(null);
                notify(msg);
              }}
              onCancel={() => setEditing(null)}
            />
          </section>

          {/* فهرست */}
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
                      notify("فهرست به حالت پیش‌فرض برگشت");
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-[10px] border border-clay/50 bg-clay/10 px-3.5 py-2 text-[0.74rem] font-extrabold text-[#f0b3a3] transition-colors hover:bg-clay/20"
                >
                  <IconRefresh className="h-4 w-4" />
                  بازنشانی پیش‌فرض
                </button>
              )}
            </div>

            {/* جستجو و فیلتر */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-foam/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی نام پزشک…"
                  className={`${inputCls} pr-10`}
                />
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

            {/* ردیف‌ها */}
            <div className="mt-4 space-y-2.5">
              {list.length === 0 && (
                <div className="rounded-[16px] border border-dashed border-foam/20 p-10 text-center text-sm font-bold text-foam/50">
                  موردی یافت نشد.
                </div>
              )}
              {list.map(({ d, i }) => (
                <div
                  key={`${d.name}-${i}`}
                  className={`fadeup group flex flex-wrap items-center gap-3.5 rounded-[14px] border px-4 py-3 transition-colors sm:flex-nowrap ${
                    editing === i
                      ? "border-gold/60 bg-gold/10"
                      : "border-foam/10 bg-pine2/60 hover:border-foam/25"
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
                      <span
                        className="rounded-full px-2 py-0.5 text-[0.64rem] font-extrabold"
                        style={{ background: `${tintOf(d.spec)}22`, color: tintOf(d.spec) }}
                      >
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
                            notify(`«${d.name}» حذف شد`, "err");
                          }}
                          className="rounded-[9px] bg-clay px-3 py-1.5 text-[0.72rem] font-extrabold text-foam transition-transform active:scale-95"
                        >
                          بله
                        </button>
                        <button
                          onClick={() => setConfirming(null)}
                          className="rounded-[9px] border border-foam/20 px-3 py-1.5 text-[0.72rem] font-bold text-foam/70 hover:bg-foam/10"
                        >
                          انصراف
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditing(i);
                            document.getElementById("admin-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      </main>
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
  const empty: { name: string; spec: string; title: string; focus: string; photo: string } = {
    name: "",
    spec: DOCTOR_SPECS[0].id,
    title: "",
    focus: "",
    photo: "",
  };
  const [form, setForm] = useState(empty);
  const [errs, setErrs] = useState<{ name?: boolean; title?: boolean }>({});
  const [photoErr, setPhotoErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const sync = useSyncState();
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

  /** بارگذاری عکس از دستگاه + کوچک‌سازی خودکار */
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

  const label = "mb-1.5 block text-[0.72rem] font-extrabold text-foam/60";
  const field = (bad?: boolean) =>
    `${inputCls} ${bad ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.18)]" : ""}`;

  return (
    <form onSubmit={submit} id="admin-form" className="scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display flex items-center gap-2.5 text-2xl">
          <span
            className={`grid h-9 w-9 place-items-center rounded-[11px] ${
              isEdit ? "bg-gold/20 text-gold" : "bg-sea/25 text-[#7fd6cb]"
            }`}
          >
            {isEdit ? <IconEdit className="h-4.5 w-4.5" /> : <IconPlus className="h-4.5 w-4.5" />}
          </span>
          {isEdit ? "ویرایش پزشک" : "افزودن پزشک جدید"}
        </h3>
        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 rounded-full border border-foam/15 px-3 py-1.5 text-[0.7rem] font-bold text-foam/60 hover:bg-foam/10"
          >
            <IconClose className="h-3.5 w-3.5" />
            انصراف
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className={label}>نام و نام خانوادگی *</label>
          <input
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setErrs((x) => ({ ...x, name: false }));
            }}
            placeholder="مثلاً: دکتر سارا محمدی"
            className={field(errs.name)}
          />
          {errs.name && <p className="mt-1 text-[0.68rem] font-bold text-[#f0b3a3]">نام پزشک الزامی است</p>}
        </div>

        <div>
          <label className={label}>تخصص *</label>
          <select
            value={form.spec}
            onChange={(e) => setForm({ ...form, spec: e.target.value })}
            className={inputCls}
          >
            {DOCTOR_SPECS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>عنوان / سمت *</label>
          <input
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setErrs((x) => ({ ...x, title: false }));
            }}
            placeholder="مثلاً: متخصص داخلی"
            className={field(errs.title)}
          />
          {errs.title && <p className="mt-1 text-[0.68rem] font-bold text-[#f0b3a3]">عنوان الزامی است</p>}
        </div>

        <div>
          <label className={label}>حوزه تمرکز (اختیاری)</label>
          <input
            value={form.focus}
            onChange={(e) => setForm({ ...form, focus: e.target.value })}
            placeholder="مثلاً: بیماری‌های گوارشی"
            className={inputCls}
          />
        </div>

        <div>
          <label className={label}>عکس پزشک (اختیاری)</label>
          <div className="flex items-center gap-3">
            <span
              className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 ${
                form.photo ? "border-gold" : "border-foam/15"
              } bg-pine2`}
            >
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
          {photoErr && <p className="mt-1.5 text-[0.68rem] font-bold text-[#f0b3a3]">{photoErr}</p>}
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
          : "اتصال ابری برقرار نیست؛ تغییرات فقط در همین مرورگر ذخیره می‌شود. برای نمایش عمومی، از نوار بالای صفحه به Supabase متصل شوید."}
      </p>
    </form>
  );
}

/* ─────────────── پنل اتصال ابری ─────────────── */
const SYNC_META: Record<string, { text: string; cls: string; dot: string }> = {
  off: {
    text: "ذخیره‌سازی محلی — تغییرات فقط در همین مرورگر دیده می‌شود",
    cls: "border-gold/50 bg-gold/10 text-gold",
    dot: "bg-gold",
  },
  loading: {
    text: "در حال دریافت فهرست مشترک از فضای ابری…",
    cls: "border-foam/20 bg-foam/5 text-foam/80",
    dot: "bg-foam/70 pulse-ring",
  },
  cloud: {
    text: "متصل به فضای ابری — هر تغییر، همان لحظه برای همه منتشر می‌شود",
    cls: "border-sea/50 bg-sea/15 text-[#7fd6cb]",
    dot: "bg-teal pulse-ring",
  },
  error: {
    text: "ارتباط با فضای ابری برقرار نشد — حالت محلی فعال است",
    cls: "border-clay/50 bg-clay/10 text-[#f0b3a3]",
    dot: "bg-clay",
  },
  pushfail: {
    text: "انتشار ناموفق — SQL مرحله‌ی ۲ را دوباره اجرا کنید یا «انتشار فوری» را بزنید",
    cls: "border-clay/50 bg-clay/10 text-[#f0b3a3]",
    dot: "bg-clay pulse-ring",
  },
};

function CloudPanel({ onToast }: { onToast: (msg: string, kind?: "ok" | "err") => void }) {
  const sync = useSyncState();
  const configured = getCloudCfg() !== null;
  const [openForm, setOpenForm] = useState(false);
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string; detail?: string } | null>(null);

  const meta = SYNC_META[sync] ?? SYNC_META.off;
  const preview = normalizeProjectUrl(url);

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(SETUP_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const applyResult = (r: TestResult) => {
    switch (r.status) {
      case "bad-url":
        setMsg({
          kind: "err",
          text: "آدرس پروژه شناسایی نشد. آدرس داشبورد Supabase یا چیزی شبیه https://abcdefgh.supabase.co را بچسبانید.",
        });
        break;
      case "bad-key-format":
        setMsg({
          kind: "err",
          text: "کلید کوتاه یا ناقص به نظر می‌رسد. کلید کامل «Publishable» (یا anon public) را کپی کنید؛ با sb_publishable یا eyJ شروع می‌شود.",
        });
        break;
      case "network":
        setMsg({
          kind: "err",
          text: "ارتباط برقرار نشد (خطای شبکه). آدرس پروژه را دوباره چک کنید؛ اگر درست است، جزئیات فنی را ببینید.",
          detail: r.detail,
        });
        break;
      case "unauthorized":
        setMsg({
          kind: "err",
          text: "کلید نامعتبر است. در Project Settings ← API Keys کلید «Publishable» را کپی کنید. کلید Secret را نگذارید!",
          detail: r.detail,
        });
        break;
      case "no-table":
        setMsg({
          kind: "err",
          text: "اتصال درست است ولی جدول doctors وجود ندارد. کد SQL مرحله‌ی ۲ را در SQL Editor پروژه اجرا (Run) کنید و دوباره امتحان کنید.",
          detail: r.detail,
        });
        break;
      case "other":
        setMsg({
          kind: "err",
          text: `پاسخ غیرمنتظره از سرور (HTTP ${faNum(r.code)}). جزئیات فنی را ببینید.`,
          detail: r.detail,
        });
        break;
    }
  };

  const handleConnect = async () => {
    if (!url.trim() || !key.trim()) {
      setMsg({ kind: "err", text: "هم آدرس پروژه و هم کلید را وارد کنید." });
      return;
    }
    setBusy(true);
    setMsg(null);
    setShowDetail(false);
    const r = await testCloud(url, key);
    if (r.status !== "ok") {
      setBusy(false);
      applyResult(r);
      return;
    }
    // اتصال خواندن درست است؛ حالا تست «نوشتن» (انتشار) انجام می‌شود
    saveCloudCfg(url, key);
    const published = await publishNow();
    setBusy(false);
    if (published) {
      reconnectCloud();
      setOpenForm(false);
      setUrl("");
      setKey("");
      onToast("اتصال برقرار شد ✅ فهرست برای همه همگام‌سازی می‌شود");
    } else {
      reconnectCloud();
      setMsg({
        kind: "err",
        text: "خواندن از سرور درست است اما «نوشتن» انجام نشد؛ احتمالاً سیاست RLS اجازه نمی‌دهد. SQL مرحله‌ی ۲ (نسخه‌ی جدید) را دوباره در SQL Editor اجرا کنید، سپس «انتشار فوری» را بزنید.",
      });
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const ok = await publishNow();
    setPublishing(false);
    onToast(
      ok ? "فهرست فعلی برای همه‌ی بازدیدکنندگان منتشر شد ✅" : "انتشار ناموفق بود — اتصال را بررسی کنید ❌",
      ok ? "ok" : "err",
    );
  };

  const handleDisconnect = () => {
    if (!window.confirm("اتصال فضای ابری قطع شود؟ سایت دوباره فهرست محلی را نشان می‌دهد.")) return;
    disconnectCloud();
    onToast("اتصال قطع شد — حالت محلی فعال است");
  };

  return (
    <section className="overflow-hidden rounded-[18px] border border-foam/10 bg-pine2/70">
      {/* نوار وضعیت */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
        <span className={`flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[0.74rem] font-extrabold ${meta.cls}`}>
          <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
          {meta.text}
        </span>
        <div className="flex items-center gap-2">
          {configured ? (
            <>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-1.5 rounded-[10px] bg-gold px-3.5 py-2 text-[0.76rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95 disabled:opacity-60"
              >
                <IconRefresh className={`h-4 w-4 ${publishing ? "animate-spin" : ""}`} />
                {publishing ? "در حال انتشار…" : "انتشار فوری"}
              </button>
              <button
                onClick={handleDisconnect}
                className="rounded-[10px] border border-foam/15 px-3 py-2 text-[0.72rem] font-bold text-foam/60 transition-colors hover:bg-foam/10 hover:text-foam"
              >
                قطع اتصال
              </button>
            </>
          ) : (
            <button
              onClick={() => setOpenForm((o) => !o)}
              className="flex items-center gap-1.5 rounded-[10px] bg-gold px-3.5 py-2 text-[0.76rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95"
            >
              <IconKey className="h-4 w-4" />
              {openForm ? "بستن راهنما" : "اتصال فضای ابری"}
            </button>
          )}
        </div>
      </div>

      {/* راهنمای اتصال */}
      {!configured && openForm && (
        <div className="border-t border-foam/10 px-4 py-5 sm:px-6">
          <p className="text-[0.84rem] font-bold leading-7 text-foam/85">
            برای اینکه تغییرات پزشکان <span className="text-gold">برای همه‌ی بازدیدکنندگان</span> نمایش
            داده شود، یک دیتابیس رایگان Supabase بسازید (کمتر از ۵ دقیقه):
          </p>
          <ol className="mt-4 space-y-5">
            <li className="flex gap-3.5">
              <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea/25 text-lg text-[#7fd6cb]">۱</span>
              <span className="text-[0.8rem] leading-7 text-foam/80">
                در{" "}
                <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="font-bold text-gold underline underline-offset-4">
                  supabase.com
                </a>{" "}
                با اکانت گوگل وارد شوید و یک <b className="text-foam">New Project</b> بسازید (رایگان).
              </span>
            </li>

            <li className="flex gap-3.5">
              <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea/25 text-lg text-[#7fd6cb]">۲</span>
              <div className="min-w-0 flex-1 text-[0.8rem] leading-7 text-foam/80">
                از منوی کناری، <b className="text-foam">SQL Editor</b> را باز کنید، این کد را Paste کنید
                و دکمه‌ی <b className="text-foam">Run</b> را بزنید:
                <div className="relative mt-2.5">
                  <pre dir="ltr" className="no-scrollbar overflow-x-auto rounded-[12px] border border-foam/10 bg-[#082a2c] p-4 text-left text-[0.7rem] leading-6 text-[#9fdcd3]">
                    {SETUP_SQL}
                  </pre>
                  <button
                    onClick={copySql}
                    className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-[8px] bg-gold px-2.5 py-1.5 text-[0.66rem] font-extrabold text-pine transition-all hover:bg-golddeep hover:text-goldsoft active:scale-95"
                  >
                    {copied ? <IconCheck className="h-3.5 w-3.5" strokeWidth={2.4} /> : <IconPlus className="h-3.5 w-3.5 rotate-45" strokeWidth={2.4} />}
                    {copied ? "کپی شد" : "کپی کد"}
                  </button>
                </div>
              </div>
            </li>

            <li className="flex gap-3.5">
              <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea/25 text-lg text-[#7fd6cb]">۳</span>
              <div className="min-w-0 flex-1 text-[0.8rem] leading-7 text-foam/80">
                از منوی کناری <b className="text-foam">Project Settings ← API&nbsp;Keys</b> را باز کنید؛
                بالای همان صفحه آدرس پروژه نوشته شده (چیزی شبیه{" "}
                <span dir="ltr" className="rounded bg-foam/10 px-1.5 py-0.5 text-[0.68rem] text-[#9fdcd3]">
                  https://abcdefgh.supabase.co
                </span>
                ). آن را به‌همراه کلید <b className="text-foam">Publishable</b> (همان anon&nbsp;public) کپی کنید.
                <span className="mt-1.5 block rounded-[10px] border border-gold/40 bg-gold/10 px-3 py-2 text-[0.72rem] leading-6 text-gold">
                  راحت‌تر: آدرس مرورگرِ وقتی داخل داشبورد پروژه هستید را هم بچسبانید؛ خودکار پروژه را پیدا می‌کنیم.
                </span>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                  <div>
                    <input
                      dir="ltr"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://xxxxx.supabase.co یا آدرس داشبورد"
                      className={inputCls}
                    />
                    {preview && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[0.66rem] font-bold text-[#7fd6cb]">
                        <IconCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
                        پروژه شناسایی شد: <span dir="ltr">{preview}</span>
                      </p>
                    )}
                  </div>
                  <input
                    dir="ltr"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="sb_publishable_… یا eyJhbGciOi…"
                    className={inputCls}
                  />
                </div>
                <button
                  onClick={handleConnect}
                  disabled={busy}
                  className="mt-3 flex items-center gap-2 rounded-[10px] bg-sea px-4 py-2.5 text-[0.78rem] font-extrabold text-foam transition-all hover:bg-seadeep active:scale-95 disabled:opacity-60"
                >
                  <IconKey className="h-4 w-4" />
                  {busy ? "در حال آزمایش اتصال و انتشار…" : "اتصال و آزمایش"}
                </button>
                {msg && (
                  <div
                    className={`mt-2.5 rounded-[10px] border px-3 py-2 text-[0.72rem] font-bold leading-6 ${
                      msg.kind === "ok"
                        ? "border-sea/50 bg-sea/15 text-[#7fd6cb]"
                        : "border-clay/50 bg-clay/10 text-[#f0b3a3]"
                    }`}
                  >
                    {msg.text}
                    {msg.detail && (
                      <>
                        <button
                          onClick={() => setShowDetail((s) => !s)}
                          className="mt-1 block text-[0.66rem] font-extrabold text-foam/60 underline underline-offset-4 hover:text-foam"
                        >
                          {showDetail ? "پنهان کردن جزئیات فنی" : "نمایش جزئیات فنی"}
                        </button>
                        {showDetail && (
                          <pre dir="ltr" className="no-scrollbar mt-1.5 overflow-x-auto rounded-[8px] bg-pine/80 p-2 text-left text-[0.62rem] leading-5 text-foam/70">
                            {msg.detail}
                          </pre>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          </ol>

          <p className="mt-4 flex items-start gap-2 border-t border-foam/10 pt-3.5 text-[0.68rem] leading-6 text-foam/45">
            <IconGear className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            کلید Publishable برای استفاده‌ی عمومی طراحی شده و قرار گرفتن آن در سایت بی‌خطر است.
            پس از اتصال، همه‌ی تغییرات (افزودن، ویرایش، حذف و عکس پزشکان) برای تمام بازدیدکنندگان منتشر می‌شود.
          </p>
        </div>
      )}
    </section>
  );
}
