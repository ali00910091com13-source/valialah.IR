import { useState } from "react";
import { catMeta, readMinutes, faNum, LOGO, type Article, type TabId } from "./data";
import { useArticles } from "./articleStore";
import { Reveal, EcgLine } from "./fx";
import { ICONS, IconNews, IconStar8, IconArrow, IconClock, IconCalendar, LogoImg } from "./Icons";

type Nav = (tab: TabId, articleId?: string) => void;

/* ─────────────── جلد مقاله (با عکس یا طرح تزئینی) ─────────────── */
function Cover({ art, big = false }: { art: Article; big?: boolean }) {
  const meta = catMeta(art.category);
  const Ic = ICONS[meta.icon] ?? IconNews;
  return (
    <div
      className={`relative overflow-hidden ${big ? "rounded-[16px]" : "rounded-t-[14px]"}`}
      style={{
        background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc 55%, #0b3b38)`,
      }}
    >
      {/* عکس کاور — اگر مقاله عکس داشته باشد */}
      {art.cover && (
        <img
          src={art.cover}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${big ? "" : "aspect-[16/9]"}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-pine/70 via-pine/10 to-transparent" aria-hidden="true" />
      {!art.cover && (
        <>
          <div className="girih-light absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative flex items-center justify-between p-5" aria-hidden="true">
            <Ic className={`${big ? "h-16 w-16" : "h-10 w-10"} text-foam/90 drop-shadow`} strokeWidth={1.4} />
            <span className="font-display block text-[3.2rem] leading-none text-foam/15 sm:text-[4rem]">
              {art.title.trim().charAt(0)}
            </span>
          </div>
          <div className={`relative ${big ? "pb-6" : "pb-4"} ps-5`} aria-hidden="true" />
        </>
      )}
      <span className="absolute right-4 top-4 rounded-full bg-foam/15 px-3 py-1 text-[0.68rem] font-extrabold text-foam backdrop-blur-sm">
        {art.category}
      </span>
      {/* مُهر لوگو گوشه‌ی جلد */}
      <span className="absolute bottom-3 left-4 grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-card/95 shadow ring-1 ring-gold/50">
        <LogoImg src={LOGO} className="h-full w-full object-cover" />
      </span>
    </div>
  );
}

function Meta({ art, light = false }: { art: Article; light?: boolean }) {
  return (
    <span
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.72rem] font-bold ${
        light ? "text-foam/70" : "text-inksoft"
      }`}
    >
      <span className="flex items-center gap-1.5">
        <IconCalendar className="h-3.5 w-3.5" />
        {art.date}
      </span>
      <span className="flex items-center gap-1.5">
        <IconClock className="h-3.5 w-3.5" />
        {faNum(readMinutes(art.body))} دقیقه مطالعه
      </span>
    </span>
  );
}

/* ─────────────── تب مقالات ─────────────── */
export function ArticlesList({ onNavigate }: { onNavigate: Nav }) {
  const articles = useArticles();
  const [cat, setCat] = useState("همه");

  const cats = ["همه", ...Array.from(new Set(articles.map((a) => a.category)))];
  const list = cat === "همه" ? articles : articles.filter((a) => a.category === cat);
  const [featured, ...rest] = list;

  return (
    <div className="relative overflow-hidden">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="wrap relative pb-20 pt-10 sm:pt-14">
        {/* سربرگ */}
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">
                <IconNews className="h-4 w-4 text-gold" />
                مجله‌ی سلامت آوای مهر
              </span>
              <h1 className="font-display mt-4 text-4xl leading-[1.25] text-pine sm:text-5xl">
                دانستن، <span className="text-sea">نیمی از درمان</span> است
              </h1>
              <p className="mt-4 leading-8 text-inksoft">
                مقالات کوتاه و کاربردی که تیم درمانی ما برای شما نوشته است؛ از
                مراقبت دندان تا فیزیوتراپی، سونوگرافی و استفاده‌ی درست از بیمه.
              </p>
            </div>
            <span className="arch-ring hidden h-28 w-28 shrink-0 place-items-center overflow-hidden bg-card shadow-[0_20px_50px_-25px_rgba(11,59,56,0.5)] ring-1 ring-gold/50 sm:grid">
              <LogoImg src={LOGO} className="h-full w-full object-cover" />
            </span>
          </div>
        </Reveal>

        {/* فیلتر دسته‌ها */}
        <Reveal delay={120}>
          <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
            {cats.map((c) => {
              const active = cat === c;
              const n = c === "همه" ? articles.length : articles.filter((a) => a.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.78rem] font-extrabold transition-all duration-200 ${
                    active
                      ? "border-pine bg-pine text-gold shadow-[0_10px_24px_-10px_rgba(11,59,56,0.6)]"
                      : "border-sea/25 bg-card text-pine hover:border-sea/60 hover:bg-mist"
                  }`}
                >
                  {c}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[0.62rem] ${
                      active ? "bg-gold/20 text-gold" : "bg-mist text-inksoft"
                    }`}
                  >
                    {faNum(n)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {list.length === 0 && (
          <div className="mt-10 rounded-[18px] border border-dashed border-sea/30 bg-card p-12 text-center">
            <IconNews className="mx-auto h-10 w-10 text-sea/40" />
            <p className="mt-3 font-bold text-inksoft">در این دسته هنوز مقاله‌ای نیست.</p>
          </div>
        )}

        {/* مقاله‌ی ویژه */}
        {featured && (
          <Reveal delay={180}>
            <button
              onClick={() => onNavigate("articles", featured.id)}
              className="lift group mt-8 grid w-full overflow-hidden rounded-[20px] border border-sea/20 bg-card text-start shadow-[0_30px_70px_-40px_rgba(11,59,56,0.5)] lg:grid-cols-5"
            >
              <div className="lg:col-span-2">
                <Cover art={featured} big />
              </div>
              <div className="flex flex-col p-6 sm:p-8 lg:col-span-3">
                <span className="flex items-center gap-2 text-[0.72rem] font-extrabold text-golddeep">
                  <IconStar8 className="h-4 w-4 text-gold" />
                  مقاله‌ی ویژه
                </span>
                <h2 className="font-display mt-3 text-2xl leading-[1.4] text-pine transition-colors group-hover:text-seadeep sm:text-[2rem]">
                  {featured.title}
                </h2>
                <p className="mt-3 leading-8 text-inksoft">{featured.excerpt}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <Meta art={featured} />
                  <span className="flex items-center gap-2 text-sm font-extrabold text-seadeep">
                    ادامه مطلب
                    <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
                  </span>
                </div>
              </div>
            </button>
          </Reveal>
        )}

        {/* شبکه‌ی مقالات */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.id} delay={Math.min(i * 80, 320)}>
              <button
                onClick={() => onNavigate("articles", a.id)}
                className="lift group flex h-full w-full flex-col overflow-hidden rounded-[16px] border border-sea/15 bg-card text-start"
              >
                <Cover art={a} />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl leading-[1.45] text-pine transition-colors group-hover:text-seadeep">
                    {a.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-[0.84rem] leading-7 text-inksoft">
                    {a.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <Meta art={a} />
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-mist text-sea transition-all group-hover:bg-sea group-hover:text-foam">
                      <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="border-t border-sea/15 bg-card/70">
        <EcgLine className="h-10 w-full text-sea" />
      </div>
    </div>
  );
}

/* ─────────────── صفحه‌ی خواندن مقاله (با آدرس اختصاصی) ─────────────── */
export function ArticleView({ id, onNavigate }: { id: string; onNavigate: Nav }) {
  const articles = useArticles();
  const art = articles.find((a) => a.id === id);

  if (!art) {
    return (
      <div className="wrap py-24 text-center">
        <IconNews className="mx-auto h-12 w-12 text-sea/40" />
        <h1 className="font-display mt-4 text-3xl text-pine">مقاله پیدا نشد</h1>
        <p className="mt-2 text-inksoft">شاید این مقاله حذف یا جابه‌جا شده است.</p>
        <button onClick={() => onNavigate("articles")} className="btn btn-sea mt-6">
          <IconArrow className="h-4 w-4" />
          بازگشت به مقالات
        </button>
      </div>
    );
  }

  const meta = catMeta(art.category);
  const related = articles.filter((a) => a.id !== art.id).slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      <div className="girih absolute inset-0 opacity-40" aria-hidden="true" />
      <article className="wrap relative pb-20 pt-8 sm:pt-12">
        <Reveal>
          <button
            onClick={() => onNavigate("articles")}
            className="group flex items-center gap-2 text-sm font-extrabold text-seadeep transition-colors hover:text-gold"
          >
            <IconArrow className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
            همه‌ی مقالات
          </button>
        </Reveal>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* بدنه */}
          <div className="lg:col-span-8">
            <Reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.74rem] font-extrabold"
                style={{ background: `${meta.color}18`, color: meta.color }}
              >
                {(() => {
                  const Ic = ICONS[meta.icon] ?? IconNews;
                  return <Ic className="h-4 w-4" />;
                })()}
                {art.category}
              </span>
              <h1 className="font-display mt-4 text-3xl leading-[1.35] text-pine sm:text-[2.8rem] sm:leading-[1.3]">
                {art.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-sea/15 pb-5 text-[0.78rem] font-bold text-inksoft">
                <Meta art={art} />
                {art.author && <span>✎ {art.author}</span>}
              </div>
            </Reveal>

            <div className="article-body mt-7">
              {art.body.map((para, i) =>
                para.startsWith("## ") ? (
                  <Reveal key={i} delay={60}>
                    <h2 className="font-display mb-3 mt-9 flex items-center gap-3 text-2xl text-seadeep">
                      <IconStar8 className="h-5 w-5 shrink-0 text-gold" />
                      {para.slice(3)}
                    </h2>
                  </Reveal>
                ) : (
                  <Reveal key={i} delay={60}>
                    <p className={i === 0 ? "dropcap" : ""}>{para}</p>
                  </Reveal>
                ),
              )}
            </div>

            <Reveal delay={100}>
              <div className="mt-10 rounded-[16px] border-2 border-dashed border-sea/30 bg-card p-6 text-center">
                <p className="font-display text-xl text-pine">سؤالی درباره‌ی این موضوع دارید؟</p>
                <p className="mt-2 text-sm leading-7 text-inksoft">
                  کارشناسان ما هر روز از ۷ صبح تا ۲۳ پاسخگو هستند؛ همین حالا تماس بگیرید.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ستون کناری */}
          <aside className="lg:col-span-4">
            <Reveal delay={150}>
              <div className="overflow-hidden rounded-[18px] border border-sea/15 bg-card">
                <Cover art={art} big />
                <div className="p-5">
                  <p className="text-[0.78rem] font-bold leading-7 text-inksoft">
                    {art.excerpt}
                  </p>
                  <div className="mt-4 space-y-2 text-[0.74rem] font-bold text-inksoft">
                    <p className="flex items-center justify-between">
                      <span>دسته‌بندی</span>
                      <span style={{ color: meta.color }}>{art.category}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>زمان مطالعه</span>
                      <span className="text-pine">{faNum(readMinutes(art.body))} دقیقه</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>انتشار</span>
                      <span className="text-pine">{art.date}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* مقالات مرتبط */}
            {related.length > 0 && (
              <Reveal delay={230}>
                <h3 className="font-display mt-8 text-xl text-pine">بیشتر بخوانید</h3>
                <div className="mt-4 space-y-3">
                  {related.map((r) => {
                    const m = catMeta(r.category);
                    return (
                      <button
                        key={r.id}
                        onClick={() => onNavigate("articles", r.id)}
                        className="group flex w-full items-center gap-3 rounded-[14px] border border-sea/15 bg-card p-3.5 text-start transition-all duration-300 hover:-translate-y-0.5 hover:border-sea/50"
                      >
                        <span
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px]"
                          style={{ background: `${m.color}18`, color: m.color }}
                        >
                          {(() => {
                            const Ic = ICONS[m.icon] ?? IconNews;
                            return <Ic className="h-5 w-5" />;
                          })()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.82rem] font-extrabold leading-6 text-pine transition-colors group-hover:text-seadeep">
                            {r.title}
                          </span>
                          <span className="block text-[0.66rem] font-bold text-inksoft">
                            {faNum(readMinutes(r.body))} دقیقه • {r.category}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}
