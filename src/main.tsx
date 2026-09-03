import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/* محافظ خطا: هیچ‌وقت صفحه‌ی سفید نشان داده نمی‌شود */
class Boundary extends React.Component<{ children: React.ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    if (this.state.err) {
      return (
        <div
          dir="rtl"
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#fbf7ec",
            fontFamily: "Vazirmatn, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "3rem" }}>🏥</div>
            <h1 style={{ color: "#0b3b38", fontSize: "1.6rem", marginTop: "0.75rem" }}>
              خطای لحظه‌ای در نمایش سایت
            </h1>
            <p style={{ color: "#566864", marginTop: "0.5rem", lineHeight: 2 }}>
              لطفاً صفحه را تازه‌سازی کنید؛ اگر مشکل ادامه داشت، با شماره‌ی ۰۲۱-۳۳۱۳۲۱۱۴ تماس بگیرید.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "1.25rem",
                background: "#0e7c74",
                color: "#e9f5f1",
                border: "none",
                borderRadius: 12,
                padding: "0.8rem 1.6rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              تازه‌سازی صفحه
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Boundary>
    <App />
  </Boundary>,
);
