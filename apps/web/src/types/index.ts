export interface Yayasan {
  id: string;
  nama: string;
  alamat: string;
  nominalSyahriahDefault: number;
}

export interface Jenjang {
  id: string;
  nama: string;
  nominalSyahriah: number;
}

export interface UserProfile {
  user: {
    id: string;
    yayasanId: string;
    nama: string;
    username: string;
    role: 'ketua' | 'sekretariat' | 'bendahara';
    yayasanNama: string;
  };
}

export interface Santri {
  id: string;
  nama: string;
  nik?: string | null;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  sekolah: string;
  tanggalMasuk: string;
  statusAktif: boolean;
  syahriahStatus: string;
  syahriahNominalKustom?: number | null;
  fotoSecureUrl?: string | null;
  jenjangNama?: string | null;
  kkNomor?: string | null;
  kkId?: string | null;
  jenjangId?: string | null;
}

export interface SantriDokumen {
  id: string;
  namaDokumen: string;
  secureUrl: string;
}

export interface SantriDetail extends Santri {
  kkDetails?: Kk | null;
  dokumen?: SantriDokumen[];
}

export interface Kk {
  id: string;
  nomorKk: string;
  namaAyah: string;
  namaIbu: string;
  namaWali?: string | null;
  alamat: string;
  rt: string;
  rw: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  memberCount?: number;
}

export interface Ustadz {
  id: string;
  nomorInduk?: string | null;
  namaLengkap: string;
  namaPanggilan?: string | null;
  jenisKelamin?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: string | null;
  noHp?: string | null;
  alamat?: string | null;
  foto?: string | null;
  tmtMengajar?: string | null;
  statusKeaktifan?: string | null;
  unitMengajar?: string | null;
  hafalanJuz?: number | null;
  jenisBisyarah?: string | null;
  nominalBisyarah?: number | null;
}

export interface UstadzJabatan {
  id: string;
  jabatan: string;
  tmtJabatan?: string | null;
  tstJabatan?: string | null;
  status?: string | null;
}

export interface UstadzDetail extends Ustadz {
  dokumen?: { id: string; namaDokumen: string; secureUrl: string }[];
  jabatan?: UstadzJabatan[];
}
