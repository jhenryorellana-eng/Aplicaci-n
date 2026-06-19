import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, variant = "info") => {
    counter += 1;
    set((state) => ({
      toasts: [...state.toasts, { id: counter, message, variant }],
    }));
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/** Atajo para mostrar un aviso desde cualquier componente cliente. */
export const toast = {
  success: (m: string) => useToastStore.getState().show(m, "success"),
  error: (m: string) => useToastStore.getState().show(m, "error"),
  info: (m: string) => useToastStore.getState().show(m, "info"),
};
