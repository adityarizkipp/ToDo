'use client';

import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { supabase } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X, ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, currentUser, logout, showToast } = useTodo();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMessage(null);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Masukkan alamat email yang valid.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (!supabase) {
      setErrorMessage('Koneksi Supabase belum terkonfigurasi di .env.local.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        // Register new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          showToast({
            message: `Akun berhasil didaftarkan! Selamat datang, ${email.split('@')[0]}.`,
            type: 'success',
          });
          resetForm();
          setIsLoginModalOpen(false);
        } else {
          // If Supabase email confirmation is enabled
          showToast({
            message: 'Pendaftaran berhasil! Cek email untuk konfirmasi tautan verifikasi.',
            type: 'info',
          });
          resetForm();
          setIsLoginModalOpen(false);
        }
      } else {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message === 'Invalid login credentials' 
            ? 'Email atau kata sandi tidak cocok. Silakan periksa kembali.' 
            : error.message);
          setIsLoading(false);
          return;
        }

        showToast({
          message: `Selamat datang kembali, ${email.split('@')[0]}! Sesi aman aktif.`,
          type: 'success',
        });
        resetForm();
        setIsLoginModalOpen(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi gangguan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md glass-panel bg-white/95 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white text-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {currentUser ? 'Profil Pengguna' : authMode === 'signin' ? 'Masuk ke ZenTask' : 'Daftar Akun Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentUser ? (
              /* User Profile & Logout View */
              <div className="mt-5 space-y-5">
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80">
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Akun Terautentikasi</span>
                  <p className="text-base font-bold text-slate-900 mt-1">{currentUser.email}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Data to-do Anda tersimpan privat dengan enkripsi Row Level Security (RLS) PostgreSQL Supabase.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setIsLoginModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Keluar dari Akun (Logout)
                </button>
              </div>
            ) : (
              /* Auth Form (Login / Register Tabbed UI) */
              <div className="mt-5">
                {/* Tabs Segmented Control */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-white text-teal-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-teal-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar Akun</span>
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-medium leading-relaxed"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1.5">Alamat Email</label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass-input bg-white shadow-xs">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh@domain.com"
                        className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password Field with Show/Hide toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-700 font-bold">Kata Sandi</label>
                      <span className="text-[10px] text-slate-400">Min. 6 Karakter</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass-input bg-white shadow-xs">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md shadow-teal-600/20 cursor-pointer active:scale-98"
                  >
                    {isLoading ? (
                      <span>Memproses...</span>
                    ) : (
                      <>
                        <span>{authMode === 'signin' ? 'Masuk ke Dashboard' : 'Buat Akun Pribadi'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-slate-500">
                  {authMode === 'signin' ? (
                    <>
                      Belum punya akun?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setErrorMessage(null);
                        }}
                        className="text-teal-700 font-bold hover:underline cursor-pointer"
                      >
                        Daftar sekarang
                      </button>
                    </>
                  ) : (
                    <>
                      Sudah memiliki akun?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin');
                          setErrorMessage(null);
                        }}
                        className="text-teal-700 font-bold hover:underline cursor-pointer"
                      >
                        Masuk di sini
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
