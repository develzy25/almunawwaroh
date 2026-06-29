"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Menu, X, Settings, Wallet, DollarSign, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Navigasi Item Config
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Santri', href: '/santri', icon: Users },
  { name: 'Ustadz', href: '/ustadz', icon: Users },
  { name: 'Keuangan', href: '/keuangan', icon: CreditCard },
  { name: 'Pengaturan', href: '/pengaturan', icon: Settings },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/api/auth/me').then(res => res.user),
  });

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {});
      localStorage.removeItem('session_token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Gagal logout. Coba lagi.');
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50/50 flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-100 p-6 z-20">
        <div className="flex items-center gap-3 mb-8">
          <Image src="/logo.png" alt="Logo Al-Munawwaroh" width={40} height={40} className="w-10 h-10 rounded-2xl object-cover shadow-sm" />
          <span className="font-semibold text-slate-800 tracking-tight font-display">Al-Munawwaroh</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Profile / Settings footer */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-medium text-brand-700 capitalize">
              {profile?.nama?.charAt(0) || '-'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{profile?.nama || 'Memuat...'}</p>
              <p className="text-xs text-slate-400 capitalize">{profile?.role || 'Admin'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 md:pl-64 min-h-dvh pb-[env(safe-area-inset-bottom,24px)] mb-16 md:mb-0 flex flex-col">
        <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 px-6 flex items-center justify-between z-10 md:hidden">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="w-7 h-7 rounded-lg object-cover shadow-sm" />
            <span className="font-semibold text-slate-800 font-display text-lg tracking-tight">Al-Munawwaroh</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700 uppercase">
            {profile?.nama?.substring(0, 2) || '-'}
          </div>
        </header>
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] flex justify-around items-center px-2 z-30 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-all ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              {item.name}
            </Link>
          );
        })}

        {/* Menu trigger button (Open Bottom Sheet) */}
        <button
          onClick={() => setShowBottomSheet(true)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium text-slate-400"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          Menu
        </button>
      </div>

      {/* MOBILE BOTTOM SHEET MENU */}
      <AnimatePresence>
        {showBottomSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBottomSheet(false)}
              className="fixed inset-0 bg-black z-45 md:hidden"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 md:hidden border-t border-slate-100 shadow-xl"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-800 text-lg font-display">Menu Tambahan</h3>
                <button
                  onClick={() => setShowBottomSheet(false)}
                  className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tambahan Menu Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Link
                  href="/pengajar"
                  onClick={() => setShowBottomSheet(false)}
                  className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl text-center hover:bg-emerald-50/50 transition-colors"
                >
                  <Users className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-medium text-slate-600">Pengajar</span>
                </Link>
                <Link
                  href="/keuangan/tabungan"
                  onClick={() => setShowBottomSheet(false)}
                  className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl text-center hover:bg-emerald-50/50 transition-colors"
                >
                  <Wallet className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-medium text-slate-600">Tabungan</span>
                </Link>
                <Link
                  href="/keuangan/penggajian"
                  onClick={() => setShowBottomSheet(false)}
                  className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl text-center hover:bg-emerald-50/50 transition-colors"
                >
                  <DollarSign className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-medium text-slate-600">Penggajian</span>
                </Link>
                <Link
                  href="/pengaturan"
                  onClick={() => setShowBottomSheet(false)}
                  className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl text-center hover:bg-emerald-50/50 transition-colors col-span-3"
                >
                  <Settings className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-medium text-slate-600">Pengaturan Yayasan</span>
                </Link>
                <button
                  onClick={() => { setShowBottomSheet(false); handleLogout(); }}
                  className="flex flex-col items-center p-4 bg-red-50 rounded-2xl text-center hover:bg-red-100 transition-colors col-span-3 mt-2"
                >
                  <LogOut className="w-6 h-6 text-red-500 mb-2" />
                  <span className="text-xs font-medium text-red-600">Keluar (Logout)</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
