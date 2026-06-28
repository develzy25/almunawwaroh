"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { api } from '@/lib/api';

export default function DashboardRouteGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verifikasi session aktif saat memuat halaman terproteksi
  useEffect(() => {
    api.get('/api/auth/me')
      .then(() => {
        setCheckingAuth(false);
      })
      .catch(() => {
        // Jika session habis/tidak valid, tendang kembali ke login
        router.push('/login');
      });
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-medium text-slate-400">Memeriksa kredensial...</p>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
