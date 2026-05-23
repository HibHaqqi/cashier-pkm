import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Master Pelayanan Data
  const masterPelayananData = [
    // Rawat Jalan & Pemeriksaan Umum
    { kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Umum / Rawat Jalan', tarif: 10000 },
    { kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Kesehatan untuk Penerbitan Surat Keterangan Sehat', tarif: 15000 },
    { kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Kesehatan Jiwa / Bebas Narkoba', tarif: 50000 },
    { kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Buta Warna', tarif: 10000 },

    // Tindakan Medis & Gawat Darurat
    { kategori: 'Tindakan Medis Kecil', jenisPelayanan: 'Penjahitan Luka (1-3 jahitan)', tarif: 25000 },
    { kategori: 'Tindakan Medis Kecil', jenisPelayanan: 'Perawatan Luka Kotor / Gangren', tarif: 30000 },
    { kategori: 'Tindakan Medis Sedang', jenisPelayanan: 'Ekstraksi Kuku / Rozer Plasty', tarif: 50000 },
    { kategori: 'Tindakan Medis', jenisPelayanan: 'Pemasangan / Pelepasan Kateter Urine', tarif: 35000 },

    // Laboratorium & Penunjang
    { kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Hemoglobin (Hb) Stik', tarif: 15000 },
    { kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Gula Darah Stik', tarif: 20000 },
    { kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Kolesterol Stik', tarif: 30000 },
    { kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Asam Urat Stik', tarif: 25000 },
    { kategori: 'Laboratorium', jenisPelayanan: 'Tes Kehamilan (Plano Test)', tarif: 15000 },
    { kategori: 'Laboratorium', jenisPelayanan: 'Pemeriksaan Golongan Darah & Rhesus', tarif: 15000 },

    // Ambulans / Mobil Jenazah
    { kategori: 'Ambulans', jenisPelayanan: 'Tarif Ambulans Lapangan (5 Km Pertama)', tarif: 75000, satuan: 'Paket' },
    { kategori: 'Ambulans', jenisPelayanan: 'Tarif Tambahan Ambulans per Kilometer berikutnya', tarif: 7500, satuan: 'Km' },
  ]

  // Insert Master Pelayanan
  for (const item of masterPelayananData) {
    await prisma.masterPelayanan.upsert({
      where: {
        id: item.id || `temp-${Date.now()}-${Math.random()}`,
      },
      update: {},
      create: item,
    })
  }

  console.log('Master Pelayanan seeded successfully')

  // Sample Rekap Pelayanan Data (for demo)
  const sampleRekap = await prisma.rekapPelayanan.create({
    data: {
      noKwitansi: 'KW-2025050001',
      tanggal: new Date(),
      nama: 'Ahmad Sudrajat',
      alamat: 'Jl. Merdeka No. 123, Jakarta Selatan',
      jenisKelamin: 'L',
      usia: 35,
      nomorRm: 'RM-001234',
      sumberPendanaan: 'BPJS',
      metodePembayaran: 'Transfer',
      totalTarifKeseluruhan: 35000,
      detailPelayanan: {
        create: [
          {
            masterPelayananId: (await prisma.masterPelayanan.findFirst({ where: { jenisPelayanan: 'Pemeriksaan Umum / Rawat Jalan' } }))!.id,
            jenisPelayananSnapshot: 'Pemeriksaan Umum / Rawat Jalan',
            tarifDasar: 10000,
            qtyKilometer: 1,
            subtotal: 10000,
          },
          {
            masterPelayananId: (await prisma.masterPelayanan.findFirst({ where: { jenisPelayanan: 'Pemeriksaan Hemoglobin (Hb) Stik' } }))!.id,
            jenisPelayananSnapshot: 'Pemeriksaan Hemoglobin (Hb) Stik',
            tarifDasar: 15000,
            qtyKilometer: 1,
            subtotal: 15000,
          },
          {
            masterPelayananId: (await prisma.masterPelayanan.findFirst({ where: { jenisPelayanan: 'Pemeriksaan Gula Darah Stik' } }))!.id,
            jenisPelayananSnapshot: 'Pemeriksaan Gula Darah Stik',
            tarifDasar: 10000,
            qtyKilometer: 1,
            subtotal: 10000,
          },
        ],
      },
    })

  console.log('Sample Rekap Pelayanan created')
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
