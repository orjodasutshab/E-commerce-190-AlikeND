import { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-10002 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void; key?: string }) {
  const { id, message, type } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const config = {
    success: {
      bgColor: 'bg-neutral-900',
      borderColor: 'border-green-500',
      icon: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    },
    error: {
      bgColor: 'bg-neutral-900',
      borderColor: 'border-red-500',
      icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    },
    warning: {
      bgColor: 'bg-neutral-900',
      borderColor: 'border-amber-500',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    },
    info: {
      bgColor: 'bg-neutral-900',
      borderColor: 'border-cyan-500',
      icon: <Info className="w-5 h-5 text-cyan-500 shrink-0" />,
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    },
  }[type];

  return (
    <div
      id={`toast-${id}`}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-solid ${config.borderColor} ${config.bgColor} ${config.glow} transition-all duration-300 transform translate-y-0 animate-fade-in-up`}
    >
      {config.icon}
      <div className="flex-1 text-sm text-white font-medium pr-1">
        {message}
      </div>
      <button
        id={`toast-close-${id}`}
        onClick={() => onDismiss(id)}
        className="text-neutral-400 hover:text-white transition-colors p-0.5 hover:bg-neutral-800 rounded"
        title="Dismiss Toast"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
