import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * محافظ صفحه‌ی سفید — اگر خطایی در اجرای برنامه پیش بیاید،
 * به‌جای صفحه‌ی خالی، پیام راهنما نمایش داده می‌شود.
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          dir="rtl"
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "2rem",
            background: "#fbf7ec",
            fontFamily: "Vazirmatn, Tahoma, sans-serif",
            color: "#16302c",
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ fontFamily: "Lalezar, Vazirmatn, sans-serif", fontSize: "2.2rem", color: "#0b3b38", margin: 0 }}>
              مشکلی در نمایش سایت پیش آمد
            </h1>
            <p style={{ color: "#566864", lineHeight: 2, maxWidth: "34rem", margin: "1rem auto" }}>
              لطفاً صفحه را یک‌بار تازه‌سازی کنید (Ctrl+F5). اگر مشکل ادامه داشت،
              حافظه‌ی پنهان مرورگر را پاک کنید یا با مرورگر دیگری امتحان کنید.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#d69a25",
                color: "#0b3b38",
                border: "none",
                borderRadius: "12px",
                padding: "0.9rem 2.2rem",
                fontSize: "1rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              تازه‌سازی صفحه
            </button>
            <p style={{ color: "#98a8a4", fontSize: "0.72rem", marginTop: "1.5rem" }} dir="ltr">
              {String(this.state.error?.message ?? this.state.error)}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
