"use client";

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Plus, Trash2, Edit, X, Download, Upload, FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Santri, Kk, Jenjang, SantriDetail, SantriDokumen } from '@/types';
import { exportToExcel, downloadExcelTemplate, importFromExcel } from '@/lib/excel';

interface SantriFormInput extends Partial<Santri> {
  nomorKk?: string;
  namaAyah?: string;
  namaIbu?: string;
  namaWali?: string;
  alamatKk?: string;
  rt?: string;
  rw?: string;
  desa?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
}

export default function SantriPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'santri' | 'kk'>('santri');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // Modals state
  const [showSantriModal, setShowSantriModal] = useState(false);
  const [showKkModal, setShowKkModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedSantriId, setSelectedSantriId] = useState<string | null>(null);
  const [editingSantri, setEditingSantri] = useState<SantriFormInput | null>(null);
  const [editingKk, setEditingKk] = useState<Partial<Kk> | null>(null);

  // States & Refs untuk Cloudinary Upload
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'santri');
    try {
      const res = await api.post('/api/upload', formData);
      setEditingSantri(prev => ({
        ...prev,
        fotoCloudinaryId: res.cloudinaryId,
        fotoSecureUrl: res.secureUrl,
        fotoWidth: res.width,
        fotoHeight: res.height,
        fotoBytes: res.bytes,
      }));
    } catch (err) {
      alert('Gagal mengunggah foto: ' + (err as Error).message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSantriId) return;
    setIsUploadingDoc(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'dokumen');
    try {
      const res = await api.post('/api/upload', formData);
      await api.post(`/api/santri/${selectedSantriId}/documents`, {
        namaDokumen: file.name,
        cloudinaryId: res.cloudinaryId,
        secureUrl: res.secureUrl,
        bytes: res.bytes,
      });
      queryClient.invalidateQueries({ queryKey: ['santriDetail', selectedSantriId] });
    } catch (err) {
      alert('Gagal mengunggah dokumen: ' + (err as Error).message);
    } finally {
      setIsUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!confirm('Hapus berkas lampiran ini?')) return;
    try {
      await api.delete(`/api/santri/documents/${docId}`);
      queryClient.invalidateQueries({ queryKey: ['santriDetail', selectedSantriId] });
    } catch (err) {
      alert('Gagal menghapus dokumen: ' + (err as Error).message);
    }
  };

  // Queries
  const { data: santriList = [] } = useQuery<Santri[]>({
    queryKey: ['santri'],
    queryFn: () => api.get('/api/santri'),
  });

  const { data: kkList = [] } = useQuery<Kk[]>({
    queryKey: ['kk'],
    queryFn: () => api.get('/api/kk'),
  });

  const { data: jenjangList = [] } = useQuery<Jenjang[]>({
    queryKey: ['jenjang'],
    queryFn: () => api.get('/api/jenjang'),
  });

  const { data: selectedSantri, isLoading: loadingDetail } = useQuery<SantriDetail>({
    queryKey: ['santriDetail', selectedSantriId],
    queryFn: () => api.get(`/api/santri/${selectedSantriId}`),
    enabled: !!selectedSantriId,
  });

  // Mutations
  const saveSantriMutation = useMutation({
    mutationFn: (data: SantriFormInput) => {
      return editingSantri?.id 
        ? api.put(`/api/santri/${editingSantri.id}`, data)
        : api.post('/api/santri', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setShowSantriModal(false);
      setEditingSantri(null);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const deleteSantriMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/santri/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setSelectedSantriId(null);
    },
  });

  const saveKkMutation = useMutation({
    mutationFn: (data: Partial<Kk>) => {
      return editingKk?.id
        ? api.put(`/api/kk/${editingKk.id}`, data)
        : api.post('/api/kk', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kk'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setShowKkModal(false);
      setEditingKk(null);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const deleteKkMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/kk/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kk'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  // Filter lists based on search query
  const filteredSantri = santriList.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.nik && s.nik.includes(searchQuery))
  );

  const filteredKk = kkList.filter(k => 
    k.nomorKk.includes(searchQuery) ||
    k.namaAyah.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.namaIbu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddSantri = () => {
    setEditingSantri({
      nomorKk: '',
      namaAyah: '',
      namaIbu: '',
      namaWali: '',
      alamatKk: '',
      rt: '',
      rw: '',
      desa: '',
      kecamatan: '',
      kabupaten: '',
      provinsi: '',
    });
    setShowSantriModal(true);
  };

  const handleOpenEditSantri = (s: Santri) => {
    const associatedKk = kkList.find(k => k.id === s.kkId);
    setEditingSantri({
      ...s,
      nomorKk: associatedKk?.nomorKk || '',
      namaAyah: associatedKk?.namaAyah || '',
      namaIbu: associatedKk?.namaIbu || '',
      namaWali: associatedKk?.namaWali || '',
      alamatKk: associatedKk?.alamat || '',
      rt: associatedKk?.rt || '',
      rw: associatedKk?.rw || '',
      desa: associatedKk?.desa || '',
      kecamatan: associatedKk?.kecamatan || '',
      kabupaten: associatedKk?.kabupaten || '',
      provinsi: associatedKk?.provinsi || '',
    });
    setShowSantriModal(true);
  };

  const updateFormField = (field: keyof SantriFormInput, value: string | boolean | number | null | undefined) => {
    setEditingSantri(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNomorKkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditingSantri(prev => {
      const updated = { ...prev, nomorKk: val };
      const matchingKk = kkList.find(k => k.nomorKk === val);
      if (matchingKk) {
        return {
          ...updated,
          namaAyah: matchingKk.namaAyah,
          namaIbu: matchingKk.namaIbu,
          namaWali: matchingKk.namaWali || '',
          alamatKk: matchingKk.alamat,
          rt: matchingKk.rt,
          rw: matchingKk.rw,
          desa: matchingKk.desa,
          kecamatan: matchingKk.kecamatan,
          kabupaten: matchingKk.kabupaten,
          provinsi: matchingKk.provinsi,
        };
      }
      return updated;
    });
  };

  const handleOpenAddKk = () => {
    setEditingKk({});
    setShowKkModal(true);
  };

  const handleExportExcel = () => {
    if (activeTab === 'santri') {
      const data = filteredSantri.map(s => {
        const k = kkList.find(x => x.id === s.kkId);
        return {
          ID: s.id, 
          NIK: s.nik || '', 
          Nama: s.nama, 
          'Jenis Kelamin (L/P)': s.jenisKelamin, 
          'Tempat Lahir': s.tempatLahir, 
          'Tanggal Lahir (YYYY-MM-DD)': s.tanggalLahir, 
          'Nama Jenjang': s.jenjangNama || '',
          'Sekolah Asal': s.sekolah || '',
          'Tanggal Masuk (YYYY-MM-DD)': s.tanggalMasuk || '',
          'Status SPP (WAJIB/GRATIS)': s.syahriahStatus || 'WAJIB',
          'Nomor KK': s.kkNomor || '',
          'Nama Ayah': k?.namaAyah || '',
          'Nama Ibu': k?.namaIbu || '',
          'Nama Wali': k?.namaWali || '',
          RT: k?.rt || '',
          RW: k?.rw || '',
          Desa: k?.desa || '',
          Kecamatan: k?.kecamatan || '',
          Kabupaten: k?.kabupaten || '',
          Provinsi: k?.provinsi || '',
          'Alamat KK': k?.alamat || '',
          Alamat: s.alamat || '',
          'Status Aktif (Y/T)': s.statusAktif ? 'Y' : 'T',
          'Nominal Custom SPP': s.syahriahNominalKustom || ''
        };
      });
      exportToExcel(data, 'Data_Santri', [
        'ID', 'NIK', 'Nama', 'Jenis Kelamin (L/P)', 'Tempat Lahir', 'Tanggal Lahir (YYYY-MM-DD)', 
        'Nama Jenjang', 'Sekolah Asal', 'Tanggal Masuk (YYYY-MM-DD)', 'Status SPP (WAJIB/GRATIS)', 
        'Nomor KK', 'Nama Ayah', 'Nama Ibu', 'Nama Wali', 'RT', 'RW', 'Desa', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Alamat KK',
        'Alamat', 'Status Aktif (Y/T)', 'Nominal Custom SPP'
      ]);
    } else {
      const data = filteredKk.map(k => ({
        ID: k.id, 'Nomor KK': k.nomorKk, 'Nama Ayah': k.namaAyah, 'Nama Ibu': k.namaIbu
      }));
      exportToExcel(data, 'Data_KK', ['ID', 'Nomor KK', 'Nama Ayah', 'Nama Ibu']);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = activeTab === 'santri' 
      ? [
          'NIK', 'Nama', 'Jenis Kelamin (L/P)', 'Tempat Lahir', 'Tanggal Lahir (YYYY-MM-DD)', 'Nama Jenjang', 'Sekolah Asal', 'Tanggal Masuk (YYYY-MM-DD)', 'Status SPP (WAJIB/GRATIS)', 
          'Nomor KK', 'Nama Ayah', 'Nama Ibu', 'Nama Wali', 'RT', 'RW', 'Desa', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Alamat KK', 
          'Alamat', 'Status Aktif (Y/T)', 'Nominal Custom SPP'
        ]
      : ['Nomor KK', 'Nama Ayah', 'Nama Ibu'];
    downloadExcelTemplate(headers, `Template_${activeTab === 'santri' ? 'Santri' : 'KK'}`);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const data = await importFromExcel(file);
      if (!data || data.length === 0) throw new Error('Data Excel kosong');
      
      let successCount = 0;
      if (activeTab === 'santri') {
        for (const row of data) {
          if (!row.Nama) continue;
          
          let jenjangId;
          if (row['Nama Jenjang']) {
            const j = jenjangList.find(x => x.nama.toLowerCase() === String(row['Nama Jenjang']).toLowerCase());
            if (j) jenjangId = j.id;
          }

          let kkId;
          if (row['Nomor KK']) {
            const k = kkList.find(x => x.nomorKk === String(row['Nomor KK']));
            if (k) kkId = k.id;
          }

          await api.post('/api/santri', {
            nama: String(row.Nama),
            nik: row.NIK ? String(row.NIK) : undefined,
            jenisKelamin: String(row['Jenis Kelamin (L/P)']).toUpperCase() === 'P' ? 'P' : 'L',
            tempatLahir: row['Tempat Lahir'] ? String(row['Tempat Lahir']) : '-',
            tanggalLahir: row['Tanggal Lahir (YYYY-MM-DD)'] ? String(row['Tanggal Lahir (YYYY-MM-DD)']) : '2010-01-01',
            jenjangId,
            sekolah: row['Sekolah Asal'] ? String(row['Sekolah Asal']) : '-',
            tanggalMasuk: row['Tanggal Masuk (YYYY-MM-DD)'] ? String(row['Tanggal Masuk (YYYY-MM-DD)']) : new Date().toISOString().split('T')[0],
            syahriahStatus: String(row['Status SPP (WAJIB/GRATIS)']).toUpperCase() === 'GRATIS' ? 'GRATIS' : 'WAJIB',
            kkId,
            nomorKk: row['Nomor KK'] ? String(row['Nomor KK']) : undefined,
            namaAyah: row['Nama Ayah'] ? String(row['Nama Ayah']) : undefined,
            namaIbu: row['Nama Ibu'] ? String(row['Nama Ibu']) : undefined,
            namaWali: row['Nama Wali'] ? String(row['Nama Wali']) : undefined,
            alamatKk: row['Alamat KK'] ? String(row['Alamat KK']) : undefined,
            rt: row.RT ? String(row.RT) : undefined,
            rw: row.RW ? String(row.RW) : undefined,
            desa: row.Desa ? String(row.Desa) : undefined,
            kecamatan: row.Kecamatan ? String(row.Kecamatan) : undefined,
            kabupaten: row.Kabupaten ? String(row.Kabupaten) : undefined,
            provinsi: row.Provinsi ? String(row.Provinsi) : undefined,
            alamat: row.Alamat ? String(row.Alamat) : '-',
            statusAktif: String(row['Status Aktif (Y/T)']).toUpperCase() !== 'T',
            syahriahNominalKustom: row['Nominal Custom SPP'] ? Number(row['Nominal Custom SPP']) : undefined,
          });
          successCount++;
        }
        queryClient.invalidateQueries({ queryKey: ['santri'] });
      } else {
        for (const row of data) {
          if (!row['Nomor KK'] || !row['Nama Ayah']) continue;
          await api.post('/api/kk', {
            nomorKk: String(row['Nomor KK']),
            namaAyah: String(row['Nama Ayah']),
            namaIbu: String(row['Nama Ibu'] || '-'),
          });
          successCount++;
        }
        queryClient.invalidateQueries({ queryKey: ['kk'] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      alert(`Berhasil mengimpor ${successCount} baris data.`);
    } catch (err: unknown) {
      alert(`Gagal import: ${(err as Error).message}`);
    } finally {
      setIsImporting(false);
      setShowImportModal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800">Administrasi Siswa</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data santri terintegrasi dengan Kartu Keluarga.</p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-2">
          <input type="file" accept=".xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleImportExcel} />
          
          <Button variant="outline" onClick={() => setShowImportModal(true)} className="rounded-2xl h-12 px-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Import Data</span>
          </Button>

          <Button variant="outline" onClick={handleExportExcel} className="rounded-2xl h-12 px-4 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <Button 
            onClick={activeTab === 'santri' ? handleOpenAddSantri : handleOpenAddKk}
            className="rounded-2xl h-12 px-5 font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah {activeTab === 'santri' ? 'Santri' : 'KK'}</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-sm">
        <button
          onClick={() => { setActiveTab('santri'); setSearchQuery(''); }}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'santri' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Data Santri
        </button>
        <button
          onClick={() => { setActiveTab('kk'); setSearchQuery(''); }}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'kk' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Kartu Keluarga (KK)
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Cari ${activeTab === 'santri' ? 'nama santri, NIK...' : 'nomor KK, nama orang tua...'}`}
          className="w-full pl-11 pr-4 py-3 bg-transparent text-sm focus:outline-none text-slate-800"
        />
      </div>

      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'santri' ? (
          <motion.div
            key="santri-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Table / List Area */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Santri</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Program</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status SPP</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Aktif</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredSantri.map((s) => (
                      <tr 
                        key={s.id} 
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedSantriId === s.id ? 'bg-brand-50/30' : ''}`}
                        onClick={() => setSelectedSantriId(s.id)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600 overflow-hidden">
                              {s.fotoSecureUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={s.fotoSecureUrl} alt="" className="w-full h-full object-cover" />
                              ) : s.nama.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{s.nama}</p>
                              <p className="text-[10px] text-slate-400">{s.nik || 'NIK Belum Diisi'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{s.jenjangNama || 'Belum diatur'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            s.syahriahStatus === 'GRATIS' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {s.syahriahStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            s.statusAktif 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {s.statusAktif ? 'Aktif' : 'Non-Aktif'}
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleOpenEditSantri(s)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { if(confirm('Hapus data santri ini?')) deleteSantriMutation.mutate(s.id); }}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSantri.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm text-slate-400">Tidak ada data santri ditemukan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Profile View Panel */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col justify-between min-h-[400px]">
              {selectedSantriId ? (
                loadingDetail || !selectedSantri ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                    <span className="text-xs text-slate-400">Loading detail...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-2xl overflow-hidden shadow-sm">
                          {selectedSantri.fotoSecureUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={selectedSantri.fotoSecureUrl} alt="" className="w-full h-full object-cover" />
                          ) : selectedSantri.nama.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg font-display">{selectedSantri.nama}</h3>
                          <p className="text-xs text-slate-400">Sejak {selectedSantri.tanggalMasuk}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedSantriId(null)}
                        className="p-1.5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tempat, Tgl Lahir</span>
                        <strong className="text-slate-700">{selectedSantri.tempatLahir}, {selectedSantri.tanggalLahir}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Alamat Santri</span>
                        <strong className="text-slate-700 text-right">{selectedSantri.alamat}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sekolah Asal</span>
                        <strong className="text-slate-700">{selectedSantri.sekolah}</strong>
                      </div>
                      {selectedSantri.kkDetails ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400">No. Kartu Keluarga</span>
                            <strong className="text-slate-700">{selectedSantri.kkDetails.nomorKk}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Nama Ayah / Ibu</span>
                            <strong className="text-slate-700">{selectedSantri.kkDetails.namaAyah} / {selectedSantri.kkDetails.namaIbu}</strong>
                          </div>
                        </>
                      ) : (
                        <div className="p-2 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-semibold border border-amber-100">
                          Data KK belum terhubung
                        </div>
                      )}
                    </div>

                    {/* Dokumen Attachment List */}
                    <div className="pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-slate-800">Dokumen Terlampir</h4>
                        <div>
                          <input type="file" ref={docInputRef} onChange={handleUploadDoc} className="hidden" id="doc-upload-input" />
                          <label htmlFor="doc-upload-input" className={`text-[10px] font-bold text-primary hover:underline cursor-pointer ${isUploadingDoc ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isUploadingDoc ? 'Mengunggah...' : '+ Unggah Berkas'}
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {selectedSantri.dokumen?.map((d: SantriDokumen) => (
                          <div key={d.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-[11px]">
                            <span className="font-semibold text-slate-600 truncate max-w-[150px]" title={d.namaDokumen}>{d.namaDokumen}</span>
                            <div className="flex items-center gap-2">
                              <a href={d.secureUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Lihat</a>
                              <button onClick={() => handleDeleteDoc(d.id)} className="text-red-400 hover:text-red-600 transition-colors p-0.5">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!selectedSantri.dokumen || selectedSantri.dokumen.length === 0) && (
                          <span className="text-xs text-slate-400">Belum ada lampiran berkas</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Users className="w-10 h-10 mb-3 text-slate-200" />
                  <span className="text-xs">Pilih salah satu baris santri untuk melihat profil detail terintegrasi.</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="kk-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">No. Kartu Keluarga</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ayah</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ibu</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Alamat Lengkap</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Anggota Santri</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredKk.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-sm font-semibold text-slate-800">{k.nomorKk}</td>
                      <td className="p-4 text-sm text-slate-700">{k.namaAyah}</td>
                      <td className="p-4 text-sm text-slate-700">{k.namaIbu}</td>
                      <td className="p-4 text-xs text-slate-500">
                        {k.alamat}, RT {k.rt}/RW {k.rw}, {k.desa}, {k.kecamatan}, {k.kabupaten}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-brand-50 text-primary text-[10px] font-bold">
                          {k.memberCount} Anak
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => { setEditingKk(k); setShowKkModal(true); }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { if(confirm('Hapus data KK ini?')) deleteKkMutation.mutate(k.id); }}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredKk.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-slate-400">Tidak ada data Kartu Keluarga ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SARTRI MODAL (Add/Edit) */}
      <AnimatePresence>
        {showSantriModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-display text-slate-800">
                  {editingSantri?.id ? 'Ubah Data Santri' : 'Tambah Santri Baru'}
                </h3>
                <button onClick={() => setShowSantriModal(false)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                saveSantriMutation.mutate({
                  ...editingSantri,
                  ...values,
                  statusAktif: values.statusAktif === 'true',
                });
              }} className="space-y-6">
                {/* File Upload untuk Foto Profil */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 overflow-hidden shrink-0 shadow-inner">
                    {editingSantri?.fotoSecureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editingSantri.fotoSecureUrl} alt="Foto Profil" className="w-full h-full object-cover" />
                    ) : 'FOTO'}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-slate-600 block mb-1">Foto Profil Santri</span>
                    <input type="file" accept="image/*" className="hidden" id="photo-input" onChange={handlePhotoChange} disabled={isUploadingPhoto} />
                    <label htmlFor="photo-input" className={`inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
                      {isUploadingPhoto ? 'Mengunggah...' : 'Pilih Foto Profil'}
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Biodata Santri</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Lengkap</label>
                      <input type="text" name="nama" value={editingSantri?.nama || ''} onChange={e => updateFormField('nama', e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">NIK (16 Digit)</label>
                      <input type="text" name="nik" value={editingSantri?.nik || ''} onChange={e => updateFormField('nik', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Jenis Kelamin</label>
                      <select name="jenisKelamin" value={editingSantri?.jenisKelamin || 'L'} onChange={e => updateFormField('jenisKelamin', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                        <option value="L">Laki-Laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Program / Jenjang</label>
                      <select name="jenjangId" value={editingSantri?.jenjangId || ''} onChange={e => updateFormField('jenjangId', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                        <option value="">Pilih Program</option>
                        {jenjangList.map(j => (
                          <option key={j.id} value={j.id}>{j.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tempat Lahir</label>
                      <input type="text" name="tempatLahir" value={editingSantri?.tempatLahir || ''} onChange={e => updateFormField('tempatLahir', e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Lahir</label>
                      <input type="date" name="tanggalLahir" value={editingSantri?.tanggalLahir || ''} onChange={e => updateFormField('tanggalLahir', e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sekolah Asal</label>
                      <input type="text" name="sekolah" value={editingSantri?.sekolah || ''} onChange={e => updateFormField('sekolah', e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Masuk TPQ/RTQ</label>
                      <input type="date" name="tanggalMasuk" value={editingSantri?.tanggalMasuk || ''} onChange={e => updateFormField('tanggalMasuk', e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status Syahriah (SPP)</label>
                      <select name="syahriahStatus" value={editingSantri?.syahriahStatus || 'WAJIB'} onChange={e => updateFormField('syahriahStatus', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                        <option value="WAJIB">Wajib Bayar</option>
                        <option value="GRATIS">Gratis (Bebas Biaya)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nominal Custom SPP (Opsional)</label>
                      <input type="number" name="syahriahNominalKustom" value={editingSantri?.syahriahNominalKustom || ''} onChange={e => updateFormField('syahriahNominalKustom', e.target.value)} placeholder="Contoh: 50000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Alamat Domisili Lengkap Santri</label>
                    <textarea name="alamat" value={editingSantri?.alamat || ''} onChange={e => updateFormField('alamat', e.target.value)} required rows={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Data Orang Tua / Wali (KK)</h4>
                    {editingSantri?.nomorKk && (
                      <div>
                        {kkList.some(k => k.nomorKk === editingSantri.nomorKk) ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">KK Terdaftar (Autofill Aktif)</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">KK Baru (Akan Disimpan)</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nomor Kartu Keluarga (16 Digit)</label>
                      <input type="text" name="nomorKk" value={editingSantri?.nomorKk || ''} onChange={handleNomorKkChange} required placeholder="Masukkan 16 digit nomor KK" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Kepala Keluarga (Ayah)</label>
                      <input type="text" name="namaAyah" value={editingSantri?.namaAyah || ''} onChange={e => updateFormField('namaAyah', e.target.value)} required placeholder="Nama Ayah kandung" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Ibu Kandung</label>
                      <input type="text" name="namaIbu" value={editingSantri?.namaIbu || ''} onChange={e => updateFormField('namaIbu', e.target.value)} required placeholder="Nama Ibu kandung" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Wali (Opsional)</label>
                      <input type="text" name="namaWali" value={editingSantri?.namaWali || ''} onChange={e => updateFormField('namaWali', e.target.value)} placeholder="Nama wali jika tinggal dengan wali" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RT</label>
                      <input type="text" name="rt" value={editingSantri?.rt || ''} onChange={e => updateFormField('rt', e.target.value)} placeholder="01" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RW</label>
                      <input type="text" name="rw" value={editingSantri?.rw || ''} onChange={e => updateFormField('rw', e.target.value)} placeholder="02" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Desa / Kelurahan</label>
                      <input type="text" name="desa" value={editingSantri?.desa || ''} onChange={e => updateFormField('desa', e.target.value)} placeholder="Desa" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kecamatan</label>
                      <input type="text" name="kecamatan" value={editingSantri?.kecamatan || ''} onChange={e => updateFormField('kecamatan', e.target.value)} placeholder="Kecamatan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kabupaten / Kota</label>
                      <input type="text" name="kabupaten" value={editingSantri?.kabupaten || ''} onChange={e => updateFormField('kabupaten', e.target.value)} placeholder="Kabupaten" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Provinsi</label>
                      <input type="text" name="provinsi" value={editingSantri?.provinsi || ''} onChange={e => updateFormField('provinsi', e.target.value)} placeholder="Provinsi" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Alamat Jalan Kartu Keluarga</label>
                    <textarea name="alamatKk" value={editingSantri?.alamatKk || ''} onChange={e => updateFormField('alamatKk', e.target.value)} placeholder="Alamat sesuai KK" rows={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status Keaktifan Santri</label>
                  <select name="statusAktif" value={editingSantri?.statusAktif === false ? 'false' : 'true'} onChange={e => updateFormField('statusAktif', e.target.value === 'true')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                    <option value="true">Aktif</option>
                    <option value="false">Non-Aktif</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowSantriModal(false)} className="rounded-xl px-5">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={saveSantriMutation.isPending}>
                    {saveSantriMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* KK MODAL (Add/Edit) */}
      <AnimatePresence>
        {showKkModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-display text-slate-800">
                  {editingKk?.id ? 'Ubah Data Kartu Keluarga' : 'Tambah Kartu Keluarga Baru'}
                </h3>
                <button onClick={() => setShowKkModal(false)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                saveKkMutation.mutate(values);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nomor Kartu Keluarga (16 Digit)</label>
                    <input type="text" name="nomorKk" defaultValue={editingKk?.nomorKk || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Kepala Keluarga (Ayah)</label>
                    <input type="text" name="namaAyah" defaultValue={editingKk?.namaAyah || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Ibu Kandung</label>
                    <input type="text" name="namaIbu" defaultValue={editingKk?.namaIbu || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Wali (Opsional)</label>
                    <input type="text" name="namaWali" defaultValue={editingKk?.namaWali || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RT</label>
                    <input type="text" name="rt" defaultValue={editingKk?.rt || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RW</label>
                    <input type="text" name="rw" defaultValue={editingKk?.rw || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Desa / Kelurahan</label>
                    <input type="text" name="desa" defaultValue={editingKk?.desa || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kecamatan</label>
                    <input type="text" name="kecamatan" defaultValue={editingKk?.kecamatan || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kabupaten / Kota</label>
                    <input type="text" name="kabupaten" defaultValue={editingKk?.kabupaten || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Provinsi</label>
                    <input type="text" name="provinsi" defaultValue={editingKk?.provinsi || ''} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Alamat Jalan</label>
                  <textarea name="alamat" defaultValue={editingKk?.alamat || ''} required rows={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500" />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowKkModal(false)} className="rounded-xl px-5">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={saveKkMutation.isPending}>
                    {saveKkMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL IMPORT */}
      <AnimatePresence>
        {showImportModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setShowImportModal(false)} className="fixed inset-0 bg-black z-40" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-3xl shadow-premium overflow-hidden pointer-events-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-xl font-bold font-display text-slate-800">Import Data {activeTab === 'santri' ? 'Santri' : 'KK'}</h2>
                  <button onClick={() => setShowImportModal(false)} className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <h3 className="text-sm font-semibold text-amber-800 mb-2">Langkah 1: Unduh Template</h3>
                    <p className="text-xs text-amber-700 mb-4">Pastikan Anda menggunakan template Excel resmi agar format kolom (header) sesuai dengan standar sistem.</p>
                    <Button variant="outline" onClick={handleDownloadTemplate} className="w-full rounded-xl bg-white flex items-center justify-center gap-2 border-amber-200 hover:bg-amber-100">
                      <Download className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-800">Download Template {activeTab === 'santri' ? 'Santri' : 'KK'}</span>
                    </Button>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">Langkah 2: Unggah Data</h3>
                    <p className="text-xs text-blue-700 mb-4">Pilih file Excel (.xlsx) yang telah Anda isi menggunakan format template di atas.</p>
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="w-full rounded-xl flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {isImporting ? 'Memproses Data...' : 'Pilih File Excel & Import'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
