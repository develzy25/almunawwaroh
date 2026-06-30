"use client";

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Plus, Edit, Trash2, 
  ShieldAlert, X, Download, Upload, FileSpreadsheet, Briefcase, Award, GraduationCap, MapPin, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Ustadz, UstadzDetail, UserProfile, UstadzJabatan } from '@/types';
import { exportToExcel, downloadExcelTemplate, importFromExcel } from '@/lib/excel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function UstadzPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // Modals state
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showJabatanModal, setShowJabatanModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Partial<Ustadz> | null>(null);
  const [newJabatan, setNewJabatan] = useState<Partial<UstadzJabatan>>({ status: 'Aktif' });
  const [activeTab, setActiveTab] = useState('biodata');

  // State untuk Cloudinary Photo Upload
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'ustadz');
    try {
      const res = await api.post('/api/upload', formData);
      setEditingTeacher(prev => ({
        ...prev,
        foto: res.secureUrl, // simpan URL lengkap di field foto
      }));
    } catch (err) {
      alert('Gagal mengunggah foto: ' + (err as Error).message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Queries
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api.get('/api/auth/me'),
  });
  const userRole = userProfile?.user?.role;
  const isSekretariat = userRole === 'sekretariat';

  const { data: teacherList = [] } = useQuery<Ustadz[]>({
    queryKey: ['ustadz'],
    queryFn: () => api.get('/api/ustadz'),
  });

  const { data: selectedTeacher } = useQuery<UstadzDetail>({
    queryKey: ['ustadzDetail', selectedTeacherId],
    queryFn: () => api.get(`/api/ustadz/${selectedTeacherId}`),
    enabled: !!selectedTeacherId,
  });

  // Mutations
  const saveTeacherMutation = useMutation({
    mutationFn: (data: Partial<Ustadz>) => {
      return editingTeacher?.id
        ? api.put(`/api/ustadz/${editingTeacher.id}`, data)
        : api.post('/api/ustadz', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ustadz'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setShowTeacherModal(false);
      setEditingTeacher(null);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/ustadz/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ustadz'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setSelectedTeacherId(null);
    },
  });

  const addJabatanMutation = useMutation({
    mutationFn: (data: Partial<UstadzJabatan>) => api.post(`/api/ustadz/${selectedTeacherId}/jabatan`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ustadzDetail', selectedTeacherId] });
      setNewJabatan({ status: 'Aktif' });
      setShowJabatanModal(false);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const deleteJabatanMutation = useMutation({
    mutationFn: (jabatanId: string) => api.delete(`/api/ustadz/${selectedTeacherId}/jabatan/${jabatanId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ustadzDetail', selectedTeacherId] });
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  // Filter list
  const filteredTeachers = teacherList.filter(t => 
    t.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.nomorInduk && t.nomorInduk.includes(searchQuery))
  );

  const handleExportExcel = () => {
    const data = filteredTeachers.map(t => ({
      ID: t.id, 
      'Nomor Induk': t.nomorInduk || '', 
      'Nama Lengkap': t.namaLengkap, 
      'No HP': t.noHp || '', 
      'Alamat': t.alamat || '', 
      'Nominal Bisyarah': t.nominalBisyarah || 0
    }));
    exportToExcel(data, 'Data_Ustadz', ['ID', 'Nomor Induk', 'Nama Lengkap', 'No HP', 'Alamat', 'Nominal Bisyarah']);
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate(['Nomor Induk', 'Nama Lengkap', 'No HP', 'Alamat', 'Nominal Bisyarah'], 'Template_Ustadz');
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const data = await importFromExcel(file);
      if (!data || data.length === 0) throw new Error('Data Excel kosong');
      
      let successCount = 0;
      for (const row of data) {
        if (!row['Nama Lengkap']) continue;
        await api.post('/api/ustadz', {
          namaLengkap: String(row['Nama Lengkap']),
          nomorInduk: row['Nomor Induk'] ? String(row['Nomor Induk']) : undefined,
          noHp: row['No HP'] ? String(row['No HP']) : undefined,
          alamat: row.Alamat ? String(row.Alamat) : '-',
          nominalBisyarah: row['Nominal Bisyarah'] ? Number(row['Nominal Bisyarah']) : 0,
        });
        successCount++;
      }
      queryClient.invalidateQueries({ queryKey: ['ustadz'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      alert(`Berhasil mengimpor ${successCount} baris data ustadz/ah.`);
    } catch (err: unknown) {
      alert(`Gagal import: ${(err as Error).message}`);
    } finally {
      setIsImporting(false);
      setShowImportModal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatIDR = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800">Administrasi HR Ustadz</h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Informasi Manajemen Tenaga Pengajar dan Kepegawaian.</p>
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
            onClick={() => { setEditingTeacher({}); setActiveTab('biodata'); setShowTeacherModal(true); }}
            className="rounded-2xl h-12 px-5 font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah Ustadz/ah Baru</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
      </div>

      {/* Search and Role Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama Ustadz/ah, Nomor Induk..."
            className="w-full pl-11 pr-4 py-3 bg-transparent text-sm focus:outline-none text-slate-800"
          />
        </div>

        {isSekretariat && (
          <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-amber-100">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Akses nominal bisyarah disensor otomatis sesuai batas kewenangan Sekretariat.</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ustadz/ah</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Info Kontak</th>
                  {!isSekretariat && <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Bisyarah</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((t) => (
                    <tr 
                      key={t.id} 
                      onClick={() => setSelectedTeacherId(t.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedTeacherId === t.id ? 'bg-emerald-50/50' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 font-bold text-lg overflow-hidden">
                            {t.foto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={t.foto} alt="" className="w-full h-full object-cover" />
                            ) : t.namaLengkap.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{t.namaLengkap}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Briefcase className="w-3 h-3" /> NI: {t.nomorInduk || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-600 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" /> {t.noHp || '-'}
                        </div>
                        <div className="text-sm text-slate-500 mt-1 line-clamp-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> {t.alamat || '-'}
                        </div>
                      </td>
                      {!isSekretariat && (
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                            {formatIDR(t.nominalBisyarah || 0)}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{t.jenisBisyarah || 'Bulanan'}</div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSekretariat ? 2 : 3} className="p-8 text-center text-sm text-slate-400">Tidak ada data ustadz/ah ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher Detail Panel */}
        <div className="lg:col-span-1">
          {selectedTeacherId && selectedTeacher ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6 sticky top-24">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 font-bold text-2xl overflow-hidden shadow-sm">
                    {selectedTeacher.foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedTeacher.foto} alt="" className="w-full h-full object-cover" />
                    ) : selectedTeacher.namaLengkap.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-800 leading-tight">{selectedTeacher.namaLengkap}</h2>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                      <Award className="w-4 h-4" /> {selectedTeacher.unitMengajar || 'Belum diatur'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Status Keaktifan</div>
                    <div className="font-semibold text-slate-800">{selectedTeacher.statusKeaktifan || 'Aktif'}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">TMT Mengajar</div>
                    <div className="font-semibold text-slate-800">{selectedTeacher.tmtMengajar || '-'}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    Kompetensi & Bisyarah
                  </h3>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hafalan Al-Qur&apos;an</span>
                      <span className="font-medium text-slate-800">{selectedTeacher.hafalanJuz !== null ? `${selectedTeacher.hafalanJuz} Juz` : '-'}</span>
                    </div>
                    {!isSekretariat && (
                      <div className="flex justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-500">Sistem Bisyarah</span>
                        <span className="font-medium text-slate-800">{selectedTeacher.jenisBisyarah || 'Bulanan'}</span>
                      </div>
                    )}
                    {!isSekretariat && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nominal Default</span>
                        <span className="font-bold text-emerald-600">{formatIDR(selectedTeacher.nominalBisyarah || 0)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      Amanah / Jabatan
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowJabatanModal(true)} className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                      + Tambah
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedTeacher.jabatan && selectedTeacher.jabatan.length > 0 ? (
                      selectedTeacher.jabatan.map(j => (
                        <div key={j.id} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl">
                          <div>
                            <div className="font-medium text-sm text-slate-800">{j.jabatan}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{j.status}</div>
                          </div>
                          <button onClick={() => { if(confirm('Hapus jabatan ini?')) deleteJabatanMutation.mutate(j.id); }} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        Belum ada jabatan yang ditambahkan.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl h-11"
                    onClick={() => { setEditingTeacher(selectedTeacher); setActiveTab('biodata'); setShowTeacherModal(true); }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profil
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl h-11 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                    onClick={() => { if(confirm('Hapus data pengajar ini beserta seluruh riwayat jabatannya?')) deleteTeacherMutation.mutate(selectedTeacher.id); }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border border-slate-200 border-dashed h-64 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Users className="w-12 h-12 mb-3 text-slate-300" />
              <p>Pilih Ustadz/ah dari daftar untuk melihat detail profil dan mengelola jabatannya.</p>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Form Modal */}
      <AnimatePresence>
        {showTeacherModal && editingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTeacherModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-premium relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold font-display text-slate-800">
                  {editingTeacher.id ? 'Edit Ustadz/ah' : 'Tambah Ustadz/ah Baru'}
                </h2>
                <button onClick={() => setShowTeacherModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 shrink-0 px-6 gap-6">
                {['biodata', 'mengajar', 'bisyarah'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto">
                <form 
                  id="teacherForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!editingTeacher.namaLengkap) return alert('Nama Lengkap wajib diisi');
                    saveTeacherMutation.mutate(editingTeacher);
                  }}
                  className="space-y-4"
                >
                  {activeTab === 'biodata' && (
                    <>
                      {/* Photo Upload untuk Profil Ustadz */}
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 overflow-hidden shrink-0 shadow-inner">
                          {editingTeacher?.foto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={editingTeacher.foto} alt="Foto Profil" className="w-full h-full object-cover" />
                          ) : 'FOTO'}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-slate-600 block mb-1">Foto Profil Ustadz/ah</span>
                          <input type="file" accept="image/*" className="hidden" id="photo-input-ustadz" onChange={handlePhotoChange} disabled={isUploadingPhoto} />
                          <label htmlFor="photo-input-ustadz" className={`inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isUploadingPhoto ? 'Mengunggah...' : 'Pilih Foto Profil'}
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Induk / NIK</label>
                        <input
                          type="text"
                          value={editingTeacher.nomorInduk || ''}
                          onChange={e => setEditingTeacher({...editingTeacher, nomorInduk: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          placeholder="NIK / NIU"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={editingTeacher.namaLengkap || ''}
                          onChange={e => setEditingTeacher({...editingTeacher, namaLengkap: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Panggilan</label>
                        <input
                          type="text"
                          value={editingTeacher.namaPanggilan || ''}
                          onChange={e => setEditingTeacher({...editingTeacher, namaPanggilan: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                        <Select value={editingTeacher.jenisKelamin || undefined} onValueChange={v => setEditingTeacher({...editingTeacher, jenisKelamin: v})}>
                          <SelectTrigger className="w-full p-3 h-auto bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-none">
                            <SelectValue placeholder="Pilih..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-premium">
                            <SelectItem value="L" className="rounded-lg">Laki-laki (L)</SelectItem>
                            <SelectItem value="P" className="rounded-lg">Perempuan (P)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">No. HP / WhatsApp</label>
                        <input
                          type="text"
                          value={editingTeacher.noHp || ''}
                          onChange={e => setEditingTeacher({...editingTeacher, noHp: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                        <textarea
                          rows={3}
                          value={editingTeacher.alamat || ''}
                          onChange={e => setEditingTeacher({...editingTeacher, alamat: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                          placeholder="Detail alamat domisili"
                        />
                      </div>
                    </div>
                  </>
                  )}

                  {activeTab === 'mengajar' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">TMT Mengajar</label>
                        <input
                          type="date"
                          value={editingTeacher.tmtMengajar || ''}
                          onChange={e => setEditingTeacher({...editingTeacher, tmtMengajar: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status Keaktifan</label>
                        <Select value={editingTeacher.statusKeaktifan || 'Aktif'} onValueChange={v => setEditingTeacher({...editingTeacher, statusKeaktifan: v})}>
                          <SelectTrigger className="w-full p-3 h-auto bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-none">
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-premium">
                            <SelectItem value="Aktif" className="rounded-lg">Aktif</SelectItem>
                            <SelectItem value="Cuti" className="rounded-lg">Cuti</SelectItem>
                            <SelectItem value="Nonaktif" className="rounded-lg">Nonaktif</SelectItem>
                            <SelectItem value="Mengundurkan Diri" className="rounded-lg">Mengundurkan Diri</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Unit Mengajar</label>
                        <Select value={editingTeacher.unitMengajar || 'TPQ'} onValueChange={v => setEditingTeacher({...editingTeacher, unitMengajar: v})}>
                          <SelectTrigger className="w-full p-3 h-auto bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-none">
                            <SelectValue placeholder="Pilih unit" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-premium">
                            <SelectItem value="TPQ" className="rounded-lg">TPQ</SelectItem>
                            <SelectItem value="RTQ" className="rounded-lg">RTQ</SelectItem>
                            <SelectItem value="Majlis Ta'lim" className="rounded-lg">Majlis Ta'lim</SelectItem>
                            <SelectItem value="TPQ & Majlis Ta'lim" className="rounded-lg">TPQ & Majlis Ta'lim</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hafalan Al-Qur&apos;an (Juz)</label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={editingTeacher.hafalanJuz ?? ''}
                          onChange={e => setEditingTeacher({...editingTeacher, hafalanJuz: e.target.value ? Number(e.target.value) : null})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          placeholder="0 - 30"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'bisyarah' && (
                    <div className="space-y-4">
                      {isSekretariat ? (
                        <div className="p-4 bg-amber-50 text-amber-700 rounded-xl flex items-center gap-3">
                          <ShieldAlert className="w-5 h-5 shrink-0" />
                          <p className="text-sm">Anda (Sekretariat) tidak memiliki wewenang untuk melihat dan mengubah data Bisyarah (gaji). Pengaturan ini hanya dapat dilakukan oleh Bendahara atau Ketua Yayasan.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Bisyarah</label>
                            <Select value={editingTeacher.jenisBisyarah || 'Bulanan'} onValueChange={v => setEditingTeacher({...editingTeacher, jenisBisyarah: v})}>
                              <SelectTrigger className="w-full p-3 h-auto bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-none">
                                <SelectValue placeholder="Pilih jenis" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-premium">
                                <SelectItem value="Bulanan" className="rounded-lg">Bulanan</SelectItem>
                                <SelectItem value="Per Pertemuan" className="rounded-lg">Per Pertemuan</SelectItem>
                                <SelectItem value="Relawan" className="rounded-lg">Relawan</SelectItem>
                                <SelectItem value="Tidak Ada" className="rounded-lg">Tidak Ada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Bisyarah (Rp)</label>
                            <input
                              type="number"
                              min="0"
                              value={editingTeacher.nominalBisyarah ?? 0}
                              onChange={e => setEditingTeacher({...editingTeacher, nominalBisyarah: Number(e.target.value)})}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                              disabled={editingTeacher.jenisBisyarah === 'Relawan' || editingTeacher.jenisBisyarah === 'Tidak Ada'}
                            />
                            <p className="text-xs text-slate-500 mt-1">Gaji Pokok/Honor default per bulan/pertemuan</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <Button variant="outline" onClick={() => setShowTeacherModal(false)} className="rounded-xl px-6">Batal</Button>
                <Button 
                  type="submit" 
                  form="teacherForm"
                  className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={saveTeacherMutation.isPending}
                >
                  {saveTeacherMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Jabatan Form Modal */}
      <AnimatePresence>
        {showJabatanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowJabatanModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-3xl shadow-premium relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold font-display text-slate-800">Tambah Jabatan</h2>
                <button onClick={() => setShowJabatanModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newJabatan.jabatan) return alert('Nama jabatan wajib diisi');
                  addJabatanMutation.mutate(newJabatan);
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Jabatan</label>
                  <Select required value={newJabatan.jabatan || undefined} onValueChange={v => setNewJabatan({...newJabatan, jabatan: v})}>
                    <SelectTrigger className="w-full p-3 h-auto bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-none">
                      <SelectValue placeholder="Pilih Jabatan..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-premium">
                      <SelectItem value="Kepala TPQ" className="rounded-lg">Kepala TPQ</SelectItem>
                      <SelectItem value="Kepala RTQ" className="rounded-lg">Kepala RTQ</SelectItem>
                      <SelectItem value="Wakil Kepala" className="rounded-lg">Wakil Kepala</SelectItem>
                      <SelectItem value="Koordinator Tahfidz" className="rounded-lg">Koordinator Tahfidz</SelectItem>
                      <SelectItem value="Koordinator Tahsin" className="rounded-lg">Koordinator Tahsin</SelectItem>
                      <SelectItem value="Bendahara" className="rounded-lg">Bendahara</SelectItem>
                      <SelectItem value="Sekretaris" className="rounded-lg">Sekretaris</SelectItem>
                      <SelectItem value="Admin" className="rounded-lg">Admin</SelectItem>
                      <SelectItem value="Musyrif" className="rounded-lg">Musyrif</SelectItem>
                      <SelectItem value="Musyrifah" className="rounded-lg">Musyrifah</SelectItem>
                      <SelectItem value="Pengajar" className="rounded-lg">Pengajar Biasa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">TMT Jabatan</label>
                    <input
                      type="date"
                      value={newJabatan.tmtJabatan || ''}
                      onChange={e => setNewJabatan({...newJabatan, tmtJabatan: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <Select value={newJabatan.status || 'Aktif'} onValueChange={v => setNewJabatan({...newJabatan, status: v})}>
                      <SelectTrigger className="w-full p-3 h-auto bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-none">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-premium">
                        <SelectItem value="Aktif" className="rounded-lg">Aktif</SelectItem>
                        <SelectItem value="Nonaktif" className="rounded-lg">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setShowJabatanModal(false)} className="rounded-xl px-6">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white">Simpan</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowImportModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-lg rounded-3xl shadow-premium relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold font-display text-slate-800">Import Data Ustadz/ah</h2>
                <button onClick={() => setShowImportModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Langkah 1: Download Template</h3>
                  <p className="text-sm text-slate-500">Gunakan template excel ini agar format data sesuai dengan sistem.</p>
                  <Button variant="outline" onClick={handleDownloadTemplate} className="w-full rounded-xl border-amber-200 bg-amber-50 hover:bg-amber-100 mt-2">
                    <Download className="w-4 h-4 mr-2 text-amber-600" />
                    <span className="text-amber-800">Download Template Ustadz</span>
                  </Button>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-800">Langkah 2: Upload File Excel</h3>
                  <p className="text-sm text-slate-500">Upload file excel yang sudah Anda isi sesuai template.</p>
                  <input type="file" ref={fileInputRef} onChange={handleImportExcel} accept=".xlsx, .xls" className="hidden" />
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={isImporting}
                    className="w-full rounded-xl mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isImporting ? 'Sedang mengimpor...' : 'Pilih File Excel'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
