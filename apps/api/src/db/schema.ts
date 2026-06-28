import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

// Helper timestamp fields
const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
};

// 1. Yayasan (Tenant)
export const yayasan = sqliteTable('yayasan', {
  id: text('id').primaryKey(), // UUID
  nama: text('nama').notNull(),
  alamat: text('alamat').notNull(),
  nominalSyahriahDefault: integer('nominal_syahriah_default').default(0).notNull(), // Default monthly tuition fee
  ...timestamps,
});

// 2. Jenjang (Educational Level, e.g., TPQ, RTQ)
export const jenjang = sqliteTable('jenjang', {
  id: text('id').primaryKey(), // UUID
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  nama: text('nama').notNull(), // 'TPQ' | 'RTQ' | etc.
  nominalSyahriah: integer('nominal_syahriah').notNull(), // Default fee for this program level
  ...timestamps,
}, (table) => ({
  yayasanJenjangIdx: index('jenjang_yayasan_idx').on(table.yayasanId),
}));

// 3. Users (Auth & Roles)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  username: text('username').notNull(),
  passwordHash: text('password_hash').notNull(),
  nama: text('nama').notNull(),
  role: text('role').notNull(), // 'ketua' | 'sekretariat' | 'bendahara'
  ...timestamps,
}, (table) => ({
  usernameIdx: uniqueIndex('users_username_idx').on(table.username),
  yayasanIdx: index('users_yayasan_idx').on(table.yayasanId),
}));

// 4. Sessions (Session cookie auth)
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: integer('expires_at').notNull(), // Unix timestamp (seconds)
  ...timestamps,
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
}));

// 5. Kartu Keluarga (KK)
export const kartuKeluarga = sqliteTable('kartu_keluarga', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  nomorKk: text('nomor_kk').notNull(),
  alamat: text('alamat').notNull(),
  rt: text('rt').notNull(),
  rw: text('rw').notNull(),
  desa: text('desa').notNull(),
  kecamatan: text('kecamatan').notNull(),
  kabupaten: text('kabupaten').notNull(),
  provinsi: text('provinsi').notNull(),
  namaAyah: text('nama_ayah').notNull(),
  namaIbu: text('nama_ibu').notNull(),
  namaWali: text('nama_wali'), // Opsional
  ...timestamps,
}, (table) => ({
  yayasanKkIdx: uniqueIndex('kk_yayasan_kk_idx').on(table.yayasanId, table.nomorKk),
}));

// 6. Santri
export const santri = sqliteTable('santri', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  kkId: text('kk_id').references(() => kartuKeluarga.id, { onDelete: 'set null' }),
  jenjangId: text('jenjang_id').references(() => jenjang.id, { onDelete: 'set null' }), // Program TPQ / RTQ
  nama: text('nama').notNull(),
  nik: text('nik'), // Nullable untuk tracking completeness
  jenisKelamin: text('jenis_kelamin').notNull(), // 'L' | 'P'
  tempatLahir: text('tempat_lahir').notNull(),
  tanggalLahir: text('tanggal_lahir').notNull(), // YYYY-MM-DD
  alamat: text('alamat').notNull(),
  sekolah: text('sekolah').notNull(),
  tanggalMasuk: text('tanggal_masuk').notNull(), // YYYY-MM-DD
  statusAktif: integer('status_aktif', { mode: 'boolean' }).default(true).notNull(),
  syahriahStatus: text('syahriah_status').notNull(), // 'WAJIB' | 'GRATIS'
  syahriahNominalKustom: integer('syahriah_nominal_kustom'), // Override default nominal level jika perlu
  fotoCloudinaryId: text('foto_cloudinary_id'),
  fotoSecureUrl: text('foto_secure_url'),
  fotoWidth: integer('foto_width'),
  fotoHeight: integer('foto_height'),
  fotoBytes: integer('foto_bytes'),
  ...timestamps,
}, (table) => ({
  yayasanSantriIdx: index('santri_yayasan_idx').on(table.yayasanId),
  kkIdx: index('santri_kk_idx').on(table.kkId),
  jenjangIdx: index('santri_jenjang_idx').on(table.jenjangId),
}));

// 7. Santri Dokumen (Upload Akta Kelahiran, dll)
export const santriDokumen = sqliteTable('santri_dokumen', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  santriId: text('santri_id').references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  namaDokumen: text('nama_dokumen').notNull(),
  cloudinaryId: text('cloudinary_id').notNull(),
  secureUrl: text('secure_url').notNull(),
  bytes: integer('bytes').notNull(),
  ...timestamps,
}, (table) => ({
  yayasanSantriDokumenIdx: index('santri_dokumen_yayasan_idx').on(table.yayasanId, table.santriId),
}));

// 8. Ustadz
export const ustadz = sqliteTable('ustadz', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  nomorInduk: text('nomor_induk'),
  namaLengkap: text('nama_lengkap').notNull(),
  namaPanggilan: text('nama_panggilan'),
  jenisKelamin: text('jenis_kelamin'), // 'L' | 'P'
  tempatLahir: text('tempat_lahir'),
  tanggalLahir: text('tanggal_lahir'),
  noHp: text('no_hp'),
  alamat: text('alamat'),
  foto: text('foto'), // Cloudinary URL / ID
  tmtMengajar: text('tmt_mengajar'),
  statusKeaktifan: text('status_keaktifan'), // 'Aktif' | 'Cuti' | 'Nonaktif' | 'Mengundurkan Diri'
  unitMengajar: text('unit_mengajar'), // 'TPQ' | 'RTQ' | 'TPQ & RTQ'
  hafalanJuz: integer('hafalan_juz'), // 0 - 30
  jenisBisyarah: text('jenis_bisyarah'), // 'Tidak Ada' | 'Bulanan' | 'Per Pertemuan' | 'Relawan'
  nominalBisyarah: integer('nominal_bisyarah'),
  ...timestamps,
}, (table) => ({
  yayasanUstadzIdx: index('ustadz_yayasan_idx').on(table.yayasanId),
}));

// 9. Jabatan Ustadz
export const ustadzJabatan = sqliteTable('ustadz_jabatan', {
  id: text('id').primaryKey(),
  ustadzId: text('ustadz_id').references(() => ustadz.id, { onDelete: 'cascade' }).notNull(),
  jabatan: text('jabatan').notNull(),
  tmtJabatan: text('tmt_jabatan'),
  tstJabatan: text('tst_jabatan'),
  status: text('status'), // Aktif / Nonaktif
  ...timestamps,
}, (table) => ({
  ustadzJabatanIdx: index('ustadz_jabatan_idx').on(table.ustadzId),
}));

// 10. Dokumen Ustadz (Opsional, tapi direkomendasikan)
export const ustadzDokumen = sqliteTable('ustadz_dokumen', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  ustadzId: text('ustadz_id').references(() => ustadz.id, { onDelete: 'cascade' }).notNull(),
  jenisDokumen: text('jenis_dokumen'), // 'KTP' | 'Sertifikat Tahsin' | 'Sertifikat Tahfidz' | 'Syahadah/Sanad' | 'Lainnya'
  namaDokumen: text('nama_dokumen').notNull(),
  cloudinaryId: text('cloudinary_id').notNull(),
  secureUrl: text('secure_url').notNull(),
  bytes: integer('bytes').notNull(),
  ...timestamps,
}, (table) => ({
  yayasanUstadzDokumenIdx: index('ustadz_dokumen_yayasan_idx').on(table.yayasanId, table.ustadzId),
}));

// 11. Pembayaran Syahriah (Bukan Kas Umum Langsung, nanti dikelompokkan ke Laporan)
export const syahriahPayment = sqliteTable('syahriah_payment', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  santriId: text('santri_id').references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  bulan: integer('bulan').notNull(), // 1 - 12
  tahun: integer('tahun').notNull(), // e.g., 2026
  jumlahBayar: integer('jumlah_bayar').notNull(),
  tanggalBayar: text('tanggal_bayar').notNull(), // YYYY-MM-DD
  catatan: text('catatan'),
  ...timestamps,
}, (table) => ({
  yayasanSantriBulanTahunIdx: uniqueIndex('syahriah_unique_idx').on(table.yayasanId, table.santriId, table.bulan, table.tahun),
}));

// 12. Tabungan Santri (Cooperative system, terpisah dari Kas Yayasan)
export const tabunganSantri = sqliteTable('tabungan_santri', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  santriId: text('santri_id').references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  jenisTransaksi: text('jenis_transaksi').notNull(), // 'SETOR' | 'TARIK'
  jumlah: integer('jumlah').notNull(),
  tanggalTransaksi: text('tanggal_transaksi').notNull(), // YYYY-MM-DD
  keterangan: text('keterangan'),
  ...timestamps,
}, (table) => ({
  yayasanSantriTabunganIdx: index('tabungan_santri_idx').on(table.yayasanId, table.santriId),
}));

// 13. Pemasukan Kas Yayasan
export const pemasukan = sqliteTable('pemasukan', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  tanggal: text('tanggal').notNull(), // YYYY-MM-DD
  jumlah: integer('jumlah').notNull(),
  sumber: text('sumber').notNull(), // e.g., 'SYAHRIAH', 'DONASI', etc.
  keterangan: text('keterangan'),
  ...timestamps,
}, (table) => ({
  yayasanPemasukanIdx: index('pemasukan_yayasan_idx').on(table.yayasanId),
}));

// 14. Pengeluaran Kas Yayasan
export const pengeluaran = sqliteTable('pengeluaran', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  tanggal: text('tanggal').notNull(), // YYYY-MM-DD
  jumlah: integer('jumlah').notNull(),
  kategori: text('kategori').notNull(), // e.g., 'GAJI', 'OPERASIONAL', etc.
  keterangan: text('keterangan'),
  ...timestamps,
}, (table) => ({
  yayasanPengeluaranIdx: index('pengeluaran_yayasan_idx').on(table.yayasanId),
}));

// 15. Penggajian Bulanan Pengajar
export const penggajian = sqliteTable('penggajian', {
  id: text('id').primaryKey(),
  yayasanId: text('yayasan_id').references(() => yayasan.id, { onDelete: 'cascade' }).notNull(),
  ustadzId: text('ustadz_id').references(() => ustadz.id, { onDelete: 'cascade' }).notNull(),
  bulan: integer('bulan').notNull(), // 1 - 12
  tahun: integer('tahun').notNull(),
  gajiPokok: integer('gaji_pokok').notNull(),
  tunjangan: integer('tunjangan').default(0).notNull(),
  potongan: integer('potongan').default(0).notNull(),
  totalDiterima: integer('total_diterima').notNull(), // (gajiPokok + tunjangan - potongan)
  tanggalDibayar: text('tanggal_dibayar').notNull(), // YYYY-MM-DD
  status: text('status').notNull(), // 'DIBAYAR'
  pengeluaranId: text('pengeluaran_id').references(() => pengeluaran.id, { onDelete: 'set null' }),
  ...timestamps,
}, (table) => ({
  yayasanUstadzBulanTahunIdx: uniqueIndex('penggajian_unique_idx').on(table.yayasanId, table.ustadzId, table.bulan, table.tahun),
}));
