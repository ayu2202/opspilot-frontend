import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

/* ── Context ─────────────────────────────────────────────────────────────── */

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/* ── Provider ────────────────────────────────────────────────────────────── */

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'success', message, duration = 3500 }) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast stack — fixed bottom-right */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Single Toast ────────────────────────────────────────────────────────── */

const styles = {
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    text: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    text: 'text-red-800',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: <Info className="h-5 w-5 text-blue-500" />,
    text: 'text-blue-800',
  },
};

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const s = styles[toast.type] || styles.info;

  useEffect(() => {
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 ${s.bg} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <span className="mt-0.5 shrink-0">{s.icon}</span>
      <p className={`text-sm font-medium ${s.text}`}>{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-auto shrink-0 rounded-md p-0.5 text-slate-400 transition hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
