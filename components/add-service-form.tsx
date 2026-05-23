"use client"

import { useState } from "react"
import { ArrowLeft, Save, Plus, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ServiceItem {
  id: string
  jenisPelayanan: string
  totalTarif: number
  qtyKilometer: number
  subtotal: number
}

interface FormData {
  noKwitansi: string
  tanggal: string
  nama: string
  alamat: string
  jenisKelamin: "L" | "P" | ""
  usia: string
  nomorRm: string
  sumberPendanaan: string
  metodePembayaran: string
}

// Mock services data
const mockServices = [
  { id: "1", name: "Pemeriksaan Umum", price: 50000 },
  { id: "2", name: "Konsultasi Spesialis", price: 150000 },
  { id: "3", name: "Laboratorium Darah", price: 75000 },
  { id: "4", name: "Vaksinasi", price: 100000 },
  { id: "5", name: "Resep Obat", price: 25000 },
  { id: "6", name: "Pemeriksaan Gigi", price: 80000 },
  { id: "7", name: "Rontgen", price: 120000 },
  { id: "8", name: "USG", price: 200000 },
]

interface AddServiceFormProps {
  onBack: () => void
}

export function AddServiceForm({ onBack }: AddServiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    noKwitansi: "Auto Generate",
    tanggal: "",
    nama: "",
    alamat: "",
    jenisKelamin: "",
    usia: "",
    nomorRm: "",
    sumberPendanaan: "",
    metodePembayaran: "",
  })

  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [qtyKilometer, setQtyKilometer] = useState(1)
  const [serviceSearch, setServiceSearch] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  const handleAddService = () => {
    const service = mockServices.find((s) => s.id === selectedService)
    if (!service) return

    const subtotal = service.price * qtyKilometer
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      jenisPelayanan: service.name,
      totalTarif: service.price,
      qtyKilometer,
      subtotal,
    }

    setServiceItems((prev) => [...prev, newItem])
    setIsModalOpen(false)
    setSelectedService("")
    setQtyKilometer(1)
    setServiceSearch("")
  }

  const handleRemoveService = (id: string) => {
    setServiceItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalTarifKeseluruhan = serviceItems.reduce((sum, item) => sum + item.subtotal, 0)

  const handleSave = () => {
    // Here you would implement the save logic
    console.log("Saving data:", { ...formData, layananItems: serviceItems, totalTarifKeseluruhan })
    // For now, just go back to the list
    onBack()
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-slate-600">
        <span className="hover:underline cursor-pointer">Dashboard</span>
        <span className="mx-2">/</span>
        <span className="hover:underline cursor-pointer">Rekapitulasi Pelayanan</span>
        <span className="mx-2">/</span>
        <span className="text-slate-800 font-medium">Tambah Rekapitulasi Pelayanan</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Tambah Rekapitulasi Pelayanan</h1>
        <p className="text-slate-600">Isi formulir untuk menambahkan rekapitulasi pelayanan baru</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* No. Kwitansi */}
          <div>
            <Label htmlFor="noKwitansi">NO. KWITANSI</Label>
            <Input
              id="noKwitansi"
              value={formData.noKwitansi}
              disabled
              className="bg-slate-100"
            />
          </div>

          {/* Tanggal */}
          <div>
            <Label htmlFor="tanggal">TANGGAL *</Label>
            <Input
              id="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={(e) => handleInputChange("tanggal", e.target.value)}
              required
            />
          </div>

          {/* Nama */}
          <div>
            <Label htmlFor="nama">NAMA *</Label>
            <Input
              id="nama"
              placeholder="Masukan nama pasien"
              value={formData.nama}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              required
            />
          </div>

          {/* Alamat - Full Width */}
          <div className="md:col-span-3">
            <Label htmlFor="alamat">ALAMAT *</Label>
            <Input
              id="alamat"
              placeholder="Masukan alamat pasien"
              value={formData.alamat}
              onChange={(e) => handleInputChange("alamat", e.target.value)}
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <Label>JENIS KELAMIN *</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="L"
                  checked={formData.jenisKelamin === "L"}
                  onChange={(e) => handleInputChange("jenisKelamin", e.target.value as "L" | "P")}
                  className="w-4 h-4"
                  required
                />
                <span>Laki-laki</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="P"
                  checked={formData.jenisKelamin === "P"}
                  onChange={(e) => handleInputChange("jenisKelamin", e.target.value as "L" | "P")}
                  className="w-4 h-4"
                  required
                />
                <span>Perempuan</span>
              </label>
            </div>
          </div>

          {/* Usia */}
          <div>
            <Label htmlFor="usia">USIA</Label>
            <Input
              id="usia"
              type="number"
              placeholder="Masukan usia pasien"
              value={formData.usia}
              onChange={(e) => handleInputChange("usia", e.target.value)}
            />
          </div>

          {/* Nomor RM */}
          <div>
            <Label htmlFor="nomorRm">NOMOR RM</Label>
            <Input
              id="nomorRm"
              placeholder="Masukan nomor rekam medis"
              value={formData.nomorRm}
              onChange={(e) => handleInputChange("nomorRm", e.target.value)}
            />
          </div>

          {/* Sumber Pendanaan */}
          <div>
            <Label htmlFor="sumberPendanaan">SUMBER PENDANAAN *</Label>
            <Select
              id="sumberPendanaan"
              value={formData.sumberPendanaan}
              onChange={(e) => handleInputChange("sumberPendanaan", e.target.value)}
              required
            >
              <option value="">Pilih Sumber Pendanaan</option>
              <option value="BPJS">BPJS</option>
              <option value="Umum">Umum</option>
              <option value="Asuransi">Asuransi</option>
              <option value="Jaminan Kesehatan Daerah">Jaminan Kesehatan Daerah</option>
            </Select>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <Label htmlFor="metodePembayaran">METODE PEMBAYARAN *</Label>
            <Select
              id="metodePembayaran"
              value={formData.metodePembayaran}
              onChange={(e) => handleInputChange("metodePembayaran", e.target.value)}
              required
            >
              <option value="">Pilih Metode Pembayaran</option>
              <option value="Tunai">Tunai</option>
              <option value="Transfer">Transfer</option>
              <option value="Kartu Debit">Kartu Debit</option>
              <option value="Kartu Kredit">Kartu Kredit</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Daftar Jenis Pelayanan */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Daftar Jenis Pelayanan Pasien</h2>
          <Button
            variant="outline"
            className="border-amber-500 text-amber-600 hover:bg-amber-50"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Jenis Pelayanan
          </Button>
        </div>

        {/* Services Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>JENIS PELAYANAN</TableHead>
              <TableHead>TOTAL TARIF</TableHead>
              <TableHead>QTY / KILOMETER</TableHead>
              <TableHead>SUBTOTAL</TableHead>
              <TableHead className="w-16">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                  Belum ada jenis pelayanan ditambahkan
                </TableCell>
              </TableRow>
            ) : (
              serviceItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.jenisPelayanan}</TableCell>
                  <TableCell>{formatCurrency(item.totalTarif)}</TableCell>
                  <TableCell>{item.qtyKilometer}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.subtotal)}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRemoveService(item.id)}
                      className="p-2 hover:bg-red-50 rounded text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableRow className="bg-slate-50">
            <TableCell colSpan={3} className="font-semibold">
              Total Tarif Keseluruhan
            </TableCell>
            <TableCell className="font-semibold text-blue-600">
              {formatCurrency(totalTarifKeseluruhan)}
            </TableCell>
            <TableCell />
          </TableRow>
        </Table>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <Button onClick={handleSave} disabled={serviceItems.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Simpan
        </Button>
      </div>

      {/* Modal for Adding Service */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Jenis Pelayanan</DialogTitle>
            <DialogClose onClick={() => setIsModalOpen(false)} />
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Service Selection */}
            <div>
              <Label htmlFor="serviceSelect">Pilih Jenis Pelayanan</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="serviceSearch"
                  placeholder="Cari jenis pelayanan..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="pl-9 mb-2"
                />
                <Select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="max-h-48 overflow-y-auto"
                >
                  <option value="">Pilih Jenis Pelayanan</option>
                  {filteredServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatCurrency(service.price)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Qty / Kilometer */}
            <div>
              <Label htmlFor="qtyKilometer">Qty / Kilometer</Label>
              <Input
                id="qtyKilometer"
                type="number"
                min="1"
                value={qtyKilometer}
                onChange={(e) => setQtyKilometer(parseInt(e.target.value) || 1)}
                className="mt-2"
              />
            </div>

            {/* Calculated Total */}
            {selectedService && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Tarif:</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(
                      (mockServices.find((s) => s.id === selectedService)?.price || 0) *
                        qtyKilometer
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleAddService}
              disabled={!selectedService}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
