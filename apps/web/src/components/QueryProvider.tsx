"use client";

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 menit (Mencegah pemanggilan API berulang ke Cloudflare)
        refetchOnWindowFocus: false, // Tidak otomatis fetch saat ganti tab browser
        refetchOnMount: false, // Tidak otomatis fetch saat komponen dimuat ulang (jika data masih ada)
        refetchOnReconnect: false, // Tidak otomatis fetch saat koneksi internet putus-nyambung
        retry: 1, // Hanya coba 1 kali jika gagal, jangan spam
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
