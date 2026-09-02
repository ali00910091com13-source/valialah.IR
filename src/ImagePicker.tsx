import { useRef, useState } from "react";
import { IconPlus, IconTrash, IconDoctor, IconNews } from "./Icons";

type Props = {
  value: string;
  onChange: (v: string) => void;
  /** اندازه‌ی بیشینه‌ی خروجی به پیکسل (عکس‌ها خودکار کوچک می‌شوند) */
  maxSize?: number;
  preview?: "circle" | "rect";
  emptyIcon?: "doctor" | "news";
  placeholder?: string;
};

/**
 * انتخابگر تصویر مشترک (عکس پزشک و عکس مقاله):
 * بارگذاری از دستگاه با کوچک‌سازی خودکار + آدرس اینترنتی (URL)
 */
export default function ImagePicker({
  value,
  onChange,
  maxSize = 360,
  preview = "circle",
  emptyIcon = "doctor",
  placeholder = "آدرس اینترنتی عکس (URL)…",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");

  const onPickFile = (file: File | undefined) => {
    setErr("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("فایل انتخابی تصویر نیست؛ لطفاً JPG یا PNG انتخاب کنید.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onChange(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        onChange(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => setErr("خواندن تصویر ممکن نشد؛ فایل دیگری امتحان کنید.");
      img.src = String(reader.result);
    };
    reader.onerror = () => setErr("خواندن فایل ممکن نشد.");
    reader.readAsDataURL(file);
  };

  const EmptyIcon = emptyIcon === "news" ? IconNews : IconDoctor;
  const previewCls =
    preview === "rect"
      ? "h-16 w-20 rounded-[12px]"
      : "h-14 w-14 rounded-full";

  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className={`grid shrink-0 place-items-center overflow-hidden border-2 bg-pine2 ${previewCls} ${
            value ? "border-gold" : "border-foam/15"
          }`}
        >
          {value ? (
            <img src={value} alt="پیش‌نمایش" className="h-full w-full object-cover" />
          ) : (
            <EmptyIcon className="h-6 w-6 text-foam/30" />
          )}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            dir="ltr"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setErr("");
            }}
            placeholder={placeholder}
            className="w-full rounded-[10px] border border-foam/15 bg-pine2 px-3.5 py-2.5 text-sm text-foam outline-none transition-all placeholder:text-foam/35 focus:border-gold focus:shadow-[0_0_0_3px_rgba(214,154,37,0.18)]"
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
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
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
      {err && <p className="mt-1.5 text-[0.68rem] font-bold text-[#f0b3a3]">{err}</p>}
    </div>
  );
}
