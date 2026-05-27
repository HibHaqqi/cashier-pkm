const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Default Puskesmas ID
  const defaultPuskesmasId = 'PUSKESMAS-001'

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@puskesmas.id' },
    update: {},
    create: {
      puskesmasId: defaultPuskesmasId,
      name: 'Admin Puskesmas',
      email: 'admin@puskesmas.id',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Default admin user created:', adminUser.email)
  console.log('Default puskesmasId:', defaultPuskesmasId)
  console.log('Default password: admin123')

  // Master Pelayanan Data
  const masterPelayananData = [
    { puskesmasId: defaultPuskesmasId, kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Umum / Rawat Jalan', tarif: 10000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Kesehatan untuk Penerbitan Surat Keterangan Sehat', tarif: 15000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Kesehatan Jiwa / Bebas Narkoba', tarif: 50000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Pelayanan Rawat Jalan', jenisPelayanan: 'Pemeriksaan Buta Warna', tarif: 10000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Tindakan Medis Kecil', jenisPelayanan: 'Penjahitan Luka (1-3 jahitan)', tarif: 25000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Tindakan Medis Kecil', jenisPelayanan: 'Perawatan Luka Kotor / Gangren', tarif: 30000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Tindakan Medis Sedang', jenisPelayanan: 'Ekstraksi Kuku / Rozer Plasty', tarif: 50000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Tindakan Medis', jenisPelayanan: 'Pemasangan / Pelepasan Kateter Urine', tarif: 35000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Hemoglobin (Hb) Stik', tarif: 15000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Gula Darah Stik', tarif: 20000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Kolesterol Stik', tarif: 30000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Laboratorium Sederhana', jenisPelayanan: 'Pemeriksaan Asam Urat Stik', tarif: 25000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Laboratorium', jenisPelayanan: 'Tes Kehamilan (Plano Test)', tarif: 15000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Laboratorium', jenisPelayanan: 'Pemeriksaan Golongan Darah & Rhesus', tarif: 15000 },
    { puskesmasId: defaultPuskesmasId, kategori: 'Ambulans', jenisPelayanan: 'Tarif Ambulans Lapangan (5 Km Pertama)', tarif: 75000, satuan: 'Paket' },
    { puskesmasId: defaultPuskesmasId, kategori: 'Ambulans', jenisPelayanan: 'Tarif Tambahan Ambulans per Kilometer berikutnya', tarif: 7500, satuan: 'Km' },
  ]

  // Insert Master Pelayanan
  for (const item of masterPelayananData) {
    await prisma.masterPelayanan.create({
      data: item,
    })
  }

  console.log('Master Pelayanan seeded successfully')

  // Get some services for sample data
  const umumService = await prisma.masterPelayanan.findFirst({
    where: { jenisPelayanan: 'Pemeriksaan Umum / Rawat Jalan' }
  })
  const hbService = await prisma.masterPelayanan.findFirst({
    where: { jenisPelayanan: 'Pemeriksaan Hemoglobin (Hb) Stik' }
  })
  const gulaService = await prisma.masterPelayanan.findFirst({
    where: { jenisPelayanan: 'Pemeriksaan Gula Darah Stik' }
  })

  // Sample Rekap Pelayanan Data
  const sampleRekap = await prisma.rekapPelayanan.create({
    data: {
      puskesmasId: defaultPuskesmasId,
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
            masterPelayananId: umumService.id,
            jenisPelayananSnapshot: 'Pemeriksaan Umum / Rawat Jalan',
            tarifDasar: 10000,
            qtyKilometer: 1,
            subtotal: 10000,
          },
          {
            masterPelayananId: hbService.id,
            jenisPelayananSnapshot: 'Pemeriksaan Hemoglobin (Hb) Stik',
            tarifDasar: 15000,
            qtyKilometer: 1,
            subtotal: 15000,
          },
          {
            masterPelayananId: gulaService.id,
            jenisPelayananSnapshot: 'Pemeriksaan Gula Darah Stik',
            tarifDasar: 10000,
            qtyKilometer: 1,
            subtotal: 10000,
          },
        ],
      },
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
