"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Calendar, FileText, Trash2, Edit, Printer, Eye, MoreHorizontal, Loader2, RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RekapPelayanan {
  id: string
  noKwitansi: string
  tanggal: string
  nama: string
  alamat: string
  jenisKelamin: string
  usia: number
  nomorRm: string
  sumberPendanaan: string
  metodePembayaran: string
  totalTarifKeseluruhan: number
  detailPelayanan: {
    jenisPelayananSnapshot: string
  }[]
}

interface ServiceRecapListViewProps {
  onAddNew: () => void
  onEdit?: (id: string) => void
  refreshTrigger?: number
}

export function ServiceRecapListView({ onAddNew, onEdit, refreshTrigger }: ServiceRecapListViewProps) {
  const [data, setData] = useState<RekapPelayanan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEntries, setShowEntries] = useState("10")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [error, setError] = useState<string | null>(null)
  const [totalPendapatan, setTotalPendapatan] = useState(0)
  const dropdownRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)

      const response = await fetch(`/api/rekap-pelayanan?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch data")

      const result = await response.json()
      setData(result.data || [])

      // Calculate total pendapatan
      const total = (result.data || []).reduce((sum: number, item: RekapPelayanan) =>
        sum + (item.totalTarifKeseluruhan || 0), 0
      )
      setTotalPendapatan(total)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [startDate, endDate, refreshTrigger])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const exportToExcel = () => {
    const exportData = getFilteredData().map((item, index) => ({
      "No": index + 1,
      "No Kwitansi": item.noKwitansi,
      "Tanggal": formatDate(item.tanggal),
      "Nama": item.nama,
      "Alamat": item.alamat,
      "Jenis Pelayanan": item.detailPelayanan.map(d => d.jenisPelayananSnapshot).join(", "),
      "Total": item.totalTarifKeseluruhan,
      "Sumber Dana": item.sumberPendanaan,
      "Metode Bayar": item.metodePembayaran,
    }))

    // Convert to CSV
    if (exportData.length === 0) {
      alert("Tidak ada data untuk diekspor")
      return
    }

    const headers = ["No", "No Kwitansi", "Tanggal", "Nama", "Alamat", "Jenis Pelayanan", "Total", "Sumber Dana", "Metode Bayar"]
    const csvContent = [
      headers.join(","),
      ...exportData.map((row: any) => [
        row["No"],
        `"${row["No Kwitansi"]}"`,
        `"${row["Tanggal"]}"`,
        `"${row["Nama"]}"`,
        `"${row["Alamat"]}"`,
        `"${row["Jenis Pelayanan"]}"`,
        row["Total"],
        `"${row["Sumber Dana"]}"`,
        `"${row["Metode Bayar"]}"`,
      ].join(","))
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `rekapitulasi_pelayanan_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const truncateAddress = (address: string, maxLength: number = 30) => {
    if (address.length <= maxLength) return address
    return address.substring(0, maxLength) + "..."
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return

    try {
      const response = await fetch(`/api/rekap-pelayanan?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete data")

      fetchData()
      setActiveDropdown(null)
    } catch (err) {
      console.error("Error deleting data:", err)
      alert("Failed to delete data")
    }
  }

  const getFilteredData = () => {
    let filtered = data

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nomorRm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.noKwitansi.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const getPaginatedData = () => {
    const filtered = getFilteredData()
    const limit = parseInt(showEntries)
    return filtered.slice(0, limit)
  }

  const ActionDropdown = ({ item }: { item: RekapPelayanan }) => {
    const handleToggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setDropdownPosition({ top: rect.bottom + 4, left: rect.right - 192 })
      setActiveDropdown(activeDropdown === item.id ? null : item.id)
    }

    return (
      <td className="relative">
        <div className="relative">
          <button
            ref={(el) => { dropdownRefs.current[item.id] = el }}
            onClick={handleToggleDropdown}
            className="flex items-center justify-center p-2 hover:bg-slate-100 rounded"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {activeDropdown === item.id && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setActiveDropdown(null)}
              />
              <div
                className="fixed z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1"
                style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
              >
                <button
                  onClick={() => {
                    setActiveDropdown(null)
                    if (onEdit) onEdit(item.id)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
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
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    )
  }

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
          Total: {formatCurrency(totalPendapatan)}
        </Button>
        <Button onClick={exportToExcel} variant="green" className="text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
        <Button onClick={() => fetchData()} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button onClick={onAddNew}>
          + Tambah Rekapitulasi
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nama, alamat, no RM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

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
          </div>

          {/* Show Entries */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Show</span>
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
            <span className="text-sm text-slate-600">entries</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : getPaginatedData().length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Tidak ada data. Silakan tambah rekapitulasi pelayanan baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-10">No</TableHead>
                  <TableHead>No. Kwitansi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Jenis Pelayanan</TableHead>
                  <TableHead>Total Tarif</TableHead>
                  <TableHead>Sumber Dana</TableHead>
                  <TableHead>Metode Bayar</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getPaginatedData().map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.noKwitansi}</TableCell>
                    <TableCell>{formatDate(item.tanggal)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.nama}</p>
                        <p className="text-xs text-slate-500">{item.nomorRm}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {truncateAddress(item.alamat)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.detailPelayanan.slice(0, 2).map((detail, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                          >
                            {detail.jenisPelayananSnapshot}
                          </span>
                        ))}
                        {item.detailPelayanan.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            +{item.detailPelayanan.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {formatCurrency(item.totalTarifKeseluruhan)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                        {item.sumberPendanaan}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">
                        {item.metodePembayaran}
                      </span>
                    </TableCell>
                    <ActionDropdown item={item} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Info */}
        {!loading && getPaginatedData().length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
            <span>
              Showing {Math.min(getPaginatedData().length, parseInt(showEntries))} of {getFilteredData().length} entries
            </span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
