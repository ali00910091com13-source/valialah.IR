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
import { testCloud, saveCloudCfg, SETUP_SQL, getCloudCfg } from "./cloud";
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
    <div className="min-h-screen bg-pine text-foam">
      <div className="girih-light absolute inset-0" aria-hidden="true" />
      <div className="relative">
        {authed ? (
          <Console onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />
        ) : (
          <Gate onOk={() => { sessionStorage.setItem(AUTH_KEY, "1"); setAuthed(true); }} />
        )}
      </div>
    </div>
  );
}

/* ─────────────── دروازه رمز ─────────────── */
function Gate({ onOk }: { onOk: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const [shaking, setShaking] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (val.trim() === PASS) {
      onOk();
    } else {
      setErr(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 550);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form
        onSubmit={submit}
        className={`w-full max-w-sm rounded-[22px] border border-foam/12 bg-pine2/80 p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm ${
          shaking ? "shake" : ""
        }`}
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-gold text-pine">
          <IconKey className="h-8 w-8" />
        </div>
        <h1 className="font-display mt-5 text-center text-3xl">کنسول مدیریت</h1>
        <p className="mt-2 text-center text-sm leading-7 text-foam/60">
          این بخش مخصوص مدیر درمانگاه است؛ رمز عبور را وارد کنید.
        </p>
        <input
          dir="ltr"
          type="password"
          value={val}
          onChange={(e) => { setVal(e.target.value); setErr(false); }}
          placeholder="••••••••••"
          autoFocus
          className={`${inputCls} mt-6 text-center text-lg tracking-widest ${
            err ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.2)]" : ""
          }`}
          aria-label="رمز عبور"
        />
        {err && (
          <p className="mt-2 text-center text-[0.78rem] font-bold text-[#f0b3a3]">
            رمز اشتباه است؛ دوباره تلاش کنید.
          </p>
        )}
        <button type="submit" className="btn btn-gold mt-4 w-full justify-center">
          ورود به کنسول
        </button>
        <button
          type="button"
          onClick={() => (window.location.hash = "")}
          className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-bold text-foam/55 transition-colors hover:text-gold"
        >
          <IconArrow className="h-4 w-4" />
          بازگشت به سایت
        </button>
      </form>
    </div>
  );
}

/* ─────────────── کنسول اصلی ─────────────── */
function Console({ onLogout }: { onLogout: () => void }) {
  const doctors = useDoctors();
  const [query, setQuery] = useState("");
  const [spec, setSpec] = useState("all");
  const [editing, setEditing] = useState<number | null>(null);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = (msg: string, kind: Toast["kind"] = "ok") => {
    window.clearTimeout(toastTimer.current);
    setToast({ msg, kind });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const list = useMemo(() => {
    const q = query.trim();
    return doctors
      .map((d, index) => ({ d, index }))
      .filter(({ d }) => (spec === "all" || d.spec === spec))
      .filter(({ d }) => {
        if (!q) return true;
        return `${d.name} ${d.title} ${d.focus ?? ""} ${SPEC_LABEL[d.spec] ?? ""}`.includes(q);
      });
  }, [doctors, query, spec]);

  const dentists = doctors.filter((d) => d.spec === "dent").length;
  const specCount = new Set(doctors.map((d) => d.spec)).size;

  const startEdit = (index: number) => {
    setEditing(index);
    setConfirmDel(null);
    document.getElementById("admin-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const doRemove = (index: number) => {
    const name = doctors[index]?.name ?? "";
    removeDoctor(index);
    if (editing === index) setEditing(null);
    setConfirmDel(null);
    notify(`«${name}» از فهرست حذف شد`, "err");
  };

  const doReset = () => {
    resetDoctors();
    setEditing(null);
    setConfirmDel(null);
    notify("فهرست پزشکان به حالت پیش‌فرض برگشت");
  };

  return (
    <>
      {/* ── نوار بالایی ── */}
      <header className="sticky top-0 z-40 border-b border-foam/10 bg-pine/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-gold text-pine">
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
            <a
              href="#/"
              className="btn btn-line border-gold/50! px-4! py-2! text-sm text-gold!"
            >
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

        {/* ── آمار ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: doctors.length, label: "پزشک و متخصص", tint: "#d69a25" },
            { n: dentists, label: "دندانپزشک", tint: "#0e7c74" },
            { n: specCount, label: "تخصص فعال", tint: "#b65a45" },
          ].map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-[16px] border border-foam/10 bg-pine2/70 px-4 py-4"
            >
              <span
                className="absolute inset-y-0 start-0 w-1"
                style={{ background: s.tint }}
                aria-hidden="true"
              />
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
          {/* ── فرم افزودن / ویرایش ── */}
          <section
            id="admin-form"
            className="scroll-mt-24 rounded-[20px] border border-foam/10 bg-pine2/70 p-5 lg:col-span-2 lg:self-start lg:sticky lg:top-24"
          >
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

          {/* ── فهرست پزشکان ── */}
          <section className="lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display flex items-center gap-2.5 text-2xl">
                <IconDoctor className="h-6 w-6 text-gold" />
                فهرست پزشکان
                <span className="rounded-full bg-foam/10 px-2.5 py-0.5 text-[0.72rem] font-bold text-foam/70">
                  {faNum(list.length)} نفر
                </span>
              </h2>
              <button
                onClick={() => {
                  if (window.confirm("فهرست پزشکان به حالت پیش‌فرض سایت برگردد؟ تغییرات شما پاک می‌شود.")) doReset();
                }}
                disabled={isDefaultList()}
                className="flex items-center gap-1.5 rounded-full border border-foam/15 px-3.5 py-2 text-[0.72rem] font-bold text-foam/60 transition-all hover:border-gold/60 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconRefresh className="h-3.5 w-3.5" />
                بازنشانی به پیش‌فرض
              </button>
            </div>

            {/* جستجو و فیلتر */}
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <IconSearch className="pointer-events-none absolute start-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-foam/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی نام یا تخصص…"
                  className={`${inputCls} ps-10`}
                  aria-label="جستجوی پزشک"
                />
              </div>
              <select
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                className={`${inputCls} sm:w-52`}
                aria-label="فیلتر تخصص"
              >
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
                <div className="rounded-[16px] border-2 border-dashed border-foam/15 px-6 py-14 text-center">
                  <IconSearch className="mx-auto h-10 w-10 text-foam/25" />
                  <p className="mt-3 font-bold text-foam/60">پزشکی یافت نشد</p>
                  <p className="mt-1 text-[0.78rem] text-foam/40">
                    فیلترها را تغییر دهید یا پزشک جدیدی اضافه کنید.
                  </p>
                </div>
              )}
              {list.map(({ d, index }) => (
                <div
                  key={`${d.name}-${index}`}
                  className={`group rounded-[16px] border p-4 transition-all duration-200 ${
                    editing === index
                      ? "border-gold bg-gold/[0.07]"
                      : "border-foam/10 bg-pine2/60 hover:border-foam/25 hover:bg-pine2"
                  }`}
                >
                  {confirmDel === index ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-bold text-[#f0b3a3]">
                        «{d.name}» برای همیشه حذف شود؟
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          onClick={() => doRemove(index)}
                          className="rounded-[9px] bg-clay px-4 py-2 text-[0.78rem] font-extrabold text-foam transition-transform hover:scale-[1.03]"
                        >
                          بله، حذف شود
                        </button>
                        <button
                          onClick={() => setConfirmDel(null)}
                          className="rounded-[9px] border border-foam/20 px-4 py-2 text-[0.78rem] font-bold text-foam/70 hover:bg-foam/10"
                        >
                          انصراف
                        </button>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3.5">
                      {d.photo ? (
                        <img
                          src={d.photo}
                          alt={d.name}
                          className="h-12 w-12 shrink-0 rounded-[13px] border border-foam/15 object-cover"
                        />
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
                        <p className="mt-0.5 truncate text-[0.78rem] text-foam/60">{d.title}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() => startEdit(index)}
                          aria-label={`ویرایش ${d.name}`}
                          className="grid h-9 w-9 place-items-center rounded-[10px] border border-foam/12 text-foam/60 transition-all hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
                        >
                          <IconEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDel(index)}
                          aria-label={`حذف ${d.name}`}
                          className="grid h-9 w-9 place-items-center rounded-[10px] border border-foam/12 text-foam/60 transition-all hover:border-clay/70 hover:bg-clay/10 hover:text-[#f0b3a3]"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ── توست ── */}
      {toast && (
        <div className="fixed bottom-6 start-1/2 z-[90] translate-x-1/2">
          <div
            className={`menu-pop flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-extrabold shadow-[0_18px_50px_-16px_rgba(0,0,0,0.7)] ${
              toast.kind === "ok" ? "bg-sea text-foam" : "bg-clay text-foam"
            }`}
          >
            {toast.kind === "ok" ? <IconCheck className="h-4.5 w-4.5" strokeWidth={2.4} /> : <IconTrash className="h-4.5 w-4.5" />}
            {toast.msg}
          </div>
        </div>
      )}
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
  const empty = { name: "", spec: DOCTOR_SPECS[0].id, title: "", focus: "", photo: "" };
  const [form, setForm] = useState(empty);
  const [errs, setErrs] = useState<{ name?: boolean; title?: boolean }>({});
  const [photoErr, setPhotoErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const sync = useSyncState();
  const [loadedFor, setLoadedFor] = useState<number | null>(null);

  /* هنگام شروع ویرایش، فرم را پر کن */
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
      onDone(`تغییرات «${name}» ذخیره شد`);
    } else {
      addDoctor(doc);
      onDone(`«${name}» به فهرست پزشکان اضافه شد`);
    }
    setForm(empty);
  };

  const label = "mb-1.5 block text-[0.72rem] font-extrabold text-foam/60";
  const field = (bad?: boolean) =>
    `${inputCls} ${bad ? "border-clay! shadow-[0_0_0_3px_rgba(182,90,69,0.18)]" : ""}`;

  /* آپلود عکس از دستگاه و کوچک‌سازی خودکار برای ذخیره در مرورگر */
  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    setPhotoErr("");
    if (!file.type.startsWith("image/")) {
      setPhotoErr("فقط فایل تصویری مجاز است");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setPhotoErr("خواندن فایل ناموفق بود");
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 360;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setForm((f) => ({ ...f, photo: canvas.toDataURL("image/jpeg", 0.85) }));
      };
      img.onerror = () => setPhotoErr("تصویر قابل پردازش نیست");
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={submit}>
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
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrs((x) => ({ ...x, name: false })); }}
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
            onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrs((x) => ({ ...x, title: false })); }}
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
                value={form.photo.startsWith("data:") ? "" : form.photo}
                onChange={(e) => { setForm({ ...form, photo: e.target.value }); setPhotoErr(""); }}
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
                {form.photo.startsWith("data:") && (
                  <span className="text-[0.64rem] font-bold text-foam/40">عکس از دستگاه بارگذاری شده</span>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { onPickFile(e.target.files?.[0]); e.target.value = ""; }}
              />
            </div>
          </div>
          {photoErr && <p className="mt-1.5 text-[0.68rem] font-bold text-[#f0b3a3]">{photoErr}</p>}
        </div>
      </div>

      <button
        type="submit"
        className={`btn mt-6 w-full justify-center ${isEdit ? "btn-gold" : "btn-sea"}`}
      >
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
          ? "فضای ابری متصل است؛ تغییرات بلافاصله برای همه‌ی بازدیدکنندگان سایت منتشر می‌شود."
          : "پزشک جدید بلافاصله در تب «پزشکان» نمایش داده می‌شود؛ برای دیده‌شدن توسط همه، فضای ابری را از نوار بالای صفحه متصل کنید."}
      </p>
    </form>
  );
}

/* ─────────────── پنل فضای ابری (انتشار برای عموم) ─────────────── */

const SYNC_META: Record<string, { text: string; cls: string; dot: string }> = {
  off: {
    text: "ذخیره‌سازی محلی — تغییرات فقط در مرورگر شما دیده می‌شود",
    cls: "border-gold/40 bg-gold/10 text-gold",
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
    dot: "bg-[#5fc9bc] pulse-ring",
  },
  error: {
    text: "ارتباط با فضای ابری برقرار نشد — حالت محلی فعال است",
    cls: "border-clay/50 bg-clay/10 text-[#f0b3a3]",
    dot: "bg-clay",
  },
  pushfail: {
    text: "آخرین انتشار ناموفق بود — با دکمه‌ی «انتشار فوری» دوباره تلاش کنید",
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
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const meta = SYNC_META[sync] ?? SYNC_META.off;

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(SETUP_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleConnect = async () => {
    if (!url.trim() || !key.trim()) {
      setMsg({ kind: "err", text: "هم آدرس پروژه و هم کلید anon را وارد کنید." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const r = await testCloud(url, key);
    setBusy(false);
    if (r.ok) {
      saveCloudCfg(url, key);
      reconnectCloud();
      setOpenForm(false);
      setUrl("");
      setKey("");
      onToast("اتصال برقرار شد ✅ فهرست برای همه همگام‌سازی می‌شود");
    } else if (r.missingTable) {
      setMsg({
        kind: "err",
        text: "اتصال درست است، اما جدول doctors ساخته نشده — ابتدا SQL مرحله‌ی ۲ را در SQL Editor اجرا کنید.",
      });
    } else {
      setMsg({
        kind: "err",
        text: "اتصال برقرار نشد — Project URL و anon public key را از تنظیمات پروژه‌ی Supabase کپی کنید.",
      });
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const ok = await publishNow();
    setPublishing(false);
    onToast(ok ? "فهرست فعلی برای همه‌ی بازدیدکنندگان منتشر شد ✅" : "انتشار ناموفق بود — اتصال را بررسی کنید ❌", ok ? "ok" : "err");
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
              اتصال فضای ابری (نمایش برای عموم)
            </button>
          )}
        </div>
      </div>

      {/* راهنمای اتصال */}
      {openForm && !configured && (
        <div className="border-t border-foam/10 px-4 py-5 sm:px-5">
          <h3 className="font-display text-xl text-gold">راه‌اندازی نمایش عمومی — فقط یک‌بار، حدود ۵ دقیقه</h3>
          <p className="mt-2 text-[0.8rem] leading-7 text-foam/70">
            سایت روی گیت‌هاب «استاتیک» است و حافظه‌ی مشترک ندارد؛ با یک دیتابیس رایگان
            Supabase، هر تغییری که این‌جا ذخیره کنید <b className="text-foam">همان لحظه برای همه‌ی بازدیدکنندگان</b> نمایش داده می‌شود.
          </p>

          <ol className="mt-5 space-y-5">
            <li className="flex gap-3.5">
              <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea/25 text-lg text-[#7fd6cb]">۱</span>
              <div className="text-[0.8rem] leading-7 text-foam/80">
                در <a href="https://supabase.com" target="_blank" rel="noreferrer" className="font-extrabold text-gold underline underline-offset-4">supabase.com</a> با
                اکانت گوگل وارد شوید (رایگان) و یک <b className="text-foam">New Project</b> بسازید
                (رمز قوی بگذارید؛ منطقه‌ی دلخواه).
              </div>
            </li>

            <li className="flex gap-3.5">
              <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea/25 text-lg text-[#7fd6cb]">۲</span>
              <div className="min-w-0 flex-1 text-[0.8rem] leading-7 text-foam/80">
                از منوی سمت چپ، <b className="text-foam">SQL Editor</b> را باز کنید، این کد را
                Paste کنید و دکمه‌ی <b className="text-foam">Run</b> را بزنید:
                <div className="relative mt-2.5">
                  <pre dir="ltr" className="no-scrollbar overflow-x-auto rounded-[12px] border border-foam/10 bg-[#082a2c] p-4 text-left text-[0.7rem] leading-6 text-[#9fdcd3]">
                    {SETUP_SQL}
                  </pre>
                  <button
                    onClick={copySql}
                    className={`absolute end-2.5 top-2.5 flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[0.66rem] font-extrabold transition-all active:scale-95 ${
                      copied ? "bg-sea text-foam" : "bg-foam/10 text-foam/80 hover:bg-foam/20"
                    }`}
                  >
                    {copied ? <IconCheck className="h-3.5 w-3.5" strokeWidth={2.4} /> : <IconEdit className="h-3.5 w-3.5" />}
                    {copied ? "کپی شد" : "کپی کد"}
                  </button>
                </div>
              </div>
            </li>

            <li className="flex gap-3.5">
              <span className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea/25 text-lg text-[#7fd6cb]">۳</span>
              <div className="min-w-0 flex-1 text-[0.8rem] leading-7 text-foam/80">
                در <b className="text-foam">Project Settings ← API</b>، مقدار <b className="text-foam">Project URL</b> و
                کلید <b className="text-foam">anon&nbsp;public</b> را کپی و این‌جا وارد کنید:
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                  <input
                    dir="ltr"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xxxxx.supabase.co"
                    className={inputCls}
                  />
                  <input
                    dir="ltr"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="eyJhbGciOi… (anon public key)"
                    className={inputCls}
                  />
                </div>
                <button
                  onClick={handleConnect}
                  disabled={busy}
                  className="mt-3 flex items-center gap-2 rounded-[10px] bg-sea px-4 py-2.5 text-[0.78rem] font-extrabold text-foam transition-all hover:bg-seadeep active:scale-95 disabled:opacity-60"
                >
                  <IconKey className="h-4 w-4" />
                  {busy ? "در حال آزمایش اتصال…" : "اتصال و آزمایش"}
                </button>
                {msg && (
                  <p className={`mt-2.5 rounded-[10px] border px-3 py-2 text-[0.72rem] font-bold leading-6 ${
                    msg.kind === "ok"
                      ? "border-sea/50 bg-sea/15 text-[#7fd6cb]"
                      : "border-clay/50 bg-clay/10 text-[#f0b3a3]"
                  }`}>
                    {msg.text}
                  </p>
                )}
              </div>
            </li>
          </ol>

          <p className="mt-4 flex items-start gap-2 border-t border-foam/10 pt-3.5 text-[0.68rem] leading-6 text-foam/45">
            <IconGear className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            کلید anon برای استفاده‌ی عمومی طراحی شده و قرار گرفتن آن در سایت بی‌خطر است.
            تنظیمات فقط در همین مرورگر ذخیره می‌شود؛ پس از اتصال، همه‌ی تغییرات (افزودن،
            ویرایش، حذف و عکس پزشکان) برای تمام بازدیدکنندگان منتشر می‌شود.
          </p>
        </div>
      )}
    </section>
  );
}
