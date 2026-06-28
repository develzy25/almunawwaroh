"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, TrendingDown, Wallet, 
  AlertCircle, ShieldCheck, CheckCircle2, UserCheck, Building2 
} from 'lucide-react';
import { UserProfile } from '@/types';

interface DashboardData {
  stats: {
    totalSantri: number;
    totalUstadz: number;
    totalKK: number;
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
    gratisSantri: number;
    progressKelengkapan: number;
  };
  incompleteData: {
    santriMissingFoto: number;
    santriMissingKK: number;
    santriMissingNIK: number;
    ustadzMissingFoto: number;
  };
}

export default function DashboardPage() {
  // Ambil data user profile
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api.get('/api/auth/me'),
  });

  // Ambih data statistik dari API backend
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get('/api/dashboard/stats'),
    refetchInterval: 10000, // Auto-update setiap 10 detik
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 animate-pulse rounded-2xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
          <div className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <div>
          <p className="font-semibold">Gagal memuat data dashboard</p>
          <p className="text-xs">{(error as Error)?.message || 'Terjadi kesalahan sistem.'}</p>
        </div>
      </div>
    );
  }

  const { stats, incompleteData } = data;

  // Format IDR currency helper
  const formatIDR = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800">Ringkasan Eksekutif</h1>
        <p className="text-slate-500 text-sm mt-1">Laporan analitik administrasi dan keuangan yayasan Anda.</p>
      </div>

      {/* Keuangan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Saldo Kas Utama */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-primary">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Kas Yayasan</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1 font-display tracking-tight">{formatIDR(stats.saldo)}</h3>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-brand-50/10 rounded-full blur-2xl group-hover:bg-brand-50/20 transition-all pointer-events-none" />
        </motion.div>

        {/* Pemasukan Bulanan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50/50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pemasukan</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-display tracking-tight">{formatIDR(stats.totalPemasukan)}</h3>
          </div>
        </motion.div>

        {/* Pengeluaran Bulanan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all flex items-center gap-4 relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengeluaran</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1 font-display tracking-tight">{formatIDR(stats.totalPengeluaran)}</h3>
          </div>
        </motion.div>
      </div>

      {/* Demografi & Kelengkapan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Kelengkapan Data */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-slate-800 font-display text-lg">Kelengkapan Data Organisasi</h3>
              <p className="text-xs text-slate-400 mt-0.5">Metrik kelengkapan NIK, Foto, dan berkas KK.</p>
            </div>
            <div className="px-3 py-1 bg-brand-50 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
              Audit Data
            </div>
          </div>

          <div className="flex items-center gap-6 my-4">
            {/* Visual Ring Loader */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#F1F5F9" strokeWidth="10" fill="transparent" />
                <circle cx="56" cy="56" r="48" stroke="var(--primary)" strokeWidth="10" fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - stats.progressKelengkapan / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-extrabold text-slate-800 font-display">{stats.progressKelengkapan}%</span>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Lengkap</p>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Santri Terdaftar</span>
                <span className="text-slate-800 font-semibold">{stats.totalSantri} Santri</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Ustadz/ah Aktif</span>
                <span className="text-slate-800 font-semibold">{stats.totalUstadz} Ustadz/ah</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Keluarga Terdaftar</span>
                <span className="text-slate-800 font-semibold">{stats.totalKK} KK</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500">
            <span>Syahriah Gratis: <strong className="text-slate-700">{stats.gratisSantri} Santri</strong></span>
            <span>Santri Wajib SPP: <strong className="text-slate-700">{stats.totalSantri - stats.gratisSantri} Santri</strong></span>
          </div>
        </motion.div>

        {/* Ringkasan Data Belum Lengkap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 font-display text-lg">Daftar Data Belum Lengkap</h3>
            <p className="text-xs text-slate-400 mt-0.5">Segera lengkapi berkas berikut untuk integrasi audit.</p>
          </div>

          <div className="space-y-3 my-2 flex-1">
            {/* 1. Santri Belum upload foto */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Santri belum memiliki foto profil</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg">
                {incompleteData.santriMissingFoto} Data
              </span>
            </div>

            {/* 2. Santri belum isi NIK */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Santri belum mengisi NIK</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg">
                {incompleteData.santriMissingNIK} Data
              </span>
            </div>

            {/* 3. Santri belum didaftarkan KK */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Santri belum terhubung Kartu Keluarga</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg">
                {incompleteData.santriMissingKK} Data
              </span>
            </div>

            {/* 4. Ustadz belum upload foto */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Ustadz/ah belum memiliki foto profil</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg">
                {incompleteData.ustadzMissingFoto} Data
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Banner Section */}
      <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-4">
        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 font-display">Isolasi Keamanan Data Multi-Tenant Aktif</h4>
          <p className="text-slate-500 text-xs mt-0.5">Seluruh data yang ditampilkan terbatas khusus untuk lingkup hak akses organisasi Anda di bawah yayasan <strong>{userProfile?.user?.yayasanNama || 'Yayasan'}</strong> secara terisolasi.</p>
        </div>
      </div>
    </div>
  );
}
