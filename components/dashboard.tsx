"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

// Mock Data for Daily Revenue
const dailyRevenueData = [
  { date: "01 May", revenue: 1250000 },
  { date: "02 May", revenue: 2100000 },
  { date: "03 May", revenue: 1850000 },
  { date: "04 May", revenue: 3200000 },
  { date: "05 May", revenue: 2800000 },
  { date: "06 May", revenue: 4500000 },
  { date: "07 May", revenue: 3800000 },
  { date: "08 May", revenue: 2200000 },
  { date: "09 May", revenue: 2900000 },
  { date: "10 May", revenue: 3500000 },
  { date: "11 May", revenue: 4100000 },
  { date: "12 May", revenue: 5200000 },
  { date: "13 May", revenue: 4800000 },
  { date: "14 May", revenue: 3900000 },
]

// Mock Data for Service Distribution
const serviceDistributionData = [
  { name: "Pemeriksaan Umum", value: 85, count: 342, color: "#3b82f6" },
  { name: "Konsultasi Spesialis", value: 45, count: 181, color: "#06b6d4" },
  { name: "Laboratorium Darah", value: 62, count: 250, color: "#f59e0b" },
  { name: "Vaksinasi", value: 38, count: 153, color: "#10b981" },
  { name: "Pemeriksaan Gigi", value: 54, count: 218, color: "#64748b" },
  { name: "USG", value: 28, count: 113, color: "#8b5cf6" },
]

// KPI Cards Data
const kpiData = {
  totalPendapatan: {
    title: "Total Pendapatan (Bulan Ini)",
    value: "Rp 15.420.000",
    trend: 12.5,
    icon: DollarSign,
    positive: true,
  },
  totalKunjungan: {
    title: "Total Kunjungan Pasien",
    value: "1,247",
    trend: 8.2,
    icon: Users,
    positive: true,
  },
  layananTerlaris: {
    title: "Layanan Terlaris",
    value: "Pemeriksaan Umum",
    trend: null,
    icon: Activity,
    subtitle: "342 transaksi this month",
  },
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toString()
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-slate-700">{payload[0].payload.date}</p>
        <p className="text-lg font-semibold text-blue-600">
          Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const total = serviceDistributionData.reduce((sum, item) => sum + item.count, 0)
    const percentage = ((data.count / total) * 100).toFixed(1)

    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-slate-700">{data.name}</p>
        <p className="text-lg font-semibold" style={{ color: data.color }}>
          {data.count} ({percentage}%)
        </p>
      </div>
    )
  }
  return null
}

interface KPICardProps {
  title: string
  value: string
  trend?: number | null
  icon: React.ElementType
  positive?: boolean
  subtitle?: string
}

function KPICard({ title, value, trend, icon: Icon, positive, subtitle }: KPICardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{value}</h3>
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
            {trend !== null && (
              <div className="flex items-center gap-1 mt-2">
                {positive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${positive ? "text-green-600" : "text-red-600"}`}>
                  {positive ? "+" : ""}{trend}%
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

export function Dashboard() {
  const [filterPeriod, setFilterPeriod] = useState("Bulan Ini")

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Ringkasan statistik dan analitik pelayanan Puskesmas</p>
      </div>

      {/* Filter Header */}
      <div className="flex items-center gap-3 mb-6">
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
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          title={kpiData.totalPendapatan.title}
          value={kpiData.totalPendapatan.value}
          trend={kpiData.totalPendapatan.trend}
          icon={kpiData.totalPendapatan.icon}
          positive={kpiData.totalPendapatan.positive}
        />
        <KPICard
          title={kpiData.totalKunjungan.title}
          value={kpiData.totalKunjungan.value}
          trend={kpiData.totalKunjungan.trend}
          icon={kpiData.totalKunjungan.icon}
          positive={kpiData.totalKunjungan.positive}
        />
        <KPICard
          title={kpiData.layananTerlaris.title}
          value={kpiData.layananTerlaris.value}
          trend={kpiData.layananTerlaris.trend}
          icon={kpiData.layananTerlaris.icon}
          subtitle={kpiData.layananTerlaris.subtitle}
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
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyRevenueData}>
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
          </CardContent>
        </Card>

        {/* Service Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribusi Jenis Pelayanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {serviceDistributionData.map((entry, index) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
