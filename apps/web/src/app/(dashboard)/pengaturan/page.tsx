"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, ShieldAlert, Plus, Edit, Trash2, X, DollarSign, UserPlus, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Yayasan, Jenjang, UserProfile } from '@/types';

interface Pengelola {
  id: string;
  nama: string;
  username: string;
  role: string;
}

export default function PengaturanPage() {
  const queryClient = useQueryClient();
  const [showJenjangModal, setShowJenjangModal] = useState<Partial<Jenjang> | null>(null);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);

  // Queries
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api.get('/api/auth/me'),
  });
  const userRole = userProfile?.user?.role;
  const isKetua = userRole === 'ketua';

  const { data: yayasanDetail, isLoading: loadingSettings } = useQuery<Yayasan>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
  });

  const { data: jenjangList = [], isLoading: loadingJenjang } = useQuery<Jenjang[]>({
    queryKey: ['jenjang'],
    queryFn: () => api.get('/api/jenjang'),
  });

  const { data: usersList = [], isLoading: loadingUsers } = useQuery<Pengelola[]>({
    queryKey: ['settings', 'users'],
    queryFn: () => api.get('/api/settings/users'),
    enabled: isKetua,
  });

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<Yayasan>) => api.put('/api/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      alert('Pengaturan yayasan berhasil diperbarui.');
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const saveJenjangMutation = useMutation({
    mutationFn: (data: Partial<Jenjang>) => {
      return showJenjangModal?.id 
        ? api.put(`/api/jenjang/${showJenjangModal.id}`, data)
        : api.post('/api/jenjang', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenjang'] });
      setShowJenjangModal(null);
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const deleteJenjangMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/jenjang/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenjang'] });
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const saveUserMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/settings/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'users'] });
      setShowUserModal(false);
      alert('Akun berhasil ditambahkan.');
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/settings/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'users'] });
    },
    onError: (err: unknown) => alert((err as Error).message),
  });

  const formatIDR = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  if (loadingSettings || loadingJenjang) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 animate-pulse rounded-2xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
          <div className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800">Pengaturan Sistem</h1>
        <p className="text-slate-500 text-sm mt-1">Konfigurasi profil yayasan dan nominal program pendidikan TPQ / RTQ.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Yayasan Profile (Restrict modification to Ketua) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium space-y-6"
        >
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Profil Yayasan
            </h2>
            {!isKetua && (
              <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Hanya Baca
              </span>
            )}
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const values = Object.fromEntries(formData.entries());
            updateSettingsMutation.mutate({
              nama: values.nama ? String(values.nama) : undefined,
              alamat: values.alamat ? String(values.alamat) : undefined,
              nominalSyahriahDefault: Number(values.nominalSyahriahDefault || 0),
            });
          }} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Yayasan</label>
              <input 
                type="text" 
                name="nama" 
                defaultValue={yayasanDetail?.nama || ''} 
                disabled={!isKetua}
                required 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 disabled:opacity-60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Alamat Lembaga</label>
              <textarea 
                name="alamat" 
                defaultValue={yayasanDetail?.alamat || ''} 
                disabled={!isKetua}
                required 
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 disabled:opacity-60 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Default Fallback Syahriah (SPP)</label>
              <input 
                type="number" 
                name="nominalSyahriahDefault" 
                defaultValue={yayasanDetail?.nominalSyahriahDefault || 0} 
                disabled={!isKetua}
                required 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 disabled:opacity-60 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Digunakan apabila santri wajib SPP belum dihubungkan ke program jenjang manapun.</p>
            </div>

            {isKetua ? (
              <Button type="submit" className="w-full py-5 rounded-xl font-semibold shadow-sm" disabled={updateSettingsMutation.isPending}>
                {updateSettingsMutation.isPending ? 'Menyimpan...' : 'Perbarui Profil Yayasan'}
              </Button>
            ) : (
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-amber-100">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Hanya peran Ketua Yayasan yang diizinkan mengubah konfigurasi lembaga.</span>
              </div>
            )}
          </form>
        </motion.div>

        {/* Section 2: Jenjang (Educational programs TPQ / RTQ) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium space-y-4"
        >
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Program Jenjang & SPP
            </h2>
            {(isKetua || userRole === 'bendahara') && (
              <Button onClick={() => setShowJenjangModal({})} className="rounded-xl h-9 px-3 text-xs flex items-center gap-1 shadow-sm">
                <Plus className="w-4 h-4" /> Tambah Jenjang
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {jenjangList.map((j) => (
              <div key={j.id} className="p-3.5 bg-slate-50 rounded-2xl flex justify-between items-center text-sm">
                <div>
                  <h4 className="font-bold text-slate-800">{j.nama}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Biaya default: {formatIDR(j.nominalSyahriah)}/bulan</p>
                </div>
                {(isKetua || userRole === 'bendahara') && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowJenjangModal(j)}
                      className="p-1.5 hover:bg-slate-150 rounded-lg text-slate-450 hover:text-slate-650"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { if(confirm(`Hapus jenjang ${j.nama}?`)) deleteJenjangMutation.mutate(j.id); }}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-slate-450 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {jenjangList.length === 0 && (
              <span className="text-xs text-slate-400 block text-center py-8">Belum ada program jenjang ditambahkan.</span>
            )}
          </div>
        </motion.div>

        {/* Section 3: Akun Pengelola (Ketua / Bendahara / Sekretariat) */}
        {isKetua && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium space-y-4 lg:col-span-2"
          >
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Akun Pengelola
              </h2>
              <Button onClick={() => setShowUserModal(true)} className="rounded-xl h-9 px-3 text-xs flex items-center gap-1 shadow-sm">
                <UserPlus className="w-4 h-4" /> Tambah Akun
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loadingUsers ? (
                <div className="p-4 bg-slate-50 rounded-2xl animate-pulse h-24" />
              ) : (
                usersList.map((u: Pengelola) => (
                  <div key={u.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-start text-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center uppercase">
                        {u.nama.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{u.nama}</h4>
                        <p className="text-[10px] text-slate-400">{u.username}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600">
                          {u.role}
                        </span>
                      </div>
                    </div>
                    {u.id !== userProfile?.user?.id && (
                      <button 
                        onClick={() => { if(confirm(`Hapus akun ${u.nama}?`)) deleteUserMutation.mutate(u.id); }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
              {usersList.length === 0 && !loadingUsers && (
                <span className="text-xs text-slate-400 block col-span-full">Belum ada akun pengelola ditambahkan.</span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* JENJANG MODAL (Add/Edit) */}
      <AnimatePresence>
        {showJenjangModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display text-slate-800">
                  {showJenjangModal.id ? 'Ubah Jenjang Program' : 'Tambah Jenjang Baru'}
                </h3>
                <button onClick={() => setShowJenjangModal(null)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                saveJenjangMutation.mutate({
                  nama: values.nama ? String(values.nama) : undefined,
                  nominalSyahriah: Number(values.nominalSyahriah),
                });
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Program</label>
                  <input 
                    type="text" 
                    name="nama" 
                    defaultValue={showJenjangModal.nama || ''}
                    placeholder="Contoh: TPQ, RTQ, Madrasah Diniyah"
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nominal Syahriah Default (IDR)</label>
                  <input 
                    type="number" 
                    name="nominalSyahriah" 
                    defaultValue={showJenjangModal.nominalSyahriah || ''}
                    placeholder="Contoh: 75000"
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowJenjangModal(null)} className="rounded-xl">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={saveJenjangMutation.isPending}>
                    {saveJenjangMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* USER MODAL (Add Bendahara/Sekretariat) */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-display text-slate-800">Tambah Akun Baru</h3>
                <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = Object.fromEntries(formData.entries());
                saveUserMutation.mutate(values);
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Lengkap</label>
                  <input 
                    type="text" name="nama" required placeholder="Ahmad Lutfi"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username Login</label>
                  <input 
                    type="text" name="username" required placeholder="almunawwaroh.bendahara"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                  <input 
                    type="password" name="password" required minLength={6} placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role / Peran</label>
                  <select 
                    name="role" required defaultValue="bendahara"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-sm focus:outline-none"
                  >
                    <option value="bendahara">Bendahara (Keuangan)</option>
                    <option value="sekretariat">Sekretariat (Data Pokok)</option>
                    <option value="ketua">Ketua (Semua Akses / Admin)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <Button type="button" variant="outline" onClick={() => setShowUserModal(false)} className="rounded-xl">Batal</Button>
                  <Button type="submit" className="rounded-xl px-6" disabled={saveUserMutation.isPending}>
                    {saveUserMutation.isPending ? 'Menyimpan...' : 'Tambahkan'}
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
