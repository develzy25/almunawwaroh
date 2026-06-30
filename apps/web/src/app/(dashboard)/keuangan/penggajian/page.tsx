"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Ustadz } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X, CheckCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  ustadzId?: string;
}

interface BayarGajiFields {
  ustadzId: string;
  bulan: number;
  tahun: number;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  tanggalDibayar: string;
  keterangan: string;
}

export default function PenggajianPage() {
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const queryClient = useQueryClient();
  const currentDate = new Date();
  
  const [selectedBulan, setSelectedBulan] = useState(currentDate.getMonth() + 1);
  const [selectedTahun, setSelectedTahun] = useState(currentDate.getFullYear());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUstadz, setSelectedUstadz] = useState<Ustadz | null>(null);
  
  const [paymentForm, setPaymentForm] = useState<Partial<BayarGajiFields>>({
    tunjangan: 0,
    potongan: 0,
    tanggalDibayar: currentDate.toISOString().split('T')[0],
  });

  // Fetch all active ustadz
  const { data: ustadzList = [], isLoading: isUstadzLoading } = useQuery<Ustadz[]>({
    queryKey: ['ustadz'],
    queryFn: () => api.get('/api/ustadz'),
  });

  // Fetch penggajian history
  const { data: penggajianList = [], isLoading: isPenggajianLoading } = useQuery<PenggajianItem[]>({
    queryKey: ['penggajian'],
    queryFn: () => api.get('/api/keuangan/penggajian'),
  });

  // Mutation to pay salary
  const payGajiMutation = useMutation({
    mutationFn: (data: BayarGajiFields) => api.post('/api/keuangan/penggajian/bayar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penggajian'] });
      setIsModalOpen(false);
      alert('Gaji berhasil dibayarkan dan dicatat dalam pengeluaran kas.');
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      alert(error?.response?.data?.error || 'Gagal merekam pembayaran gaji');
    }
  });

  // Filter ustadz and merge with penggajian status
  const payrollData = useMemo(() => {
    // Only active ustadz or those who have bisyarah settings
    return ustadzList.map(ust => {
      // Find if this ustadz has been paid for the selected month & year
      const paymentRecord = penggajianList.find(
        p => 
          (p.ustadzId === ust.id || p.ustadzNama === ust.namaLengkap) && 
          p.bulan === selectedBulan && 
          p.tahun === selectedTahun
      );

      return {
        ...ust,
        isPaid: !!paymentRecord,
        paymentRecord
      };
    });
  }, [ustadzList, penggajianList, selectedBulan, selectedTahun]);

  const openPaymentModal = (ustadz: Ustadz) => {
    setSelectedUstadz(ustadz);
    setPaymentForm({
      ustadzId: ustadz.id,
      bulan: selectedBulan,
      tahun: selectedTahun,
      gajiPokok: ustadz.nominalBisyarah || 0,
      tunjangan: 0,
      potongan: 0,
      tanggalDibayar: new Date().toISOString().split('T')[0],
      keterangan: `Pembayaran Honor Ustadz ${ustadz.namaLengkap} - Bulan ${selectedBulan} Tahun ${selectedTahun}`
    });
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.ustadzId || !paymentForm.bulan || !paymentForm.tahun) return;
    
    payGajiMutation.mutate(paymentForm as BayarGajiFields);
  };

  const totalPaid = payrollData.filter(d => d.isPaid).length;
  const totalUnpaid = payrollData.filter(d => !d.isPaid && d.jenisBisyarah !== 'Relawan' && d.jenisBisyarah !== 'Tidak Ada').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/keuangan" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali ke Keuangan
          </Link>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800">Penggajian Ustadz</h1>
          <p className="text-slate-500 mt-1">Kelola dan rekam pembayaran honor pengajar per bulan.</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bulan</label>
          <select 
            className="w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tahun</label>
          <select 
            className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(Number(e.target.value))}
          >
            {[currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="ml-auto flex gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase">Sudah Dibayar</div>
            <div className="text-lg font-bold text-emerald-600">{totalPaid} Org</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase">Belum Dibayar</div>
            <div className="text-lg font-bold text-amber-600">{totalUnpaid} Org</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/60">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Ustadz/ah</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sistem Bisyarah</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nominal Bisyarah</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status Pembayaran</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isUstadzLoading || isPenggajianLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-slate-400">Memuat data...</td>
                </tr>
              ) : payrollData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-slate-400">Belum ada data ustadz.</td>
                </tr>
              ) : (
                payrollData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{item.namaLengkap}</div>
                      <div className="text-xs text-slate-500">{item.nomorInduk}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {item.jenisBisyarah || 'Bulanan'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {formatIDR(item.nominalBisyarah || 0)}
                    </td>
                    <td className="p-4 text-center">
                      {item.isPaid ? (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Sudah Dibayar
                        </div>
                      ) : (
                         (item.jenisBisyarah === 'Relawan' || item.jenisBisyarah === 'Tidak Ada') ? (
                           <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200 text-xs font-medium">
                             Tidak Digaji
                           </div>
                         ) : (
                           <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold">
                             Belum Dibayar
                           </div>
                         )
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!item.isPaid && item.jenisBisyarah !== 'Relawan' && item.jenisBisyarah !== 'Tidak Ada' && (
                        <Button 
                          size="sm" 
                          onClick={() => openPaymentModal(item)}
                          className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                        >
                          <Wallet className="w-4 h-4 mr-1.5" />
                          Bayar
                        </Button>
                      )}
                      
                      {item.isPaid && (
                        <span className="text-xs font-medium text-slate-400">
                          Telah dibayar tgl {item.paymentRecord?.tanggalDibayar}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pembayaran */}
      <AnimatePresence>
        {isModalOpen && selectedUstadz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-800">Catat Pembayaran Gaji</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Periode: Bulan {selectedBulan} Tahun {selectedTahun}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="p-6">
                <div className="mb-6 bg-brand-50/50 rounded-xl p-4 border border-brand-100/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold shrink-0">
                    {selectedUstadz.namaLengkap.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{selectedUstadz.namaLengkap}</div>
                    <div className="text-xs text-brand-600/80 font-medium">{selectedUstadz.jenisBisyarah || 'Bulanan'} - {formatIDR(selectedUstadz.nominalBisyarah || 0)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gaji Pokok (Otomatis)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none cursor-not-allowed"
                      value={formatIDR(paymentForm.gajiPokok || 0)}
                      disabled
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tunjangan Tambahan (Rp)</label>
                      <input 
                        type="number" 
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                        value={paymentForm.tunjangan}
                        onChange={(e) => setPaymentForm({...paymentForm, tunjangan: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Potongan (Rp)</label>
                      <input 
                        type="number" 
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                        value={paymentForm.potongan}
                        onChange={(e) => setPaymentForm({...paymentForm, potongan: Number(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Pembayaran</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      value={paymentForm.tanggalDibayar}
                      onChange={(e) => setPaymentForm({...paymentForm, tanggalDibayar: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Keterangan / Catatan</label>
                    <textarea 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      rows={2}
                      value={paymentForm.keterangan}
                      onChange={(e) => setPaymentForm({...paymentForm, keterangan: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-500">Total Diterima</div>
                    <div className="text-xl font-black text-brand-600">
                      {formatIDR((paymentForm.gajiPokok || 0) + (paymentForm.tunjangan || 0) - (paymentForm.potongan || 0))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsModalOpen(false)}>Batal</Button>
                  <Button type="submit" disabled={payGajiMutation.isPending} className="flex-1 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20">
                    {payGajiMutation.isPending ? 'Memproses...' : 'Konfirmasi Bayar'}
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
