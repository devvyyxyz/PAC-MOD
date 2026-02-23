import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import Toast from './Toast';
import styles from './Toast.module.css';

type ToastType = 'info' | 'success' | 'error';

type ToastOptions = {
  title?: string;
  message?: string;
  type?: ToastType;
  duration?: number; // ms
};

type ToastItem = ToastOptions & { id: string };

type ToastContextValue = {
  show: (opts: ToastOptions) => string;
  hide: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const show = useCallback((opts: ToastOptions) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    const item: ToastItem = { id, title: opts.title, message: opts.message, type: opts.type || 'info' };
    setToasts(t => [item, ...t]);
    const timeout = opts.duration ?? 4000;
    if(timeout > 0){
      setTimeout(() => remove(id), timeout);
    }
    return id;
  }, [remove]);

  const hide = useCallback((id: string) => remove(id), [remove]);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map(t => (
          <Toast key={t.id} id={t.id} title={t.title} message={t.message} type={t.type} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(){
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
