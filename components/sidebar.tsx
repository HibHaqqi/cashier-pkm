"use client"

import { useState } from "react"
import { ChevronDown, LayoutDashboard, Database, Wallet, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  label: string
  icon: React.ElementType
  href?: string
  subItems?: { label: string; href: string; active: boolean }[]
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Master Data",
    icon: Database,
    href: "/master-data",
  },
  {
    label: "Keuangan",
    icon: Wallet,
    subItems: [
      { label: "Rekapitulasi Pelayanan", href: "/rekapitulasi-pelayanan", active: true },
      { label: "Ringkasan", href: "/ringkasan", active: false },
    ],
  },
]

export function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>("Keuangan")

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold">
            P
          </div>
          <span className="font-semibold text-slate-800">Puskesmas</span>
        </div>
        <User className="h-5 w-5 text-slate-600" />
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isOpen = openDropdown === item.label

            return (
              <li key={item.label}>
                {hasSubItems ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.subItems?.map((subItem) => (
                          <li key={subItem.label}>
                            <a
                              href={subItem.href}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                subItem.active
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-slate-600 hover:bg-slate-50"
                              )}
                            >
                              {subItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                )}
              </li>
            )}
          )}
        </ul>
      </nav>
    </aside>
  )
}
