"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Plus, Printer, X, TrendingUp, TrendingDown, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToPDF } from '@/lib/pdf';

interface SyahriahStatusItem {
  santriId: string;
  nama: string;
  jenjangNama: string;
  syahriahStatus: string;
  nominalTagihan: number;
  sudahBayar: boolean;
  statusPembayaran: string;
  detailPembayaran?: {
    id: string;
    tanggalBayar: string;
    jumlahBayar: number;
    catatan?: string | null;
  } | null;
}

interface SyahriahStatusResponse {
  bulan: number;
  tahun: number;
  data: SyahriahStatusItem[];
}

interface TabunganSummary {
  santriId: string;
  nama: string;
  statusAktif: boolean;
  saldo: number;
}

interface TabunganDetailMutasi {
  id: string;
  tanggal: string;
  jenis: 'SETOR' | 'TARIK';
  jumlah: number;
  keterangan?: string | null;
  saldo: number;
}

interface TabunganDetailResponse {
  santri: {
    id: string;
    nama: string;
    alamat: string;
  };
  totalSaldo: number;
  mutasi: TabunganDetailMutasi[];
}

interface PemasukanItem {
  id: string;
  tanggal: string;
  jumlah: number;
  sumber: string;
  keterangan?: string | null;
}

interface PengeluaranItem {
  id: string;
  tanggal: string;
  jumlah: number;
  kategori: string;
  keterangan?: string | null;
}

interface PenggajianItem {
  id: string;
  bulan: number;
  tahun: number;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  totalDiterima: number;
  tanggalDibayar: string;
  status: string;
  ustadzNama: string;
}

interface SyahriahPaymentFields {
  santriId: string;
  bulan: number;
  tahun: number;
  jumlahBayar: number;
  tanggalBayar: string;
  catatan?: string | null;
}

interface TabunganTransactionFields {
  santriId: string;
  jenisTransaksi: 'SETOR' | 'TARIK';
  jumlah: number;
  tanggalTransaksi: string;
  keterangan?: string | null;
}

interface PemasukanFields {
  tanggal: string;
  jumlah: number;
  sumber: string;
  keterangan?: string | null;
}

interface PengeluaranFields {
  tanggal: string;
  jumlah: number;
  kategori: string;
  keterangan?: string | null;
}

export default function KeuanganPage() {
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<'syahriah' | 'tabungan' | 'kas' | 'gaji'>('syahriah');
  
  // Date period states
  const [selectedBulan, setSelectedBulan] = useState(new Date().getMonth() + 1);
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
  
  // Modals state
  const [showPaySyahriahModal, setShowPaySyahriahModal] = useState<SyahriahStatusItem | null>(null);
  const [selectedSantriTabunganId, setSelectedSantriTabunganId] = useState<string | null>(null);
  const [showSavingTxModal, setShowSavingTxModal] = useState<{ santriId: string; jenisTransaksi: 'SETOR' | 'TARIK' } | null>(null);
  const [showPemasukanModal, setShowPemasukanModal] = useState(false);
  const [showPengeluaranModal, setShowPengeluaranModal] = useState(false);

  // ----------------------------------------
  // Queries
  // ----------------------------------------
  
  const { data: yayasanDetail } = useQuery<Record<string, unknown>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
  });

  // 1. Syahriah list
  const { data: syahriahData, isLoading: loadingSyahriah } = useQuery<SyahriahStatusResponse>({
    queryKey: ['syahriahStatus', selectedBulan, selectedTahun],
    queryFn: () => api.get(`/api/keuangan/syahriah/status?bulan=${selectedBulan}&tahun=${selectedTahun}`),
  });

  // 2. Tabungan list
  const { data: tabunganList = [] } = useQuery<TabunganSummary[]>({
    queryKey: ['tabungan'],
    queryFn: () => api.get('/api/keuangan/tabungan'),
  });

  // 3. Tabungan detail mutasi (Savings Ledger statement)
  const { data: tabunganDetail, isLoading: loadingMutasi } = useQuery<TabunganDetailResponse>({
    queryKey: ['tabunganMutasi', selectedSantriTabunganId],
    queryFn: () => api.get(`/api/keuangan/tabungan/${selectedSantriTabunganId}`),
    enabled: !!selectedSantriTabunganId,
  });

  // 4. Kas Pemasukan & Pengeluaran
  const { data: pemasukanList = [] } = useQuery<PemasukanItem[]>({
    queryKey: ['pemasukan'],
    queryFn: () => api.get('/api/keuangan/pemasukan'),
  });

  const { data: pengeluaranList = [] } = useQuery<PengeluaranItem[]>({
    queryKey: ['pengeluaran'],
    queryFn: () => api.get('/api/keuangan/pengeluaran'),
  });

  // 5. Gaji Terbayar
  const { data: penggajianList = [] } = useQuery<PenggajianItem[]>({
    queryKey: ['penggajian'],
    queryFn: () => api.get('/api/keuangan/penggajian'),
  });

  // ----------------------------------------
  // Mutations
  // ----------------------------------------
  
  const paySyahriahMutation = useMutation({
    mutationFn: (data: SyahriahPaymentFields) => api.post('/api/keuangan/syahriah/bayar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syahriahStatus'] });
      queryClient.invalidateQueries({ queryKey: ['pemasukan'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setShowPaySyahriahModal(null);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const saveSavingTxMutation = useMutation({
    mutationFn: (data: TabunganTransactionFields) => api.post('/api/keuangan/tabungan/transaksi', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabungan'] });
      queryClient.invalidateQueries({ queryKey: ['tabunganMutasi'] });
      setShowSavingTxModal(null);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const savePemasukanMutation = useMutation({
    mutationFn: (data: PemasukanFields) => api.post('/api/keuangan/pemasukan', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pemasukan'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setShowPemasukanModal(false);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const savePengeluaranMutation = useMutation({
    mutationFn: (data: PengeluaranFields) => api.post('/api/keuangan/pengeluaran', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setShowPengeluaranModal(false);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const formatIDR = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Printable Book layout generator
  const handlePrintTabungan = () => {
    if (!tabunganDetail) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = tabunganDetail.mutasi.map((m: TabunganDetailMutasi) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; font-size: 12px;">${m.tanggal}</td>
        <td style="padding: 10px; font-size: 12px; color: ${m.jenis === 'SETOR' ? 'green' : 'red'};">${m.jenis}</td>
        <td style="padding: 10px; font-size: 12px;">Rp${m.jumlah.toLocaleString('id-ID')}</td>
        <td style="padding: 10px; font-size: 12px;">Rp${m.saldo.toLocaleString('id-ID')}</td>
        <td style="padding: 10px; font-size: 11px; color: #666;">${m.keterangan || '-'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Buku Tabungan - ${tabunganDetail.santri.nama}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; text-align: left; }
            th { padding: 10px; background: #f8f9fa; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #dee2e6; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h2>BUKU TABUNGAN SANTRI</h2>
            <p>Taman Pendidikan Al-Qur'an / Rumah Tahfidz Qur'an Al-Munawwaroh</p>
          </div>
          <div class="meta">
            <div>
              <strong>Nama Santri:</strong> ${tabunganDetail.santri.nama}<br/>
              <strong>Alamat:</strong> ${tabunganDetail.santri.alamat}
            </div>
            <div style="text-align: right;">
              <strong>Total Saldo Koperasi:</strong> <span style="font-size: 18px; color: green;">Rp${tabunganDetail.totalSaldo.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Saldo</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportPDFMaster = () => {
    const yayasanName = yayasanDetail?.nama || "Yayasan Al-Munawwaroh";
    const yayasanAddress = yayasanDetail?.alamat || "Sistem Informasi Manajemen Terpadu";

    if (activeSubTab === 'syahriah') {
      const data = syahriahData?.data.map(item => [
        item.nama, item.jenjangNama, item.syahriahStatus, formatIDR(item.nominalTagihan), item.statusPembayaran
      ]) || [];
      exportToPDF({
        title: 'Laporan SPP Syahriah (Bulan ' + selectedBulan + ' Tahun ' + selectedTahun + ')',
        yayasanName: yayasanName as string, yayasanAddress: yayasanAddress as string,
        columns: ['Nama Santri', 'Jenjang', 'Status Berjalan', 'Tagihan', 'Status Pembayaran'],
        data, filename: 'Laporan_Syahriah_' + selectedBulan + '_' + selectedTahun
      });
    } else if (activeSubTab === 'tabungan') {
      const data = tabunganList.map(item => [
        item.nama, formatIDR(item.saldo)
      ]);
      exportToPDF({
        title: 'Laporan Rekapitulasi Tabungan Santri',
        yayasanName: yayasanName as string, yayasanAddress: yayasanAddress as string,
        columns: ['Nama Santri', 'Total Saldo (Rp)'],
        data, filename: 'Laporan_Tabungan_Santri'
      });
    } else if (activeSubTab === 'kas') {
      // For Kas, combine and sort Pemasukan and Pengeluaran
      const mutasi = [
        ...pemasukanList.map(p => ({ ...p, type: 'IN' as const, date: new Date(p.tanggal) })),
        ...pengeluaranList.map(p => ({ ...p, type: 'OUT' as const, date: new Date(p.tanggal) }))
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      const data = mutasi.map(item => [
        item.tanggal,
        item.type === 'IN' ? 'Pemasukan' : 'Pengeluaran',
        item.type === 'IN' ? (item as unknown as Record<string, string>).sumber : (item as unknown as Record<string, string>).kategori,
        formatIDR(item.jumlah),
        item.keterangan || '-'
      ]);
      exportToPDF({
        title: 'Buku Kas Umum (Ledger)',
        yayasanName: yayasanName as string, yayasanAddress: yayasanAddress as string,
        columns: ['Tanggal', 'Jenis', 'Kategori/Sumber', 'Nominal', 'Keterangan'],
        data, filename: 'Laporan_Kas_Umum'
      });
    } else if (activeSubTab === 'gaji') {
      const data = penggajianList.map(item => [
        item.tanggalDibayar, item.ustadzNama, `Bulan ${item.bulan} ${item.tahun}`,
        formatIDR(item.gajiPokok), formatIDR(item.tunjangan), formatIDR(item.potongan), formatIDR(item.totalDiterima)
      ]);
      exportToPDF({
        title: 'Riwayat Penggajian Ustadz/ah',
        yayasanName: yayasanName as string, yayasanAddress: yayasanAddress as string,
        columns: ['Tanggal Dibayar', 'Nama Ustadz/ah', 'Periode', 'Gaji Pokok', 'Tunjangan', 'Potongan', 'Total Dibayar'],
        data, filename: 'Laporan_Penggajian'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800">Manajemen Keuangan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola SPP Syahriah bulanan, Koperasi Tabungan, slip Pemasukan & Pengeluaran.</p>
        </div>
        
        <Button onClick={handleExportPDFMaster} variant="outline" className="rounded-2xl h-12 px-6 font-semibold flex items-center gap-2 border-slate-200 hover:bg-slate-50">
          <FileText className="w-5 h-5 text-red-500" />
          Cetak Laporan PDF
        </Button>
      </div>

      {/* Modern Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-lg overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'syahriah', label: 'SPP Syahriah' },
          { id: 'tabungan', label: 'Tabungan Koperasi' },
          { id: 'kas', label: 'Kas Umum (Ledger)' },
          { id: 'gaji', label: 'Riwayat Gaji' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as 'syahriah' | 'tabungan' | 'kas' | 'gaji')}
            className={`flex-1 px-4 py-2.5 text-center text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ==========================================================
            TAB 1: SYAHRIAH (SPP)
            ========================================================== */}
        {activeSubTab === 'syahriah' && (
          <motion.div
            key="syahriah-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Filter Period */}
            <div className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm w-fit">
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

            {/* Syahriah Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Santri</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Program</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tagihan SPP</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Pembayaran</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loadingSyahriah ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm text-slate-400">Loading data SPP...</td>
                      </tr>
                    ) : (
                      syahriahData?.data?.map((s: SyahriahStatusItem) => (
                        <tr key={s.santriId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-sm font-semibold text-slate-800">{s.nama}</td>
                          <td className="p-4 text-xs text-slate-500">{s.jenjangNama}</td>
                          <td className="p-4 text-sm font-semibold text-slate-800">{formatIDR(s.nominalTagihan)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                              s.statusPembayaran === 'LUNAS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              s.statusPembayaran === 'GRATIS' ? 'bg-brand-50 text-primary border border-brand-100' :
                              'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {s.statusPembayaran}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {s.statusPembayaran === 'BELUM_BAYAR' && (
                              <Button 
                                onClick={() => setShowPaySyahriahModal(s)}
                                className="rounded-xl px-4 py-1 text-xs h-8"
                              >
                                Bayar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================================
            TAB 2: TABUNGAN KOPERASI
            ========================================================== */}
        {activeSubTab === 'tabungan' && (
          <motion.div
            key="tabungan-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Savings list */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Santri</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Saldo Koperasi</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {tabunganList.map((t) => (
                      <tr 
                        key={t.santriId} 
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedSantriTabunganId === t.santriId ? 'bg-brand-50/30' : ''}`}
                        onClick={() => setSelectedSantriTabunganId(t.santriId)}
                      >
                        <td className="p-4 text-sm font-semibold text-slate-800">{t.nama}</td>
                        <td className="p-4 text-sm font-bold text-slate-850">{formatIDR(t.saldo)}</td>
                        <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-2 justify-end">
                            <Button 
                              onClick={() => setShowSavingTxModal({ santriId: t.santriId, jenisTransaksi: 'SETOR' })}
                              className="rounded-xl px-3 py-1 text-[11px] h-8"
                            >
                              Setor
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setShowSavingTxModal({ santriId: t.santriId, jenisTransaksi: 'TARIK' })}
                              className="rounded-xl px-3 py-1 text-[11px] h-8 border-slate-100 text-slate-650 hover:bg-slate-50"
                            >
                              Tarik
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Savings ledger history view */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col justify-between min-h-[400px]">
              {selectedSantriTabunganId ? (
                loadingMutasi ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                    <span className="text-xs text-slate-400">Loading mutasi...</span>
                  </div>
                ) : (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-800 text-base font-display">Mutasi Tabungan</h3>
                          <p className="text-xs text-slate-400 font-semibold">{tabunganDetail?.santri?.nama}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={handlePrintTabungan}
                            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedSantriTabunganId(null)}
                            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50/50 rounded-2xl flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Saldo Koperasi:</span>
                        <strong className="text-primary text-base font-extrabold font-display">{formatIDR(tabunganDetail?.totalSaldo || 0)}</strong>
                      </div>

                      {/* Mutasi Ledger list */}
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {tabunganDetail?.mutasi?.map((m: TabunganDetailMutasi) => (
                          <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-[11px]">
                            <div>
                              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                <span className={m.jenis === 'SETOR' ? 'text-green-600' : 'text-red-500'}>{m.jenis}</span>
                                <span className="text-slate-400 font-medium">({m.tanggal})</span>
                              </div>
                              <p className="text-slate-400 font-light mt-0.5">{m.keterangan || '-'}</p>
                            </div>
                            <div className="text-right">
                              <strong className="text-slate-800">{formatIDR(m.jumlah)}</strong>
                              <p className="text-[9px] text-slate-400">Saldo: {formatIDR(m.saldo)}</p>
                            </div>
                          </div>
                        ))}
                        {(tabunganDetail?.mutasi?.length || 0) === 0 && (
                          <span className="text-xs text-slate-400 block text-center py-6">Belum ada riwayat transaksi.</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Wallet className="w-10 h-10 mb-3 text-slate-200" />
                  <span className="text-xs">Pilih salah satu baris santri untuk mencetak buku tabungan atau memantau riwayat mutasi koperasi.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==========================================================
            TAB 3: KAS UMUM (Ledger Kas)
            ========================================================== */}
        {activeSubTab === 'kas' && (
          <motion.div
            key="kas-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Pemasukan Card Log */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 font-display">Log Pemasukan Kas</h3>
                </div>
                <Button onClick={() => setShowPemasukanModal(true)} className="rounded-xl h-9 px-3 text-xs flex items-center gap-1 shadow-sm">
                  <Plus className="w-4 h-4" /> Entri Pemasukan
                </Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {pemasukanList.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-700 uppercase tracking-wider">{p.sumber}</span>
                      <p className="text-slate-500 font-medium mt-1">{p.keterangan || 'Tanpa deskripsi'}</p>
                      <p className="text-[10px] text-slate-400 font-light">{p.tanggal}</p>
                    </div>
                    <strong className="text-slate-800 text-sm font-semibold">{formatIDR(p.jumlah)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengeluaran Card Log */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 font-display">Log Pengeluaran Kas</h3>
                </div>
                <Button onClick={() => setShowPengeluaranModal(true)} className="rounded-xl h-9 px-3 text-xs flex items-center gap-1 shadow-sm">
                  <Plus className="w-4 h-4" /> Entri Pengeluaran
                </Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {pengeluaranList.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-red-50 text-[9px] font-bold text-red-600 uppercase tracking-wider">{p.kategori}</span>
                      <p className="text-slate-500 font-medium mt-1">{p.keterangan || 'Tanpa deskripsi'}</p>
                      <p className="text-[10px] text-slate-400 font-light">{p.tanggal}</p>
                    </div>
                    <strong className="text-slate-800 text-sm font-semibold">{formatIDR(p.jumlah)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================================
            TAB 4: PENGGAJIAN TERBAYAR (Slip)
            ========================================================== */}
        {activeSubTab === 'gaji' && (
          <motion.div
            key="gaji-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Ustadz/ah</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Periode</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Gaji Pokok</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tunjangan / Potongan</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Dibayar</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tanggal Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {penggajianList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                      <td className="p-4 font-semibold text-slate-800">{p.ustadzNama}</td>
                      <td className="p-4 text-xs text-slate-500">Bulan {p.bulan}/{p.tahun}</td>
                      <td className="p-4 text-slate-700">{formatIDR(p.gajiPokok)}</td>
                      <td className="p-4 text-xs text-slate-550">
                        +{formatIDR(p.tunjangan)} / -{formatIDR(p.potongan)}
                      </td>
                      <td className="p-4 font-bold text-slate-850">{formatIDR(p.totalDiterima)}</td>
                      <td className="p-4 text-xs text-slate-450">{p.tanggalDibayar}</td>
                    </tr>
                  ))}
                  {penggajianList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-slate-400">Belum ada slip gaji terbayar bulan ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================================
          MODALS AREA
          ========================================================== */}
      
      {/* 1. Syahriah Payment Dialog */}
      <AnimatePresence>
        {showPaySyahriahModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display text-slate-800">Catat Pembayaran SPP</h3>
                <button onClick={() => setShowPaySyahriahModal(null)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                paySyahriahMutation.mutate({
                  santriId: showPaySyahriahModal.santriId,
                  bulan: selectedBulan,
                  tahun: selectedTahun,
                  jumlahBayar: Number(values.jumlahBayar),
                  tanggalBayar: String(values.tanggalBayar),
                  catatan: String(values.catatan || `Syahriah bulan ${selectedBulan}/${selectedTahun}`),
                });
              }} className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] text-slate-400">Penerima SPP:</span>
                  <p className="text-sm font-semibold text-slate-850">{showPaySyahriahModal.nama}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nominal Pembayaran</label>
                  <input 
                    type="number" 
                    name="jumlahBayar"
                    defaultValue={showPaySyahriahModal.nominalTagihan} 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Pembayaran</label>
                  <input 
                    type="date" 
                    name="tanggalBayar"
                    defaultValue={new Date().toISOString().split('T')[0]} 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Catatan Tambahan (Opsional)</label>
                  <input 
                    type="text" 
                    name="catatan"
                    placeholder="Contoh: Titipan SPP lunas" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowPaySyahriahModal(null)} className="rounded-xl">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={paySyahriahMutation.isPending}>
                    {paySyahriahMutation.isPending ? 'Memproses...' : 'Konfirmasi Bayar'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Tabungan Setor/Tarik Dialog */}
      <AnimatePresence>
        {showSavingTxModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display text-slate-800">
                  Pencatatan {showSavingTxModal.jenisTransaksi} Tabungan
                </h3>
                <button onClick={() => setShowSavingTxModal(null)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                saveSavingTxMutation.mutate({
                  santriId: showSavingTxModal.santriId,
                  jenisTransaksi: showSavingTxModal.jenisTransaksi,
                  jumlah: Number(values.jumlah),
                  tanggalTransaksi: String(values.tanggalTransaksi),
                  keterangan: String(values.keterangan || `${showSavingTxModal.jenisTransaksi} Tabungan`),
                });
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nominal Transaksi (IDR)</label>
                  <input 
                    type="number" 
                    name="jumlah"
                    placeholder="Contoh: 10000"
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Transaksi</label>
                  <input 
                    type="date" 
                    name="tanggalTransaksi"
                    defaultValue={new Date().toISOString().split('T')[0]} 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Keterangan Tambahan</label>
                  <input 
                    type="text" 
                    name="keterangan"
                    placeholder="Contoh: Titipan tabungan koperasi" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowSavingTxModal(null)} className="rounded-xl">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={saveSavingTxMutation.isPending}>
                    {saveSavingTxMutation.isPending ? 'Memproses...' : 'Simpan Transaksi'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Pemasukan Dialog */}
      <AnimatePresence>
        {showPemasukanModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display text-slate-800">Catat Pemasukan Kas</h3>
                <button onClick={() => setShowPemasukanModal(false)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                savePemasukanMutation.mutate({
                  tanggal: String(values.tanggal),
                  jumlah: Number(values.jumlah),
                  sumber: String(values.sumber),
                  keterangan: values.keterangan ? String(values.keterangan) : undefined,
                });
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sumber Kas</label>
                  <select name="sumber" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none">
                    <option value="DONASI">Donasi Sukarela</option>
                    <option value="INFAK">Infak Bulanan</option>
                    <option value="LAINNYA">Lain-Lain</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nominal Pemasukan</label>
                  <input type="number" name="jumlah" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Transaksi</label>
                  <input type="date" name="tanggal" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Keterangan / Memo</label>
                  <input type="text" name="keterangan" placeholder="Contoh: Donasi Hamba Allah" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowPemasukanModal(false)} className="rounded-xl">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={savePemasukanMutation.isPending}>
                    {savePemasukanMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Pengeluaran Dialog */}
      <AnimatePresence>
        {showPengeluaranModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display text-slate-800">Catat Pengeluaran Kas</h3>
                <button onClick={() => setShowPengeluaranModal(false)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                savePengeluaranMutation.mutate({
                  tanggal: String(values.tanggal),
                  jumlah: Number(values.jumlah),
                  kategori: String(values.kategori),
                  keterangan: values.keterangan ? String(values.keterangan) : undefined,
                });
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kategori Pengeluaran</label>
                  <select name="kategori" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none">
                    <option value="OPERASIONAL">Operasional Kantor</option>
                    <option value="LOGISTIK">Pembelian Buku/Kitab</option>
                    <option value="PEMELIHARAAN">Pemeliharaan Bangunan</option>
                    <option value="LAINNYA">Lain-Lain</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nominal Pengeluaran</label>
                  <input type="number" name="jumlah" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Transaksi</label>
                  <input type="date" name="tanggal" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Keterangan / Memo</label>
                  <input type="text" name="keterangan" placeholder="Contoh: Beli spidol & papan tulis" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowPengeluaranModal(false)} className="rounded-xl">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={savePengeluaranMutation.isPending}>
                    {savePengeluaranMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
