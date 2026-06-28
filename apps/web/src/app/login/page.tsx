"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Lock, Building2, User, ChevronRight } from 'lucide-react';

// Form Validation Schemas
const loginSchema = z.object({
  username: z.string().min(3, { message: 'Username tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type LoginFields = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  namaYayasan: z.string().min(3, { message: 'Nama yayasan minimal 3 karakter' }),
  alamatYayasan: z.string().min(5, { message: 'Alamat yayasan minimal 5 karakter' }),
  namaUser: z.string().min(3, { message: 'Nama pengelola minimal 3 karakter' }),
});

type RegisterFields = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register: loginReg, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const { register: regReg, handleSubmit: handleRegSubmit, formState: { errors: regErrors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  // Login handler
  const onLogin = async (data: LoginFields) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await api.post('/api/auth/login', data);
      router.push('/dashboard');
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Gagal login. Silakan periksa kembali akun Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register Yayasan handler
  const onRegister = async (data: RegisterFields) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.post('/api/auth/register-yayasan', data);
      setIsRegister(false);
      alert(`Registrasi yayasan berhasil! Username Anda: ${response.username}, Password default: 123456. Harap catat informasi ini!`);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Gagal mendaftarkan yayasan baru.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-50/40 via-white to-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-100/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-50/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[440px] z-10">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Logo Al-Munawwaroh" width={64} height={64} className="w-16 h-16 rounded-[1.5rem] object-cover mx-auto shadow-sm mb-4" />
          <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900">Al-Munawwaroh</h2>
          <p className="text-slate-500 text-sm mt-1">Platform Administrasi TPQ & RTQ Terbaik di Indonesia</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 p-8 shadow-premium relative">
          <AnimatePresence mode="wait">
            {!isRegister ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 font-display">Selamat datang kembali</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Silakan masuk untuk mengelola yayasan Anda</p>
                </div>

                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        {...loginReg('username')}
                        placeholder="almunawwaroh.ketua"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                    {loginErrors.username && (
                      <span className="text-[10px] text-red-500 mt-1 block">{loginErrors.username.message as string}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        {...loginReg('password')}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                    {loginErrors.password && (
                      <span className="text-[10px] text-red-500 mt-1 block">{loginErrors.password.message as string}</span>
                    )}
                  </div>

                  <Button type="submit" className="w-full py-6 rounded-2xl font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-sm mt-6" disabled={isLoading}>
                    {isLoading ? 'Sedang Masuk...' : 'Masuk ke Aplikasi'}
                    {!isLoading && <ChevronRight className="w-4 h-4" />}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">
                    Pengelola yayasan baru?{' '}
                    <button
                      onClick={() => { setIsRegister(true); setErrorMsg(null); }}
                      className="text-primary font-semibold hover:underline"
                    >
                      Daftar Yayasan Baru
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 font-display">Registrasi Yayasan</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Daftarkan akun dan organisasi TPQ/RTQ Anda</p>
                </div>

                <form onSubmit={handleRegSubmit(onRegister)} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Nama Yayasan / Lembaga</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        {...regReg('namaYayasan')}
                        placeholder="TPQ Al-Munawwaroh"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                    {regErrors.namaYayasan && (
                      <span className="text-[10px] text-red-500 mt-1 block">{regErrors.namaYayasan.message as string}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Alamat Kantor Yayasan</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        {...regReg('alamatYayasan')}
                        placeholder="Jl. Raya Ploso No. 45..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                    {regErrors.alamatYayasan && (
                      <span className="text-[10px] text-red-500 mt-1 block">{regErrors.alamatYayasan.message as string}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Nama Pengelola (Ketua)</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        {...regReg('namaUser')}
                        placeholder="H. Muhammad Yusuf"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                    {regErrors.namaUser && (
                      <span className="text-[10px] text-red-500 mt-1 block">{regErrors.namaUser.message as string}</span>
                    )}
                  </div>



                  <Button type="submit" className="w-full py-6 rounded-2xl font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-sm mt-6" disabled={isLoading}>
                    {isLoading ? 'Mendaftarkan...' : 'Daftar Yayasan & Buat Akun'}
                    {!isLoading && <ChevronRight className="w-4 h-4" />}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">
                    Sudah memiliki akun?{' '}
                    <button
                      onClick={() => { setIsRegister(false); setErrorMsg(null); }}
                      className="text-primary font-semibold hover:underline"
                    >
                      Masuk Di Sini
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
