-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "puskesmasId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_pelayanan" (
    "id" TEXT NOT NULL,
    "puskesmasId" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jenisPelayanan" TEXT NOT NULL,
    "tarif" DECIMAL(12,2) NOT NULL,
    "satuan" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_pelayanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rekap_pelayanan" (
    "id" TEXT NOT NULL,
    "puskesmasId" TEXT NOT NULL,
    "noKwitansi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "usia" INTEGER NOT NULL,
    "nomorRm" TEXT NOT NULL,
    "sumberPendanaan" TEXT NOT NULL,
    "metodePembayaran" TEXT NOT NULL,
    "totalTarifKeseluruhan" DECIMAL(12,2) NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rekap_pelayanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_pelayanan" (
    "id" TEXT NOT NULL,
    "rekapPelayananId" TEXT NOT NULL,
    "masterPelayananId" TEXT NOT NULL,
    "jenisPelayananSnapshot" TEXT NOT NULL,
    "tarifDasar" DECIMAL(12,2) NOT NULL,
    "qtyKilometer" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detail_pelayanan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_puskesmasId_idx" ON "users"("puskesmasId");

-- CreateIndex
CREATE INDEX "master_pelayanan_puskesmasId_idx" ON "master_pelayanan"("puskesmasId");

-- CreateIndex
CREATE UNIQUE INDEX "rekap_pelayanan_noKwitansi_key" ON "rekap_pelayanan"("noKwitansi");

-- CreateIndex
CREATE INDEX "rekap_pelayanan_puskesmasId_idx" ON "rekap_pelayanan"("puskesmasId");

-- CreateIndex
CREATE UNIQUE INDEX "rekap_pelayanan_puskesmasId_noKwitansi_key" ON "rekap_pelayanan"("puskesmasId", "noKwitansi");

-- AddForeignKey
ALTER TABLE "master_pelayanan" ADD CONSTRAINT "master_pelayanan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rekap_pelayanan" ADD CONSTRAINT "rekap_pelayanan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_pelayanan" ADD CONSTRAINT "detail_pelayanan_rekapPelayananId_fkey" FOREIGN KEY ("rekapPelayananId") REFERENCES "rekap_pelayanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_pelayanan" ADD CONSTRAINT "detail_pelayanan_masterPelayananId_fkey" FOREIGN KEY ("masterPelayananId") REFERENCES "master_pelayanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
