"use client"

import { useState } from "react"
import { Search, Calendar, FileText, Trash2, Edit, Printer, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for demonstration
const mockData = [
  {
    id: 1,
    alamat: "Jl. Merdeka No. 123, Jakarta Selatan",
    jenisPelayanan: ["Pemeriksaan Umum", "Laboratorium Darah"],
    totalTarif: 35000,
    sumberPendanaan: "BPJS",
    metodePembayaran: "Transfer",
  },
  {
    id: 2,
    alamat: "Jl. Sudirman No. 45, Jakarta Pusat",
    jenisPelayanan: ["Konsultasi Spesialis"],
    totalTarif: 150000,
    sumberPendanaan: "Umum",
    metodePembayaran: "Tunai",
  },
  {
    id: 3,
    alamat: "Komp. Graha Indah Blok A No. 10",
    jenisPelayanan: ["Pemeriksaan Umum", "Vaksinasi", "Resep Obat"],
    totalTarif: 275000,
    sumberPendanaan: "Asuransi",
    metodePembayaran: "Transfer",
  },
]

interface ServiceRecapListViewProps {
  onAddNew: () => void
}

export function ServiceRecapListView({ onAddNew }: ServiceRecapListViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showEntries, setShowEntries] = useState("10")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const truncateAddress = (address: string, maxLength: number = 30) => {
    if (address.length <= maxLength) return address
    return address.substring(0, maxLength) + "..."
  }

  const ActionDropdown = ({ id }: { id: number }) => (
    <td className="relative">
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
          className="flex items-center justify-center p-2 hover:bg-slate-100 rounded"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {activeDropdown === id && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setActiveDropdown(null)}
            />
            <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Kwitansi
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Detail
              </button>
              <hr className="my-1" />
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-red-600 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            </div>
          </>
        )}
      </div>
    </td>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Rekapitulasi Pelayanan</h1>
        <p className="text-slate-600">Kelola data rekapitulasi pelayanan pasien</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="cyan" className="text-white">
          <FileText className="h-4 w-4 mr-2" />
          Show Total Pendapatan
        </Button>
        <Button variant="green" className="text-white">
          Export Excel
        </Button>
        <Button onClick={onAddNew}>
          + Tambah Rekapitulasi Pelayanan
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Date Range */}
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 w-40"
              />
            </div>
            <span className="text-slate-500">to</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 w-40"
              />
            </div>
            <Button variant="green" className="text-white">
              Cari
            </Button>
          </div>

          {/* Show Entries */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Show entries</label>
            <Select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="w-20"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Jenis Pelayanan</TableHead>
              <TableHead>Total Tarif</TableHead>
              <TableHead>Sumber Pendanaan</TableHead>
              <TableHead>Metode Pembayaran</TableHead>
              <TableHead className="w-16">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell title={item.alamat}>
                  {truncateAddress(item.alamat)}
                </TableCell>
                <TableCell>
                  <ol className="list-decimal list-inside space-y-1">
                    {item.jenisPelayanan.map((layanan, idx) => (
                      <li key={idx} className="text-sm">
                        {layanan}
                      </li>
                    ))}
                  </ol>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(item.totalTarif)}
                </TableCell>
                <TableCell>{item.sumberPendanaan}</TableCell>
                <TableCell>{item.metodePembayaran}</TableCell>
                <ActionDropdown id={item.id} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-slate-600">
          Showing 1 to {mockData.length} of {mockData.length} entries
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
