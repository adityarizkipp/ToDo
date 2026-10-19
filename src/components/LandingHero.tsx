'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Layout, Zap, Lock } from 'lucide-react';
import { TaskCard } from './TaskCard';

interface LandingHeroProps {
  onEnterApp: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterApp }) => {
  const { tasks, setIsSpotlightOpen, setIsLoginModalOpen } = useTodo();
  const previewTasks = tasks.slice(0, 3);

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-10 md:py-20">
      {/* Top Banner Tag */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel bg-white/70 border border-teal-500/25 text-teal-800 text-xs font-semibold tracking-wide shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Light Zen Aesthetic • Apple Frosted Glass UI</span>
        </motion.div>
      </div>

      {/* Main Headline with Google / Samsung modern clean aesthetic */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.12]"
        >
          Fokus Lebih Jernih, <br />
          <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-sky-600 bg-clip-text text-transparent">
            Kelola Hari Tanpa Beban.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto"
        >
          Keluarkan semua isi kepalamu dalam hitungan detik. Nikmati ruang kerja yang tenang dengan suasana alam Zen,
          dirancang untuk membantumu menyelesaikan hal penting tanpa rasa cemas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-teal-600/20 active:scale-95 cursor-pointer"
          >
            <span>Buka Dashboard Penuh</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-panel bg-white/80 hover:bg-white text-slate-800 font-semibold text-sm border border-slate-200/80 transition-all cursor-pointer shadow-sm"
          >
            <Lock className="w-4 h-4 text-teal-600" />
            <span>Masuk / Sinkron Akun</span>
          </button>
        </motion.div>
      </div>

      {/* Interactive Sandbox Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl border border-white/90"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Coba Interaksi Langsung (Sandbox)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik lingkaran untuk menyelesaikan, atau klik teks untuk melihat sub-tugas.
            </p>
          </div>
          <button
            onClick={() => setIsSpotlightOpen(true)}
            className="text-xs text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
          >
            + Quick Add (⌘K)
          </button>
        </div>

        <div className="space-y-3">
          {previewTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Interaksi tersimpan otomatis di browser lokal Anda
          </span>
          <button
            onClick={onEnterApp}
            className="text-teal-700 hover:underline font-semibold cursor-pointer"
          >
            Masuk ke Aplikasi →
          </button>
        </div>
      </motion.div>

      {/* 3 Pillars Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
        <div className="glass-panel rounded-2xl p-6 border border-white/80">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-3 shadow-xs">
            <Layout className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Light Glassmorphism</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Layer frosted glass putih yang lembut di atas pemandangan danau tenang, sejuk dan nyaman di mata.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/80">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-3 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Spotlight Parser (⌘K)</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Ketik &quot;lusa #desain !high&quot; dan sistem langsung memecah tenggat waktu, tag, dan prioritas secara pintar.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">10 Usability Heuristics</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Dilengkapi Undo penghapusan, emergency exit (Esc), status sinkronisasi, dan fleksibilitas keyboard shortcuts.
          </p>
        </div>
      </div>
    </div>
  );
};
