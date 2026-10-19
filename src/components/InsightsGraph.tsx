'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Award, Database } from 'lucide-react';

interface DayProductivity {
  date: string;
  dayName: string;
  completedCount: number;
}

export const InsightsGraph: React.FC = () => {
  const { tasks } = useTodo();
  const [data, setData] = useState<DayProductivity[]>([]);
  const [isUsingRpc, setIsUsingRpc] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<DayProductivity | null>(null);

  useEffect(() => {
    async function fetchRpcProductivity() {
      if (!supabase) {
        const past7Days: DayProductivity[] = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });

          const completedCount = tasks.filter((t) => {
            if (t.status !== 'done' || !t.completedAt) return false;
            return t.completedAt.startsWith(dateStr);
          }).length;

          past7Days.push({
            date: dateStr,
            dayName,
            completedCount,
          });
        }
        setData(past7Days);
        setIsUsingRpc(false);
        return;
      }

      try {
        const { data: rpcResult, error } = await supabase.rpc('get_weekly_productivity');
        if (error || !rpcResult) {
          setIsUsingRpc(false);
        } else {
          setData(rpcResult as DayProductivity[]);
          setIsUsingRpc(true);
        }
      } catch {
        setIsUsingRpc(false);
      }
    }

    fetchRpcProductivity();
  }, [tasks]);

  const maxCount = Math.max(...data.map((d) => d.completedCount), 5);
  const totalCompleted7Days = data.reduce((acc, curr) => acc + curr.completedCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-xs">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Penyelesaian 7 Hari Terakhir</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">{totalCompleted7Days} Tugas</h3>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rata-rata Harian</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {(totalCompleted7Days / 7).toFixed(1)} / hari
            </h3>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Mesin Penghitung</p>
            <h3 className="text-sm font-bold text-slate-800 mt-1">
              {isUsingRpc ? 'PostgreSQL RPC (Server)' : 'Smart Client Engine'}
            </h3>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>Grafik Produktivitas Mingguan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Statistik penyelesaian tugas per hari (arahkan kursor pada batang untuk detail)
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-semibold font-mono">
            7 Hari Terakhir
          </span>
        </div>

        {/* Minimalist Frosted Glass Bar Chart */}
        <div className="relative h-64 flex items-end justify-between gap-3 md:gap-8 pt-10 px-2">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-slate-300 w-full" />
            <div className="border-b border-slate-300 w-full" />
            <div className="border-b border-slate-300 w-full" />
            <div className="border-b border-slate-300 w-full" />
          </div>

          {data.map((item, idx) => {
            const heightPercent = maxCount > 0 ? (item.completedCount / maxCount) * 100 : 0;
            const isHovered = hoveredBar?.date === item.date;

            return (
              <div
                key={idx}
                className="relative flex-1 flex flex-col items-center group h-full justify-end"
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Floating Glass Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 z-20 px-3 py-1.5 rounded-xl glass-panel bg-white/95 border border-slate-200 text-[11px] whitespace-nowrap shadow-xl"
                  >
                    <p className="font-bold text-teal-700">{item.completedCount} tugas selesai</p>
                    <p className="text-[10px] text-slate-500">{item.date}</p>
                  </motion.div>
                )}

                {/* Animated Glass Bar */}
                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-2xl relative overflow-hidden flex items-end h-full shadow-inner">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercent, 5)}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full rounded-t-2xl transition-all duration-300 ${
                      item.completedCount > 0
                        ? 'bg-gradient-to-t from-teal-600 to-emerald-400 shadow-md shadow-teal-500/20 group-hover:from-teal-500 group-hover:to-emerald-300'
                        : 'bg-slate-200 group-hover:bg-slate-300'
                    }`}
                  />
                </div>

                {/* Day Label */}
                <div className="mt-3 text-center">
                  <span className="block text-xs font-semibold text-slate-700">{item.dayName}</span>
                  <span className="block text-[10px] text-slate-400">{item.date.slice(8)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
