
"use client";

import { createContext, useContext, useState } from "react";
import styles from "./ToastProvider.module.css";

const ToastContext = createContext(null);

const icones = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }

  return context;
}

export default function ToastProvider({ children }) {
  const [notificacoes, setNotificacoes] = useState([]);

  function removeToast(id) {
    setNotificacoes((anteriores) =>
      anteriores.filter((toast) => toast.id !== id)
    );

  }

  function dismissToast(id) {
  setNotificacoes((anteriores) =>
    anteriores.map((toast) =>
      toast.id === id ? { ...toast, saindo: true } : toast
    )
  );

  setTimeout(() => {
    removeToast(id);
  }, 250);
}
  function showToast({
    type = "info",
    title,
    message,
    duration = 5000,
  }) {
    const id = Date.now() + Math.random();

    setNotificacoes((anteriores) =>
  [...anteriores, { id, type, title, message }].slice(-3)
);

    if (duration > 0) {
      setTimeout(() => {
       dismissToast(id);
      }, duration);
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className={styles.container} aria-live="polite">
        {notificacoes.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]} ${
            toast.saindo ? styles.saindo : ""
                }`}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <div className={styles.icon}>
              {icones[toast.type] || icones.info}
            </div>

            <div className={styles.content}>
              {toast.title && (
                <strong className={styles.title}>
                  {toast.title}
                </strong>
              )}

              {toast.message && (
                <p className={styles.message}>
                  {toast.message}
                </p>
              )}
            </div>

            <button
              type="button"
              className={styles.close}
              onClick={() => dismissToast(toast.id)}
              aria-label="Fechar notificação"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
