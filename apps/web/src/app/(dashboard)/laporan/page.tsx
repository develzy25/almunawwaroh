"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  stats: {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
  };
}

interface SyahriahStatusItem {
  santriId: string;
  nama: string;
  jenjangNama: string;
  syahriahStatus: string;
  nominalTagihan: number;
  sudahBayar: boolean;
  statusPembayaran: string;
}

export default function LaporanPage() {
  const [selectedBulan, setSelectedBulan] = useState(new Date().getMonth() + 1);
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());

  // Queries
  const { data: dashboardData, isLoading: loadingStats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get('/api/dashboard/stats'),
  });

  const { data: syahriahData, isLoading: loadingSyahriah } = useQuery<{ data: SyahriahStatusItem[] }>({
    queryKey: ['syahriahStatus', selectedBulan, selectedTahun],
    queryFn: () => api.get(`/api/keuangan/syahriah/status?bulan=${selectedBulan}&tahun=${selectedTahun}`),
  });

  if (loadingStats || loadingSyahriah) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 animate-pulse rounded-2xl w-1/4" />
        <div className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-100 animate-pulse rounded-3xl" />
          <div className="h-48 bg-slate-100 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const syahriahList = syahriahData?.data || [];

  // Syahriah counts
  const totalWajib = syahriahList.filter((s: SyahriahStatusItem) => s.syahriahStatus === 'WAJIB').length;
  const lunasWajib = syahriahList.filter((s: SyahriahStatusItem) => s.syahriahStatus === 'WAJIB' && s.sudahBayar).length;
  const tunggakanWajib = totalWajib - lunasWajib;
  const totalGratis = syahriahList.filter((s: SyahriahStatusItem) => s.syahriahStatus === 'GRATIS').length;

  const formatIDR = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  const handleExportCSV = (type: string) => {
    alert(`Mengekspor laporan ${type} ke CSV untuk pembukuan...`);
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800">Laporan Eksekutif</h1>
          <p className="text-slate-500 text-sm mt-1">Laporan pertanggungjawaban data yayasan periode bulan {selectedBulan}/{selectedTahun}.</p>
        </div>

        {/* Filter Period */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm w-fit">
          <select 
            value={selectedBulan} 
            onChange={(e) => setSelectedBulan(Number(e.target.value))}
            className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
              <option key={m} value={m}>Bulan {m}</option>
            ))}
          </select>
          <input 
            type="number" 
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(Number(e.target.value))}
            className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs text-slate-700 w-20 focus:outline-none"
          />
        </div>
      </div>

      {/* Summary Finance Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium space-y-6"
      >
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] bg-brand-50 text-primary border border-brand-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Laporan Keuangan Yayasan
            </span>
            <h2 className="text-2xl font-bold text-slate-800 font-display mt-2">Buku Kas Utama (General Ledger)</h2>
          </div>
          <Button onClick={() => handleExportCSV('Kas-Umum')} className="rounded-xl h-9 px-4 text-xs">Ekspor Data</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Pemasukan Kas</span>
            <p className="text-xl font-bold text-emerald-600 font-display">{formatIDR(stats?.totalPemasukan || 0)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Pengeluaran Kas</span>
            <p className="text-xl font-bold text-red-500 font-display">{formatIDR(stats?.totalPengeluaran || 0)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Saldo Bersih (Net Profit)</span>
            <p className="text-xl font-bold text-slate-800 font-display">{formatIDR(stats?.saldo || 0)}</p>
          </div>
        </div>

        {/* Visual Graph Bar (Pemasukan vs Pengeluaran) */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Rasio Pemasukan ({Math.round(((stats?.totalPemasukan || 1) / ((stats?.totalPemasukan || 1) + (stats?.totalPengeluaran || 0))) * 100)}%)</span>
            <span>Rasio Pengeluaran ({Math.round(((stats?.totalPengeluaran || 0) / ((stats?.totalPemasukan || 1) + (stats?.totalPengeluaran || 0))) * 100)}%)</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${((stats?.totalPemasukan || 1) / ((stats?.totalPemasukan || 1) + (stats?.totalPengeluaran || 0))) * 100}%` }}
              className="bg-primary h-full transition-all duration-500" 
            />
            <div 
              style={{ width: `${((stats?.totalPengeluaran || 0) / ((stats?.totalPemasukan || 1) + (stats?.totalPengeluaran || 0))) * 100}%` }}
              className="bg-red-400 h-full transition-all duration-500" 
            />
          </div>
        </div>
      </motion.div>

      {/* Syahriah & Arrears Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Syahriah status reports */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 font-display text-lg">Rasio Syahriah Bulanan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Statistik kepatuhan pelunasan SPP bulan berjalan.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SPP Lunas (Wajib)</span>
              <strong className="text-slate-800 text-lg font-display mt-1 block">{lunasWajib} Santri</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Belum Membayar</span>
              <strong className="text-red-500 text-lg font-display mt-1 block">{tunggakanWajib} Santri</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Santri Gratis</span>
              <strong className="text-primary text-lg font-display mt-1 block">{totalGratis} Santri</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tagihan Aktif</span>
              <strong className="text-slate-800 text-lg font-display mt-1 block">{totalWajib} Santri</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
            <span className="text-xs text-slate-500">Tingkat Kepatuhan: <strong className="text-slate-700">{totalWajib > 0 ? Math.round((lunasWajib / totalWajib) * 100) : 100}%</strong></span>
            <Button variant="link" onClick={() => handleExportCSV('Syahriah')} className="text-xs text-primary font-bold hover:underline p-0 h-auto flex items-center gap-1">
              Ekspor SPP <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.div>

        {/* Detailed Arrears list */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-800 font-display text-lg">Daftar Santri Menunggak</h3>
            <p className="text-xs text-slate-400 mt-0.5">Segera hubungi wali santri untuk penyelesaian pembayaran.</p>
          </div>

          <div className="space-y-2 my-4 flex-1 max-h-[160px] overflow-y-auto pr-1">
            {syahriahList.filter((s: SyahriahStatusItem) => s.statusPembayaran === 'BELUM_BAYAR').map((s: SyahriahStatusItem) => (
              <div key={s.santriId} className="flex justify-between items-center p-2.5 bg-red-50/30 border border-red-50 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-slate-800">{s.nama}</p>
                  <p className="text-[10px] text-slate-400">Kelas: {s.jenjangNama}</p>
                </div>
                <strong className="text-red-600">{formatIDR(s.nominalTagihan)}</strong>
              </div>
            ))}
            {tunggakanWajib === 0 && (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-emerald-600 gap-2">
                 <CheckCircle2 className="w-8 h-8" />
                 <span className="text-xs font-semibold">Seluruh siswa wajib SPP lunas untuk periode ini!</span>
               </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-50 text-right">
            <span className="text-xs text-slate-400">Total Tunggakan: <strong className="text-red-500 font-bold">{formatIDR(syahriahList.reduce((acc: number, s: SyahriahStatusItem) => s.statusPembayaran === 'BELUM_BAYAR' ? acc + s.nominalTagihan : acc, 0))}</strong></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
