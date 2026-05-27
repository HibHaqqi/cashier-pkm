"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Plus, X, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency as formatIDR } from "@/lib/master-data"

interface ServiceMasterItem {
  id: string
  kategori: string
  jenis_pelayanan: string
  tarif: number
  satuan?: string
}

interface ServiceItem {
  masterPelayananId: string
  jenisPelayanan: string
  tarifDasar: number
  qtyKilometer: number
  subtotal: number
}

interface FormData {
  tanggal: string
  nama: string
  alamat: string
  jenisKelamin: "L" | "P" | ""
  usia: string
  nomorRm: string
  sumberPendanaan: string
  metodePembayaran: string
}

interface AddServiceFormProps {
  onBack: () => void
  onSuccess?: () => void
}

const SUMBER_DANA = ["BPJS", "Umum", "Jaminan Kesehatan Daerah", "Asuransi Swasta", "Lainnya"]
const METODE_PEMBAYARAN = ["Tunai", "Transfer", "Kartu Debit", "Kartu Kredit", "QRIS"]

export function AddServiceForm({ onBack, onSuccess }: AddServiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    tanggal: new Date().toISOString().split("T")[0],
    nama: "",
    alamat: "",
    jenisKelamin: "",
    usia: "",
    nomorRm: "",
    sumberPendanaan: "",
    metodePembayaran: "",
  })

  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([])
  const [masterPelayanan, setMasterPelayanan] = useState<ServiceMasterItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [qtyKilometer, setQtyKilometer] = useState(1)
  const [serviceSearch, setServiceSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Fetch master pelayanan data
  useEffect(() => {
    fetchMasterPelayanan()
  }, [])

  const fetchMasterPelayanan = async () => {
    try {
      const response = await fetch("/api/master-pelayanan")
      if (!response.ok) throw new Error("Failed to fetch master pelayanan")
      const result = await response.json()
      setMasterPelayanan(result.data || [])
    } catch (err) {
      console.error("Error fetching master pelayanan:", err)
      setError("Failed to load master pelayanan")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return formatIDR(amount)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const filteredServices = masterPelayanan.filter((service) =>
    service.jenis_pelayanan.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  const handleAddService = () => {
    const service = masterPelayanan.find((s) => s.id === selectedService)
    if (!service) return

    const subtotal = service.tarif * qtyKilometer
    const newItem: ServiceItem = {
      masterPelayananId: service.id,
      jenisPelayanan: service.jenis_pelayanan,
      tarifDasar: service.tarif,
      qtyKilometer,
      subtotal,
    }

    setServiceItems((prev) => [...prev, newItem])
    setIsModalOpen(false)
    setSelectedService("")
    setQtyKilometer(1)
    setServiceSearch("")
  }

  const handleRemoveService = (index: number) => {
    setServiceItems((prev) => prev.filter((_, i) => i !== index))
  }

  const totalTarifKeseluruhan = serviceItems.reduce((sum, item) => sum + item.subtotal, 0)

  const handleSave = async () => {
    // Validation
    if (!formData.tanggal || !formData.nama || !formData.alamat || !formData.jenisKelamin ||
        !formData.usia || !formData.nomorRm || !formData.sumberPendanaan || !formData.metodePembayaran) {
      setError("Semua field harus diisi")
      return
    }

    if (serviceItems.length === 0) {
      setError("Minimal satu jenis pelayanan harus ditambahkan")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload = {
        tanggal: formData.tanggal,
        nama: formData.nama,
        alamat: formData.alamat,
        jenisKelamin: formData.jenisKelamin,
        usia: parseInt(formData.usia),
        nomorRm: formData.nomorRm,
        sumberPendanaan: formData.sumberPendanaan,
        metodePembayaran: formData.metodePembayaran,
        totalTarifKeseluruhan,
        layananItems: serviceItems,
      }

      const response = await fetch("/api/rekap-pelayanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save data")
      }

      // Reset form
      setFormData({
        tanggal: new Date().toISOString().split("T")[0],
        nama: "",
        alamat: "",
        jenisKelamin: "",
        usia: "",
        nomorRm: "",
        sumberPendanaan: "",
        metodePembayaran: "",
      })
      setServiceItems([])

      // Call success callback or go back
      if (onSuccess) {
        onSuccess()
      }
      onBack()
    } catch (err) {
      console.error("Error saving data:", err)
      setError(err instanceof Error ? err.message : "Failed to save data")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Tambah Rekapitulasi Pelayanan</h1>
          <p className="text-slate-600">Input data pelayanan pasien baru</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Patient Information Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Pasien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tanggal">Tanggal *</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => handleInputChange("tanggal", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  type="text"
                  value={formData.nama}
                  onChange={(e) => handleInputChange("nama", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div>
                <Label htmlFor="alamat">Alamat *</Label>
                <Input
                  id="alamat"
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat"
                  required
                />
              </div>
              <div>
                <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                <Select
                  id="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={(e) => handleInputChange("jenisKelamin", e.target.value)}
                  required
                >
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="usia">Usia *</Label>
                <Input
                  id="usia"
                  type="number"
                  value={formData.usia}
                  onChange={(e) => handleInputChange("usia", e.target.value)}
                  placeholder="Masukkan usia"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nomorRm">No. RM *</Label>
                <Input
                  id="nomorRm"
                  type="text"
                  value={formData.nomorRm}
                  onChange={(e) => handleInputChange("nomorRm", e.target.value)}
                  placeholder="Masukkan nomor RM"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sumberPendanaan">Sumber Pendanaan *</Label>
                <Select
                  id="sumberPendanaan"
                  value={formData.sumberPendanaan}
                  onChange={(e) => handleInputChange("sumberPendanaan", e.target.value)}
                  required
                >
                  <option value="">Pilih</option>
                  {SUMBER_DANA.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="metodePembayaran">Metode Pembayaran *</Label>
                <Select
                  id="metodePembayaran"
                  value={formData.metodePembayaran}
                  onChange={(e) => handleInputChange("metodePembayaran", e.target.value)}
                  required
                >
                  <option value="">Pilih</option>
                  {METODE_PEMBAYARAN.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Service Items Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Jenis Pelayanan</h2>
              <Button type="button" variant="default" onClick={() => setIsModalOpen(true)} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pelayanan
              </Button>
            </div>

            {serviceItems.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Belum ada jenis pelayanan ditambahkan
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">No</TableHead>
                    <TableHead>Jenis Pelayanan</TableHead>
                    <TableHead>Tarif Dasar</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead className="w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.jenisPelayanan}</TableCell>
                      <TableCell>{formatCurrency(item.tarifDasar)}</TableCell>
                      <TableCell>{item.qtyKilometer}</TableCell>
                      <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Total */}
            {serviceItems.length > 0 && (
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-slate-600">Total Tarif Keseluruhan</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalTarifKeseluruhan)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      )}

      {/* Add Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Jenis Pelayanan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari jenis pelayanan..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Service List */}
            <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg">
              {filteredServices.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Tidak ada pelayanan ditemukan
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Pelayanan</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Tarif</TableHead>
                      <TableHead className="w-10">Pilih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow
                        key={service.id}
                        className={selectedService === service.id ? "bg-blue-50" : ""}
                      >
                        <TableCell>{service.jenis_pelayanan}</TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                            {service.kategori}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(service.tarif)}</TableCell>
                        <TableCell>
                          <input
                            type="radio"
                            name="service"
                            checked={selectedService === service.id}
                            onChange={() => setSelectedService(service.id)}
                            className="w-4 h-4"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Qty and Add Button */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="qty">Qty / Kilometer</Label>
                <Input
                  id="qty"
                  type="number"
                  value={qtyKilometer}
                  onChange={(e) => setQtyKilometer(parseFloat(e.target.value) || 1)}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="flex-1">
                <Label>Subtotal</Label>
                <div className="h-10 px-3 flex items-center bg-slate-100 rounded-lg text-slate-700">
                  {selectedService
                    ? formatCurrency(
                        (masterPelayanan.find((s) => s.id === selectedService)?.tarif || 0) *
                          qtyKilometer
                      )
                    : "-"}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddService} disabled={!selectedService}>
                Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
