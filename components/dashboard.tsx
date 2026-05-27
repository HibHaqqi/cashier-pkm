"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Calendar, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toString()
}

const formatRupiah = (value: number) => {
  return `Rp ${value.toLocaleString("id-ID")}`
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-slate-700">{payload[0].payload.date}</p>
        <p className="text-lg font-semibold text-blue-600">
          {formatRupiah(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload

    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-slate-700">{data.name}</p>
        <p className="text-lg font-semibold" style={{ color: data.color }}>
          {data.count}
        </p>
      </div>
    )
  }
  return null
}

interface KPICardProps {
  title: string
  value: string | number
  trend?: number | null
  icon: React.ElementType
  positive?: boolean
  subtitle?: string
  loading?: boolean
}

function KPICard({ title, value, trend, icon: Icon, positive, subtitle, loading }: KPICardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{value}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
            {trend !== null && !loading && (
              <div className="flex items-center gap-1 mt-2">
                {positive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${positive ? "text-green-600" : "text-red-600"}`}>
                  {positive ? "+" : ""}{(trend ?? 0).toFixed(1)}%
                </span>
                <span className="text-sm text-slate-500">vs bulan lalu</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardData {
  kpi: {
    totalPendapatan: {
      value: number
      trend: number
      positive: boolean
    }
    totalKunjungan: {
      value: number
      trend: number
      positive: boolean
    }
    layananTerlaris: {
      nama: string | null
      count: number
      total: number
    } | null
  }
  charts: {
    dailyRevenue: { date: string; revenue: number }[]
    serviceDistribution: { name: string; count: number; color: string }[]
  }
}

export function Dashboard() {
  const [filterPeriod, setFilterPeriod] = useState("Bulan Ini")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append("period", filterPeriod)

      if (filterPeriod === "Kustom Tanggal" && customStartDate && customEndDate) {
        params.append("startDate", customStartDate)
        params.append("endDate", customEndDate)
      }

      const response = await fetch(`/api/dashboard/metrics?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [filterPeriod])

  const handleApplyFilter = () => {
    if (filterPeriod === "Kustom Tanggal" && customStartDate && customEndDate) {
      fetchDashboardData()
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Ringkasan statistik dan analitik pelayanan Puskesmas</p>
      </div>

      {/* Filter Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Calendar className="h-4 w-4 text-slate-600" />
          <label className="text-sm font-medium text-slate-700">Periode:</label>
          <Select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="w-48"
          >
            <option value="Hari Ini">Hari Ini</option>
            <option value="Minggu Ini">Minggu Ini</option>
            <option value="Bulan Ini">Bulan Ini</option>
            <option value="Kustom Tanggal">Kustom Tanggal</option>
          </Select>

          {/* Custom Date Range - Show only when "Kustom Tanggal" is selected */}
          {filterPeriod === "Kustom Tanggal" && (
            <div className="flex items-center gap-2 ml-4">
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-40"
              />
              <span className="text-slate-500">to</span>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-40"
              />
              <Button variant="cyan" className="text-white" onClick={handleApplyFilter}>
                Terapkan
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Total Pendapatan (Bulan Ini)"
          value={data?.kpi.totalPendapatan.value ? formatRupiah(data.kpi.totalPendapatan.value) : "-"}
          trend={data?.kpi.totalPendapatan.trend}
          icon={DollarSign}
          positive={data?.kpi.totalPendapatan.positive}
          loading={loading}
        />
        <KPICard
          title="Total Kunjungan Pasien"
          value={data?.kpi.totalKunjungan.value ?? "-"}
          trend={data?.kpi.totalKunjungan.trend}
          icon={Users}
          positive={data?.kpi.totalKunjungan.positive}
          loading={loading}
        />
        <KPICard
          title="Layanan Terlaris"
          value={data?.kpi.layananTerlaris?.nama ?? "-"}
          trend={null}
          icon={Activity}
          subtitle={data?.kpi.layananTerlaris ? `${data.kpi.layananTerlaris.count} transaksi` : undefined}
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tren Pendapatan Harian</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : data?.charts.dailyRevenue.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.charts.dailyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                Tidak ada data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribusi Jenis Pelayanan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : data?.charts.serviceDistribution.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.charts.serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {data.charts.serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={80}
                    iconType="circle"
                    formatter={(value: string) => (
                      <span className="text-sm text-slate-700">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                Tidak ada data
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
