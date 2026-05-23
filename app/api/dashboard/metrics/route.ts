import { NextRequest, NextResponse } from 'next/server'
import { prisma, toNumber } from '@/lib/prisma'

// GET - Dashboard Analytics Pipeline
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'Bulan Ini'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Determine date range based on period
    let dateFilter: any = {}
    const now = new Date()

    if (startDate && endDate) {
      // Custom date range
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else {
      switch (period) {
        case 'Hari Ini':
          dateFilter = {
            gte: new Date(now.setHours(0, 0, 0, 0)),
            lte: new Date(now.setHours(23, 59, 59, 999)),
          }
          break
        case 'Minggu Ini':
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          weekStart.setHours(0, 0, 0, 0)
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          weekEnd.setHours(23, 59, 59, 999)
          dateFilter = {
            gte: weekStart,
            lte: weekEnd,
          }
          break
        case 'Bulan Ini':
        default:
          dateFilter = {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
            lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
          }
          break
      }
    }

    // Total Pendapatan (sum)
    const revenueResult = await prisma.rekapPelayanan.aggregate({
      where: {
        tanggal: dateFilter,
      },
      _sum: {
        totalTarifKeseluruhan: true,
      },
    })

    const totalPendapatan = toNumber(revenueResult._sum.totalTarifKeseluruhan || 0)

    // Total Kunjungan Pasien (count)
    const totalKunjungan = await prisma.rekapPelayanan.count({
      where: {
        tanggal: dateFilter,
      },
    })

    // Layanan Terlaris (most used service)
    const serviceUsage = await prisma.detailPelayanan.groupBy({
      by: ['jenisPelayananSnapshot'],
      where: {
        rekapPelayanan: {
          tanggal: dateFilter,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        subtotal: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 1,
    })

    const layananTerlaris = serviceUsage[0]
      ? {
          nama: serviceUsage[0].jenisPelayananSnapshot,
          count: serviceUsage[0]._count.id,
          total: toNumber(serviceUsage[0]._sum.subtotal || 0),
        }
      : null

    // Daily Revenue Breakdown (for chart)
    const dailyRevenue = await prisma.$queryRaw`
      SELECT
        DATE(r.tanggal) as date,
        TO_CHAR(r.tanggal, 'DD Mon') as label,
        COALESCE(SUM(r.total_tarif_keseluruhan), 0) as revenue
      FROM rekap_pelayanan r
      WHERE r.tanggal::date >= ${dateFilter.gte}::date
        AND r.tanggal::date <= ${dateFilter.lte}::date
      GROUP BY DATE(r.tanggal), TO_CHAR(r.tanggal, 'DD Mon')
      ORDER BY DATE(r.tanggal)
    ` as Array<{ date: Date; label: string; revenue: bigint }>

    const dailyRevenueChart = dailyRevenue.map((item) => ({
      date: item.label,
      revenue: Number(item.revenue),
    }))

    // Service Distribution (for donut chart)
    const serviceDistribution = await prisma.detailPelayanan.groupBy({
      by: ['jenisPelayananSnapshot'],
      where: {
        rekapPelayanan: {
          tanggal: dateFilter,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    })

    const colors = ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#64748b', '#8b5cf6']
    const serviceDistributionChart = serviceDistribution.map((item, index) => ({
      name: item.jenisPelayananSnapshot,
      count: item._count.id,
      color: colors[index % colors.length],
    }))

    // Previous month data for trend calculation
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const previousRevenue = await prisma.rekapPelayanan.aggregate({
      where: {
        tanggal: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      _sum: {
        totalTarifKeseluruhan: true,
      },
    })

    const previousPendapatan = toNumber(previousRevenue._sum.totalTarifKeseluruhan || 0)

    // Calculate trend percentage
    let revenueTrend = 0
    if (previousPendapatan > 0) {
      revenueTrend = ((totalPendapatan - previousPendapatan) / previousPendapatan) * 100
    }

    const previousKunjungan = await prisma.rekapPelayanan.count({
      where: {
        tanggal: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    })

    let kunjunganTrend = 0
    if (previousKunjungan > 0) {
      kunjunganTrend = ((totalKunjungan - previousKunjungan) / previousKunjungan) * 100
    }

    return NextResponse.json({
      kpi: {
        totalPendapatan: {
          value: totalPendapatan,
          trend: revenueTrend,
          positive: revenueTrend >= 0,
        },
        totalKunjungan: {
          value: totalKunjungan,
          trend: kunjunganTrend,
          positive: kunjunganTrend >= 0,
        },
        layananTerlaris,
      },
      charts: {
        dailyRevenue: dailyRevenueChart,
        serviceDistribution: serviceDistributionChart,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
