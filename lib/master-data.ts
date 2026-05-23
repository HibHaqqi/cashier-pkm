export interface ServiceMasterItem {
  id: string;
  kategori: string;
  jenis_pelayanan: string;
  tarif: number;
  satuan?: string;
}

export const MASTER_PELAYANAN_SAMPLE: ServiceMasterItem[] = [
  // Rawat Jalan & Pemeriksaan Umum
  { id: "SRV-001", kategori: "Pelayanan Rawat Jalan", jenis_pelayanan: "Pemeriksaan Umum / Rawat Jalan", tarif: 10000 },
  { id: "SRV-002", kategori: "Pelayanan Rawat Jalan", jenis_pelayanan: "Pemeriksaan Kesehatan untuk Penerbitan Surat Keterangan Sehat", tarif: 15000 },
  { id: "SRV-003", kategori: "Pelayanan Rawat Jalan", jenis_pelayanan: "Pemeriksaan Kesehatan Jiwa / Bebas Narkoba", tarif: 50000 },
  { id: "SRV-004", kategori: "Pelayanan Rawat Jalan", jenis_pelayanan: "Pemeriksaan Buta Warna", tarif: 10000 },

  // Tindakan Medis & Gawat Darurat
  { id: "SRV-005", kategori: "Tindakan Medis Kecil", jenis_pelayanan: "Penjahitan Luka (1-3 jahitan)", tarif: 25000 },
  { id: "SRV-006", kategori: "Tindakan Medis Kecil", jenis_pelayanan: "Perawatan Luka Kotor / Gangren", tarif: 30000 },
  { id: "SRV-007", kategori: "Tindakan Medis Sedang", jenis_pelayanan: "Ekstraksi Kuku / Rozer Plasty", tarif: 50000 },
  { id: "SRV-008", kategori: "Tindakan Medis", jenis_pelayanan: "Pemasangan / Pelepasan Kateter Urine", tarif: 35000 },

  // Laboratorium & Penunjang
  { id: "SRV-009", kategori: "Laboratorium Sederhana", jenis_pelayanan: "Pemeriksaan Hemoglobin (Hb) Stik", tarif: 15000 },
  { id: "SRV-010", kategori: "Laboratorium Sederhana", jenis_pelayanan: "Pemeriksaan Gula Darah Stik", tarif: 20000 },
  { id: "SRV-011", kategori: "Laboratorium Sederhana", jenis_pelayanan: "Pemeriksaan Kolesterol Stik", tarif: 30000 },
  { id: "SRV-012", kategori: "Laboratorium Sederhana", jenis_pelayanan: "Pemeriksaan Asam Urat Stik", tarif: 25000 },
  { id: "SRV-013", kategori: "Laboratorium", jenis_pelayanan: "Tes Kehamilan (Plano Test)", tarif: 15000 },
  { id: "SRV-014", kategori: "Laboratorium", jenis_pelayanan: "Pemeriksaan Golongan Darah & Rhesus", tarif: 15000 },

  // Ambulans / Mobil Jenazah (Tarif per Kilometer)
  { id: "SRV-015", kategori: "Ambulans", jenis_pelayanan: "Tarif Ambulans Lapangan (5 Km Pertama)", tarif: 75000, satuan: "Paket" },
  { id: "SRV-016", kategori: "Ambulans", jenis_pelayanan: "Tarif Tambahan Ambulans per Kilometer berikutnya", tarif: 7500, satuan: "Km" }
];

export const KATEGORIES = Array.from(new Set(MASTER_PELAYANAN_SAMPLE.map(item => item.kategori)));

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}
