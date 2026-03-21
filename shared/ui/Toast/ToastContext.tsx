import React, { createContext, useCallback, useContext, useState } from 'react';

export type ToastType = 'success' | 'loading' | 'message' | 'error';

export interface ToastState {
  title: string;
  text?: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: ToastState | null;
  showToast: (params: { title: string; text?: string; type: ToastType }) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((params: { title: string; text?: string; type: ToastType }) => {
    setToast({
      title: params.title,
      text: params.text,
      type: params.type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}
