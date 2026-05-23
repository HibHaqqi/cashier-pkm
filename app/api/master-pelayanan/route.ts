import { NextRequest, NextResponse } from 'next/server'
import { prisma, toNumber } from '@/lib/prisma'

// GET - Fetch all master pelayanan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kategori = searchParams.get('kategori')
    const search = searchParams.get('search')

    const where: any = {}

    if (kategori && kategori !== 'Semua') {
      where.kategori = kategori
    }

    if (search) {
      where.OR = [
        { jenisPelayanan: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    const records = await prisma.masterPelayanan.findMany({
      where,
      orderBy: {
        kategori: 'asc',
      },
    })

    const transformedRecords = records.map((record) => ({
      id: record.id,
      kategori: record.kategori,
      jenis_pelayanan: record.jenisPelayanan,
      tarif: toNumber(record.tarif),
      satuan: record.satuan,
    }))

    return NextResponse.json({
      data: transformedRecords,
      total: transformedRecords.length,
    })
  } catch (error) {
    console.error('Error fetching master pelayanan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}

// POST - Create new master pelayanan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { kategori, jenisPelayanan, tarif, satuan } = body

    if (!kategori || !jenisPelayanan || !tarif) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newRecord = await prisma.masterPelayanan.create({
      data: {
        kategori,
        jenisPelayanan,
        tarif: parseFloat(tarif),
        satuan: satuan || null,
      },
    })

    return NextResponse.json(
      {
        message: 'Service created successfully',
        data: {
          id: newRecord.id,
          kategori: newRecord.kategori,
          jenis_pelayanan: newRecord.jenisPelayanan,
          tarif: toNumber(newRecord.tarif),
          satuan: newRecord.satuan,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating master pelayanan:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

// PUT - Update master pelayanan
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, kategori, jenisPelayanan, tarif, satuan } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const updatedRecord = await prisma.masterPelayanan.update({
      where: { id },
      data: {
        kategori,
        jenisPelayanan,
        tarif: parseFloat(tarif),
        satuan: satuan || null,
      },
    })

    return NextResponse.json(
      {
        message: 'Service updated successfully',
        data: {
          id: updatedRecord.id,
          kategori: updatedRecord.kategori,
          jenis_pelayanan: updatedRecord.jenisPelayanan,
          tarif: toNumber(updatedRecord.tarif),
          satuan: updatedRecord.satuan,
        },
      }
    )
  } catch (error) {
    console.error('Error updating master pelayanan:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE - Delete master pelayanan
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await prisma.masterPelayanan.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Service deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting master pelayanan:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
