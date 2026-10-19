'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, clearToast } = useTodo();

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl glass-panel shadow-2xl border border-white/90 bg-white/95 backdrop-blur-xl text-slate-800"
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              {(!toast.type || toast.type === 'info') && <Info className="w-5 h-5 text-sky-600 shrink-0" />}
              <span className="text-sm font-semibold text-slate-800 leading-snug">{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.actionLabel && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    clearToast();
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-50 hover:bg-teal-100 active:scale-95 text-teal-800 border border-teal-200 transition-all cursor-pointer"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={clearToast}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
