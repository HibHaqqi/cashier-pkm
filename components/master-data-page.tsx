"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Pencil, Trash2, Filter, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatCurrency, ServiceMasterItem } from "@/lib/master-data"

export function MasterDataPage() {
  const [services, setServices] = useState<ServiceMasterItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Semua")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceMasterItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<ServiceMasterItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state for add/edit
  const [formData, setFormData] = useState({
    kategori: "",
    jenis_pelayanan: "",
    tarif: "",
    satuan: ""
  })

  // Fetch master pelayanan data
  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/master-pelayanan")
      if (!response.ok) throw new Error("Failed to fetch data")

      const result = await response.json()
      setServices(result.data || [])

      // Extract unique categories
      const cats = Array.from(new Set((result.data || []).map((s: ServiceMasterItem) => s.kategori))) as string[]
      setCategories(cats)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load master pelayanan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.jenis_pelayanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "Semua" || service.kategori === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Reset form
  const resetForm = () => {
    setFormData({
      kategori: "",
      jenis_pelayanan: "",
      tarif: "",
      satuan: ""
    })
  }

  // Open add modal
  const openAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  // Open edit modal
  const openEditModal = (service: ServiceMasterItem) => {
    setEditingService(service)
    setFormData({
      kategori: service.kategori,
      jenis_pelayanan: service.jenis_pelayanan,
      tarif: service.tarif.toString(),
      satuan: service.satuan || ""
    })
    setIsEditModalOpen(true)
  }

  // Handle add service
  const handleAddService = async () => {
    setSaving(true)
    setError(null)

    try {
      const payload = {
        kategori: formData.kategori,
        jenisPelayanan: formData.jenis_pelayanan,
        tarif: parseFloat(formData.tarif) || 0,
        satuan: formData.satuan || null
      }

      const response = await fetch("/api/master-pelayanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add service")
      }

      await fetchData()
      setIsAddModalOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error adding service:", err)
      setError(err instanceof Error ? err.message : "Failed to add service")
    } finally {
      setSaving(false)
    }
  }

  // Handle edit service
  const handleEditService = async () => {
    if (!editingService) return

    setSaving(true)
    setError(null)

    try {
      const payload = {
        id: editingService.id,
        kategori: formData.kategori,
        jenisPelayanan: formData.jenis_pelayanan,
        tarif: parseFloat(formData.tarif) || 0,
        satuan: formData.satuan || null
      }

      const response = await fetch("/api/master-pelayanan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update service")
      }

      await fetchData()
      setIsEditModalOpen(false)
      setEditingService(null)
      resetForm()
    } catch (err) {
      console.error("Error updating service:", err)
      setError(err instanceof Error ? err.message : "Failed to update service")
    } finally {
      setSaving(false)
    }
  }

  // Handle delete service
  const handleDeleteService = async () => {
    if (!deleteConfirm) return

    try {
      const response = await fetch(`/api/master-pelayanan?id=${deleteConfirm.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete service")
      }

      await fetchData()
      setDeleteConfirm(null)
    } catch (err) {
      console.error("Error deleting service:", err)
      alert("Failed to delete service")
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Master Data Pelayanan</h1>
        <p className="text-slate-600">Kelola data jenis pelayanan dan tarif sesuai PERDA</p>
      </div>

      {/* Actions & Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nama pelayanan atau kode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-48"
            >
              <option value="Semua">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>

          {/* Add Button */}
          <Button onClick={() => fetchData()} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pelayanan
          </Button>
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
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">ID</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Jenis Pelayanan</TableHead>
                <TableHead className="w-32">Tarif</TableHead>
                <TableHead className="w-24">Satuan</TableHead>
                <TableHead className="w-32 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-mono text-xs">
                      {service.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {service.kategori}
                      </span>
                    </TableCell>
                    <TableCell>{service.jenis_pelayanan}</TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {formatCurrency(service.tarif)}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {service.satuan || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(service)}
                          className="p-2 hover:bg-red-50 rounded text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>Menampilkan {filteredServices.length} dari {services.length} data</span>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Pelayanan Baru</DialogTitle>
            <DialogClose onClick={() => setIsAddModalOpen(false)} />
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="kategori">Kategori</Label>
              <Select
                id="kategori"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="mt-2"
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Custom">Custom Baru</option>
              </Select>
            </div>

            {formData.kategori === "Custom" && (
              <div>
                <Label htmlFor="customKategori">Nama Kategori Baru</Label>
                <Input
                  id="customKategori"
                  value={formData.kategori === "Custom" ? "" : formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="mt-2"
                  placeholder="Masukkan nama kategori"
                />
              </div>
            )}

            <div>
              <Label htmlFor="jenis_pelayanan">Jenis Pelayanan</Label>
              <Input
                id="jenis_pelayanan"
                value={formData.jenis_pelayanan}
                onChange={(e) => setFormData({ ...formData, jenis_pelayanan: e.target.value })}
                className="mt-2"
                placeholder="Masukkan nama pelayanan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tarif">Tarif (Rp)</Label>
                <Input
                  id="tarif"
                  type="number"
                  value={formData.tarif}
                  onChange={(e) => setFormData({ ...formData, tarif: e.target.value })}
                  className="mt-2"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="satuan">Satuan</Label>
                <Input
                  id="satuan"
                  value={formData.satuan}
                  onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                  className="mt-2"
                  placeholder="Opsional"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleAddService}
              disabled={saving || !formData.kategori || !formData.jenis_pelayanan || !formData.tarif}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {saving ? "Menyimpan..." : "Tambah"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pelayanan</DialogTitle>
            <DialogClose onClick={() => setIsEditModalOpen(false)} />
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="editKategori">Kategori</Label>
              <Select
                id="editKategori"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="mt-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Custom">Custom Baru</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="editJenis">Jenis Pelayanan</Label>
              <Input
                id="editJenis"
                value={formData.jenis_pelayanan}
                onChange={(e) => setFormData({ ...formData, jenis_pelayanan: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editTarif">Tarif (Rp)</Label>
                <Input
                  id="editTarif"
                  type="number"
                  value={formData.tarif}
                  onChange={(e) => setFormData({ ...formData, tarif: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="editSatuan">Satuan</Label>
                <Input
                  id="editSatuan"
                  value={formData.satuan}
                  onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditService} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Pencil className="h-4 w-4 mr-2" />}
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogClose onClick={() => setDeleteConfirm(null)} />
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-700">
              Apakah Anda yakin ingin menghapus pelayanan ini?
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">{deleteConfirm?.jenis_pelayanan}</p>
              <p className="text-sm text-slate-600">{formatCurrency(deleteConfirm?.tarif || 0)}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
