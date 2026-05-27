"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AuthMode = "login" | "register"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [formData, setFormData] = useState({
    puskesmasId: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (mode === "register") {
      if (!formData.puskesmasId || !formData.name || !formData.email || !formData.password) {
        setError("Semua field harus diisi")
        return
      }
      if (formData.password.length < 6) {
        setError("Password minimal 6 karakter")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Password tidak cocok")
        return
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("Email dan password harus diisi")
        return
      }
    }

    setLoading(true)

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
      const payload = mode === "login"
        ? { email: formData.email, password: formData.password }
        : { puskesmasId: formData.puskesmasId, name: formData.name, email: formData.email, password: formData.password }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan")
        setLoading(false)
        return
      }

      // Success - redirect to dashboard
      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Terjadi kesalahan koneksi")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
              P
            </div>
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Login" : "Daftar Akun"}
          </CardTitle>
          <p className="text-slate-600 text-sm mt-2">
            Sistem Rekapitulasi Pelayanan Puskesmas
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <Label htmlFor="puskesmasId">ID Puskesmas</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="puskesmasId"
                      type="text"
                      placeholder="Contoh: PUSKESMAS-001"
                      value={formData.puskesmasId}
                      onChange={(e) => setFormData({ ...formData, puskesmasId: e.target.value.toUpperCase() })}
                      className="pl-9 uppercase"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Masukkan ID Puskesmas Anda (dapat dilihat dari admin)
                  </p>
                </div>

                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-slate-600">
                {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login")
                  setError("")
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                {mode === "login" ? "Daftar disini" : "Login disini"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
