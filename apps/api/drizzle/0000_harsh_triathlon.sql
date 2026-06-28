CREATE TABLE `jenjang` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`nama` text NOT NULL,
	`nominal_syahriah` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kartu_keluarga` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`nomor_kk` text NOT NULL,
	`alamat` text NOT NULL,
	`rt` text NOT NULL,
	`rw` text NOT NULL,
	`desa` text NOT NULL,
	`kecamatan` text NOT NULL,
	`kabupaten` text NOT NULL,
	`provinsi` text NOT NULL,
	`nama_ayah` text NOT NULL,
	`nama_ibu` text NOT NULL,
	`nama_wali` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pemasukan` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`tanggal` text NOT NULL,
	`jumlah` integer NOT NULL,
	`sumber` text NOT NULL,
	`keterangan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pengeluaran` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`tanggal` text NOT NULL,
	`jumlah` integer NOT NULL,
	`kategori` text NOT NULL,
	`keterangan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `penggajian` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`ustadz_id` text NOT NULL,
	`bulan` integer NOT NULL,
	`tahun` integer NOT NULL,
	`gaji_pokok` integer NOT NULL,
	`tunjangan` integer DEFAULT 0 NOT NULL,
	`potongan` integer DEFAULT 0 NOT NULL,
	`total_diterima` integer NOT NULL,
	`tanggal_dibayar` text NOT NULL,
	`status` text NOT NULL,
	`pengeluaran_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ustadz_id`) REFERENCES `ustadz`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pengeluaran_id`) REFERENCES `pengeluaran`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `santri` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`kk_id` text,
	`jenjang_id` text,
	`nama` text NOT NULL,
	`nik` text,
	`jenis_kelamin` text NOT NULL,
	`tempat_lahir` text NOT NULL,
	`tanggal_lahir` text NOT NULL,
	`alamat` text NOT NULL,
	`sekolah` text NOT NULL,
	`tanggal_masuk` text NOT NULL,
	`status_aktif` integer DEFAULT true NOT NULL,
	`syahriah_status` text NOT NULL,
	`syahriah_nominal_kustom` integer,
	`foto_cloudinary_id` text,
	`foto_secure_url` text,
	`foto_width` integer,
	`foto_height` integer,
	`foto_bytes` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kk_id`) REFERENCES `kartu_keluarga`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `santri_dokumen` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`santri_id` text NOT NULL,
	`nama_dokumen` text NOT NULL,
	`cloudinary_id` text NOT NULL,
	`secure_url` text NOT NULL,
	`bytes` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `syahriah_payment` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`santri_id` text NOT NULL,
	`bulan` integer NOT NULL,
	`tahun` integer NOT NULL,
	`jumlah_bayar` integer NOT NULL,
	`tanggal_bayar` text NOT NULL,
	`catatan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tabungan_santri` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`santri_id` text NOT NULL,
	`jenis_transaksi` text NOT NULL,
	`jumlah` integer NOT NULL,
	`tanggal_transaksi` text NOT NULL,
	`keterangan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`nama` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ustadz` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`nomor_induk` text,
	`nama_lengkap` text NOT NULL,
	`nama_panggilan` text,
	`jenis_kelamin` text,
	`tempat_lahir` text,
	`tanggal_lahir` text,
	`no_hp` text,
	`alamat` text,
	`foto` text,
	`tmt_mengajar` text,
	`status_keaktifan` text,
	`unit_mengajar` text,
	`hafalan_juz` integer,
	`jenis_bisyarah` text,
	`nominal_bisyarah` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ustadz_dokumen` (
	`id` text PRIMARY KEY NOT NULL,
	`yayasan_id` text NOT NULL,
	`ustadz_id` text NOT NULL,
	`jenis_dokumen` text,
	`nama_dokumen` text NOT NULL,
	`cloudinary_id` text NOT NULL,
	`secure_url` text NOT NULL,
	`bytes` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`yayasan_id`) REFERENCES `yayasan`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ustadz_id`) REFERENCES `ustadz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ustadz_jabatan` (
	`id` text PRIMARY KEY NOT NULL,
	`ustadz_id` text NOT NULL,
	`jabatan` text NOT NULL,
	`tmt_jabatan` text,
	`tst_jabatan` text,
	`status` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`ustadz_id`) REFERENCES `ustadz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `yayasan` (
	`id` text PRIMARY KEY NOT NULL,
	`nama` text NOT NULL,
	`alamat` text NOT NULL,
	`nominal_syahriah_default` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `jenjang_yayasan_idx` ON `jenjang` (`yayasan_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `kk_yayasan_kk_idx` ON `kartu_keluarga` (`yayasan_id`,`nomor_kk`);--> statement-breakpoint
CREATE INDEX `pemasukan_yayasan_idx` ON `pemasukan` (`yayasan_id`);--> statement-breakpoint
CREATE INDEX `pengeluaran_yayasan_idx` ON `pengeluaran` (`yayasan_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `penggajian_unique_idx` ON `penggajian` (`yayasan_id`,`ustadz_id`,`bulan`,`tahun`);--> statement-breakpoint
CREATE INDEX `santri_yayasan_idx` ON `santri` (`yayasan_id`);--> statement-breakpoint
CREATE INDEX `santri_kk_idx` ON `santri` (`kk_id`);--> statement-breakpoint
CREATE INDEX `santri_jenjang_idx` ON `santri` (`jenjang_id`);--> statement-breakpoint
CREATE INDEX `santri_dokumen_yayasan_idx` ON `santri_dokumen` (`yayasan_id`,`santri_id`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `syahriah_unique_idx` ON `syahriah_payment` (`yayasan_id`,`santri_id`,`bulan`,`tahun`);--> statement-breakpoint
CREATE INDEX `tabungan_santri_idx` ON `tabungan_santri` (`yayasan_id`,`santri_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_yayasan_idx` ON `users` (`yayasan_id`);--> statement-breakpoint
CREATE INDEX `ustadz_yayasan_idx` ON `ustadz` (`yayasan_id`);--> statement-breakpoint
CREATE INDEX `ustadz_dokumen_yayasan_idx` ON `ustadz_dokumen` (`yayasan_id`,`ustadz_id`);--> statement-breakpoint
CREATE INDEX `ustadz_jabatan_idx` ON `ustadz_jabatan` (`ustadz_id`);