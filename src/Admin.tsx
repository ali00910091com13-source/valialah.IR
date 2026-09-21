import { useState } from "react";
import { useDoctors, addDoctor, updateDoctor, removeDoctor } from "./doctorStore";
import { useArticles, addArticle, updateArticle, removeArticle } from "./articleStore";
import { DOCTOR_SPECS, ARTICLE_CATS, faNum } from "./data";

const PASSWORD = "avayemehr";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState<"doctors" | "articles">("doctors");

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#fbf7ec", padding: "1rem" }}>
        <div style={{ background: "#fefcf6", borderRadius: "1.5rem", padding: "2rem", maxWidth: "24rem", width: "100%", boxShadow: "0 20px 60px -20px rgba(0,0,0,0.2)" }}>
          <h2 style={{ fontFamily: "Lalezar", fontSize: "1.8rem", textAlign: "center", marginBottom: "1.5rem", color: "#0b3b38" }}>پنل مدیریت</h2>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="رمز عبور"
            style={{ width: "100%", padding: "0.8rem", border: "2px solid #0e7c74", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}
            onKeyPress={(e) => e.key === "Enter" && (pass === PASSWORD ? setAuth(true) : alert("رمز اشتباه است"))}
          />
          <button
            onClick={() => pass === PASSWORD ? setAuth(true) : alert("رمز اشتباه است")}
            style={{ width: "100%", padding: "0.8rem", background: "#0e7c74", color: "#e9f5f1", border: "none", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: "700", cursor: "pointer" }}
          >
            ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fbf7ec", padding: "1.5rem" }}>
      <div style={{ maxWidth: "70rem", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontFamily: "Lalezar", fontSize: "2rem", color: "#0b3b38" }}>پنل مدیریت</h1>
          <button onClick={() => setAuth(false)} style={{ padding: "0.5rem 1rem", border: "2px solid #0e7c74", background: "transparent", borderRadius: "0.5rem", color: "#0e7c74", fontWeight: "700", cursor: "pointer" }}>
            خروج
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <button
            onClick={() => setTab("doctors")}
            style={{ padding: "0.6rem 1.2rem", border: "none", borderRadius: "0.5rem", fontWeight: "700", cursor: "pointer", background: tab === "doctors" ? "#0e7c74" : "#dde9e2", color: tab === "doctors" ? "#e9f5f1" : "#0b3b38" }}
          >
            پزشکان
          </button>
          <button
            onClick={() => setTab("articles")}
            style={{ padding: "0.6rem 1.2rem", border: "none", borderRadius: "0.5rem", fontWeight: "700", cursor: "pointer", background: tab === "articles" ? "#0e7c74" : "#dde9e2", color: tab === "articles" ? "#e9f5f1" : "#0b3b38" }}
          >
            مقالات
          </button>
        </div>

        {tab === "doctors" ? <DoctorsPanel /> : <ArticlesPanel />}
      </div>
    </div>
  );
}

function DoctorsPanel() {
  const doctors = useDoctors();
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "Lalezar", fontSize: "1.5rem", color: "#0b3b38" }}>پزشکان ({faNum(doctors.length)})</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} style={{ padding: "0.6rem 1.2rem", background: "#d69a25", color: "#0b3b38", border: "none", borderRadius: "0.5rem", fontWeight: "700", cursor: "pointer" }}>
          + افزودن پزشک
        </button>
      </div>

      {showForm && <DoctorForm id={editing} onClose={() => setShowForm(false)} />}

      <div style={{ display: "grid", gap: "1rem" }}>
        {doctors.map((doc, idx) => (
          <div key={idx} style={{ background: "#fefcf6", borderRadius: "0.75rem", padding: "1rem", border: "1px solid #0e7c74", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: "#dde9e2", display: "grid", placeItems: "center", fontSize: "1.5rem", fontWeight: "700", color: "#0e7c74" }}>
              {doc.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0b3b38" }}>{doc.name}</div>
              <div style={{ fontSize: "0.85rem", color: "#566864" }}>{doc.title}</div>
            </div>
            <button onClick={() => { setEditing(idx); setShowForm(true); }} style={{ padding: "0.5rem", background: "#0e7c74", color: "#e9f5f1", border: "none", borderRadius: "0.4rem", cursor: "pointer" }}>ویرایش</button>
            <button onClick={() => { if (confirm("حذف شود؟")) removeDoctor(idx); }} style={{ padding: "0.5rem", background: "#b65a45", color: "#e9f5f1", border: "none", borderRadius: "0.4rem", cursor: "pointer" }}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorForm({ id, onClose }: { id: number | null; onClose: () => void }) {
  const doctors = useDoctors();
  const doc = id !== null ? doctors[id] : null;
  const [name, setName] = useState(doc?.name || "");
  const [spec, setSpec] = useState<string>(doc?.spec || DOCTOR_SPECS[0].id);
  const [title, setTitle] = useState(doc?.title || "");
  const [focus, setFocus] = useState(doc?.focus || "");
  const [photo, setPhoto] = useState(doc?.photo || "");

  const save = () => {
    if (!name || !title) { alert("نام و عنوان الزامی است"); return; }
    const data = { name, spec: spec as any, title, focus: focus || undefined, photo: photo || undefined };
    if (id !== null) updateDoctor(id, data);
    else addDoctor(data);
    onClose();
  };

  return (
    <div style={{ background: "#fefcf6", borderRadius: "0.75rem", padding: "1.5rem", border: "2px solid #0e7c74", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3 style={{ fontFamily: "Lalezar", fontSize: "1.3rem", color: "#0b3b38" }}>{id !== null ? "ویرایش" : "افزودن"} پزشک</h3>
        <button onClick={onClose} style={{ padding: "0.3rem 0.8rem", background: "transparent", border: "1px solid #0e7c74", borderRadius: "0.4rem", cursor: "pointer" }}>×</button>
      </div>
      <div style={{ display: "grid", gap: "0.8rem" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام کامل" style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }} />
        <select value={spec} onChange={(e) => setSpec(e.target.value)} style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }}>
          {DOCTOR_SPECS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان" style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }} />
        <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="حوزه تمرکز (اختیاری)" style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }} />
        <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="آدرس تصویر (اختیاری)" style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }} />
        <button onClick={save} style={{ padding: "0.7rem", background: "#0e7c74", color: "#e9f5f1", border: "none", borderRadius: "0.4rem", fontWeight: "700", cursor: "pointer" }}>ذخیره</button>
      </div>
    </div>
  );
}

function ArticlesPanel() {
  const articles = useArticles();
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "Lalezar", fontSize: "1.5rem", color: "#0b3b38" }}>مقالات ({faNum(articles.length)})</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} style={{ padding: "0.6rem 1.2rem", background: "#d69a25", color: "#0b3b38", border: "none", borderRadius: "0.5rem", fontWeight: "700", cursor: "pointer" }}>
          + افزودن مقاله
        </button>
      </div>

      {showForm && <ArticleForm id={editing} onClose={() => setShowForm(false)} />}

      <div style={{ display: "grid", gap: "1rem" }}>
        {articles.map((art) => (
          <div key={art.id} style={{ background: "#fefcf6", borderRadius: "0.75rem", padding: "1rem", border: "1px solid #0e7c74" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "1.1rem", color: "#0b3b38" }}>{art.title}</div>
                <div style={{ fontSize: "0.85rem", color: "#566864", marginTop: "0.3rem" }}>{art.excerpt}</div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", background: "#dde9e2", padding: "0.2rem 0.5rem", borderRadius: "0.3rem" }}>{art.category}</span>
                  <span style={{ fontSize: "0.7rem", color: "#566864" }}>{art.date}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => { setEditing(art.id); setShowForm(true); }} style={{ padding: "0.5rem", background: "#0e7c74", color: "#e9f5f1", border: "none", borderRadius: "0.4rem", cursor: "pointer" }}>ویرایش</button>
                <button onClick={() => { if (confirm("حذف شود؟")) removeArticle(art.id); }} style={{ padding: "0.5rem", background: "#b65a45", color: "#e9f5f1", border: "none", borderRadius: "0.4rem", cursor: "pointer" }}>حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleForm({ id, onClose }: { id: string | null; onClose: () => void }) {
  const articles = useArticles();
  const art = id !== null ? articles.find(a => a.id === id) : null;
  const [title, setTitle] = useState(art?.title || "");
  const [category, setCategory] = useState(art?.category || ARTICLE_CATS[0].id);
  const [excerpt, setExcerpt] = useState(art?.excerpt || "");
  const [body, setBody] = useState(art?.body.join("\n\n") || "");
  const [cover, setCover] = useState(art?.cover || "");

  const save = () => {
    if (!title || !excerpt || !body) { alert("فیلدهای ضروری را پر کنید"); return; }
    const data = {
      id: id || `art-${Date.now()}`,
      title, category, excerpt,
      body: body.split("\n\n").filter(p => p.trim()),
      date: art?.date || new Date().toLocaleDateString("fa-IR"),
      author: art?.author || "مدیر سایت",
      cover: cover || undefined,
    };
    if (id !== null) updateArticle(id, data);
    else addArticle(data);
    onClose();
  };

  return (
    <div style={{ background: "#fefcf6", borderRadius: "0.75rem", padding: "1.5rem", border: "2px solid #0e7c74", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3 style={{ fontFamily: "Lalezar", fontSize: "1.3rem", color: "#0b3b38" }}>{id !== null ? "ویرایش" : "افزودن"} مقاله</h3>
        <button onClick={onClose} style={{ padding: "0.3rem 0.8rem", background: "transparent", border: "1px solid #0e7c74", borderRadius: "0.4rem", cursor: "pointer" }}>×</button>
      </div>
      <div style={{ display: "grid", gap: "0.8rem" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان" style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }}>
          {ARTICLE_CATS.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}
        </select>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="چکیده" rows={2} style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem", resize: "vertical" }} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="متن کامل (پاراگراف‌ها با خط خالی جدا شوند)" rows={8} style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem", resize: "vertical" }} />
        <input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="آدرس تصویر کاور (اختیاری)" style={{ padding: "0.6rem", border: "1px solid #0e7c74", borderRadius: "0.4rem" }} />
        <button onClick={save} style={{ padding: "0.7rem", background: "#0e7c74", color: "#e9f5f1", border: "none", borderRadius: "0.4rem", fontWeight: "700", cursor: "pointer" }}>ذخیره</button>
      </div>
    </div>
  );
}
