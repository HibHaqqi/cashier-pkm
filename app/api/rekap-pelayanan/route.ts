import { NextRequest, NextResponse } from 'next/server'
import { prisma, toNumber } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Helper to generate sequential invoice number
async function generateNoKwitansi(): Promise<string> {
  const prefix = `KW-${new Date().toISOString().slice(0, 7).replace('-', '')}`
  const lastRecord = await prisma.rekapPelayanan.findFirst({
    where: {
      noKwitansi: {
        startsWith: prefix,
      },
    },
    orderBy: {
      noKwitansi: 'desc',
    },
  })

  let sequence = 1
  if (lastRecord) {
    const lastSequence = parseInt(lastRecord.noKwitansi.split('-')[2] || '0')
    sequence = lastSequence + 1
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`
}

// POST - Create Transaction Invoice
export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('auth-token')?.value
    let userId: string | undefined

    if (token) {
      const payload = await verifyToken(token)
      userId = payload?.userId as string
    }

    const body = await request.json()
    const {
      tanggal,
      nama,
      alamat,
      jenisKelamin,
      usia,
      nomorRm,
      sumberPendanaan,
      metodePembayaran,
      layananItems,
    } = body

    // Validate required fields
    if (!tanggal || !nama || !alamat || !jenisKelamin || !sumberPendanaan || !metodePembayaran) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!layananItems || layananItems.length === 0) {
      return NextResponse.json(
        { error: 'At least one service item is required' },
        { status: 400 }
      )
    }

    // Calculate total
    const totalTarifKeseluruhan = layananItems.reduce(
      (sum: number, item: any) => sum + (item.subtotal || 0),
      0
    )

    // Generate invoice number inside transaction
    const noKwitansi = await generateNoKwitansi()

    // Use transaction to ensure atomic multi-table inserts
    const result = await prisma.$transaction(async (tx) => {
      // Create parent RekapPelayanan record
      const rekap = await tx.rekapPelayanan.create({
        data: {
          noKwitansi,
          tanggal: new Date(tanggal),
          nama,
          alamat,
          jenisKelamin,
          usia: usia ? parseInt(usia) : null,
          nomorRm,
          sumberPendanaan,
          metodePembayaran,
          totalTarifKeseluruhan,
          createdById: userId,
        },
      })

      // Create nested DetailPelayanan records
      const details = await Promise.all(
        layananItems.map((item: any) =>
          tx.detailPelayanan.create({
            data: {
              rekapPelayananId: rekap.id,
              masterPelayananId: item.masterPelayananId || item.id,
              jenisPelayananSnapshot: item.jenisPelayanan,
              tarifDasar: item.totalTarif || item.tarifDasar,
              qtyKilometer: item.qtyKilometer || 1,
              subtotal: item.subtotal,
            },
          })
        )
      )

      return { rekap, details }
    })

    return NextResponse.json(
      {
        message: 'Transaction created successfully',
        data: {
          id: result.rekap.id,
          noKwitansi: result.rekap.noKwitansi,
          totalTarifKeseluruhan: toNumber(result.rekap.totalTarifKeseluruhan),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating rekap pelayanan:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

// GET - Fetch Data Rows with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}

    if (startDate || endDate) {
      where.tanggal = {}
      if (startDate) {
        where.tanggal.gte = new Date(startDate)
      }
      if (endDate) {
        where.tanggal.lte = new Date(endDate)
      }
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { noKwitansi: { contains: search, mode: 'insensitive' } },
        { alamat: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch with relations
    const records = await prisma.rekapPelayanan.findMany({
      where,
      include: {
        detailPelayanan: {
          include: {
            masterPelayanan: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    })

    // Transform data for frontend compatibility
    const transformedRecords = records.map((record) => ({
      id: record.id,
      noKwitansi: record.noKwitansi,
      tanggal: record.tanggal.toISOString(),
      nama: record.nama,
      alamat: record.alamat,
      jenisKelamin: record.jenisKelamin,
      usia: record.usia,
      nomorRm: record.nomorRm,
      sumberPendanaan: record.sumberPendanaan,
      metodePembayaran: record.metodePembayaran,
      totalTarifKeseluruhan: toNumber(record.totalTarifKeseluruhan),
      layananItems: record.detailPelayanan.map((detail) => ({
        id: detail.id,
        jenisPelayanan: detail.jenisPelayananSnapshot,
        tarifDasar: toNumber(detail.tarifDasar),
        qtyKilometer: toNumber(detail.qtyKilometer),
        subtotal: toNumber(detail.subtotal),
      })),
      createdAt: record.createdAt.toISOString(),
    }))

    return NextResponse.json({
      data: transformedRecords,
      total: transformedRecords.length,
    })
  } catch (error) {
    console.error('Error fetching rekap pelayanan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
