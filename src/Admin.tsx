import { useState } from "react";
import { useDoctors, addDoctor, updateDoctor, removeDoctor } from "./doctorStore";
import { useArticles, addArticle, updateArticle, removeArticle } from "./articleStore";
import { DOCTOR_SPECS, ARTICLE_CATS, faNum } from "./data";
import { IconDoctor, IconNews, IconEdit, IconTrash, IconPlus, IconClose } from "./Icons";

const ADMIN_PASSWORD = "avayemehr";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"doctors" | "articles">("doctors");

  if (!authenticated) {
    return <LoginScreen password={password} setPassword={setPassword} onLogin={() => {
      if (password === ADMIN_PASSWORD) {
        setAuthenticated(true);
      } else {
        alert("رمز عبور اشتباه است");
      }
    }} />;
  }

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-3xl text-pine">پنل مدیریت</h1>
          <button onClick={() => setAuthenticated(false)} className="btn btn-line">
            خروج
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`btn ${activeTab === "doctors" ? "btn-sea" : "btn-line"}`}
          >
            <IconDoctor className="h-5 w-5" />
            پزشکان
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={`btn ${activeTab === "articles" ? "btn-sea" : "btn-line"}`}
          >
            <IconNews className="h-5 w-5" />
            مقالات
          </button>
        </div>

        {activeTab === "doctors" ? <DoctorsManager /> : <ArticlesManager />}
      </div>
    </div>
  );
}

function LoginScreen({ password, setPassword, onLogin }: any) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="font-display text-2xl text-pine mb-6 text-center">ورود به پنل مدیریت</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="w-full px-4 py-3 border border-sea/30 rounded-lg mb-4 focus:outline-none focus:border-sea"
          onKeyPress={(e) => e.key === "Enter" && onLogin()}
        />
        <button onClick={onLogin} className="btn btn-sea w-full">
          ورود
        </button>
      </div>
    </div>
  );
}

function DoctorsManager() {
  const doctors = useDoctors();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl text-pine">مدیریت پزشکان ({faNum(doctors.length)})</h2>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn btn-gold">
          <IconPlus className="h-5 w-5" />
          افزودن پزشک
        </button>
      </div>

      {showForm && (
        <DoctorForm
          doctorId={editingId}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-4 mt-6">
        {doctors.map((doc, idx) => (
          <div key={idx} className="bg-card rounded-xl p-4 border border-sea/20 flex items-center gap-4">
            {doc.photo ? (
              <img src={doc.photo} alt={doc.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-sea/20 flex items-center justify-center">
                <IconDoctor className="h-8 w-8 text-sea" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-pine">{doc.name}</h3>
              <p className="text-sm text-inksoft">{doc.title}</p>
              {doc.focus && <p className="text-xs text-inksoft mt-1">{doc.focus}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingId(idx); setShowForm(true); }}
                className="p-2 rounded-lg bg-sea/10 hover:bg-sea/20 transition-colors"
              >
                <IconEdit className="h-5 w-5 text-sea" />
              </button>
              <button
                onClick={() => {
                  if (confirm("آیا از حذف این پزشک اطمینان دارید؟")) {
                    removeDoctor(idx);
                  }
                }}
                className="p-2 rounded-lg bg-clay/10 hover:bg-clay/20 transition-colors"
              >
                <IconTrash className="h-5 w-5 text-clay" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorForm({ doctorId, onClose }: { doctorId: number | null; onClose: () => void }) {
  const doctors = useDoctors();
  const doctor = doctorId !== null ? doctors[doctorId] : null;

  const [name, setName] = useState(doctor?.name || "");
  const [spec, setSpec] = useState(doctor?.spec || DOCTOR_SPECS[0].id as string);
  const [title, setTitle] = useState(doctor?.title || "");
  const [focus, setFocus] = useState(doctor?.focus || "");
  const [photo, setPhoto] = useState(doctor?.photo || "");

  const handleSubmit = () => {
    if (!name || !title) {
      alert("لطفاً نام و عنوان را وارد کنید");
      return;
    }

    const doctorData = {
      name,
      spec: spec as any,
      title,
      focus: focus || undefined,
      photo: photo || undefined,
    };

    if (doctorId !== null) {
      updateDoctor(doctorId, doctorData);
    } else {
      addDoctor(doctorData);
    }

    onClose();
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-sea/20 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-lg text-pine">
          {doctorId !== null ? "ویرایش پزشک" : "افزودن پزشک جدید"}
        </h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-sea/10">
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-pine mb-2">نام و نام خانوادگی</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            placeholder="مثال: دکتر علی احمدی"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">تخصص</label>
          <select
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
          >
            {DOCTOR_SPECS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">عنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            placeholder="مثال: متخصص قلب و عروق"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">حوزه تمرکز (اختیاری)</label>
          <input
            type="text"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            placeholder="مثال: جراحی قلب"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">آدرس تصویر (اختیاری)</label>
          <input
            type="text"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button onClick={handleSubmit} className="btn btn-sea w-full">
          {doctorId !== null ? "ذخیره تغییرات" : "افزودن پزشک"}
        </button>
      </div>
    </div>
  );
}

function ArticlesManager() {
  const articles = useArticles();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl text-pine">مدیریت مقالات ({faNum(articles.length)})</h2>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn btn-gold">
          <IconPlus className="h-5 w-5" />
          افزودن مقاله
        </button>
      </div>

      {showForm && (
        <ArticleForm
          articleId={editingId}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-4 mt-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-card rounded-xl p-4 border border-sea/20">
            <div className="flex items-start gap-4">
              {article.cover ? (
                <img src={article.cover} alt={article.title} className="w-24 h-24 rounded-lg object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-sea/20 flex items-center justify-center">
                  <IconNews className="h-12 w-12 text-sea" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-pine text-lg">{article.title}</h3>
                <p className="text-sm text-inksoft mt-1">{article.excerpt}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-sea/10 text-sea px-2 py-1 rounded">{article.category}</span>
                  <span className="text-xs text-inksoft">{article.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingId(article.id); setShowForm(true); }}
                  className="p-2 rounded-lg bg-sea/10 hover:bg-sea/20 transition-colors"
                >
                  <IconEdit className="h-5 w-5 text-sea" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("آیا از حذف این مقاله اطمینان دارید؟")) {
                      removeArticle(article.id);
                    }
                  }}
                  className="p-2 rounded-lg bg-clay/10 hover:bg-clay/20 transition-colors"
                >
                  <IconTrash className="h-5 w-5 text-clay" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleForm({ articleId, onClose }: { articleId: string | null; onClose: () => void }) {
  const articles = useArticles();
  const article = articleId !== null ? articles.find(a => a.id === articleId) : null;

  const [title, setTitle] = useState(article?.title || "");
  const [category, setCategory] = useState(article?.category || ARTICLE_CATS[0].id);
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [body, setBody] = useState(article?.body.join("\n\n") || "");
  const [cover, setCover] = useState(article?.cover || "");

  const handleSubmit = () => {
    if (!title || !excerpt || !body) {
      alert("لطفاً تمام فیلدهای ضروری را پر کنید");
      return;
    }

    const articleData = {
      id: articleId || `article-${Date.now()}`,
      title,
      category,
      excerpt,
      body: body.split("\n\n").filter(p => p.trim()),
      date: article?.date || new Date().toLocaleDateString("fa-IR"),
      author: article?.author || "مدیر سایت",
      cover: cover || undefined,
    };

    if (articleId !== null) {
      updateArticle(articleId, articleData);
    } else {
      addArticle(articleData);
    }

    onClose();
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-sea/20 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-lg text-pine">
          {articleId !== null ? "ویرایش مقاله" : "افزودن مقاله جدید"}
        </h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-sea/10">
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-pine mb-2">عنوان مقاله</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            placeholder="عنوان مقاله"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">دسته‌بندی</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
          >
            {ARTICLE_CATS.map((c) => (
              <option key={c.id} value={c.id}>{c.id}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">چکیده</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            rows={3}
            placeholder="خلاصه کوتاه مقاله"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">متن کامل</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            rows={10}
            placeholder="متن کامل مقاله (پاراگراف‌ها را با یک خط خالی جدا کنید)"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-pine mb-2">آدرس تصویر کاور (اختیاری)</label>
          <input
            type="text"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="w-full px-4 py-2 border border-sea/30 rounded-lg focus:outline-none focus:border-sea"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button onClick={handleSubmit} className="btn btn-sea w-full">
          {articleId !== null ? "ذخیره تغییرات" : "افزودن مقاله"}
        </button>
      </div>
    </div>
  );
}
