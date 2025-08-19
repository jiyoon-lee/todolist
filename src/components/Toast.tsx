import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => hideToast(id), 5000);
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const getToastColorClass = (type: ToastType) => {
  switch (type) {
    case "success":
      return "bg-green-100 text-green-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "info":
      return "bg-blue-100 text-blue-800";
    default:
      return "";
  }
};

const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useContext(ToastContext)!;
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3 rounded-lg shadow-lg flex justify-between items-center ${getToastColorClass(
            toast.type
          )}`}
          role="alert"
          aria-live="assertive"
        >
          <span>{toast.message}</span>
          <button
            onClick={() => hideToast(toast.id)}
            className="ml-3"
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
