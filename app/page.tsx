"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ServiceRecapListView } from "@/components/service-recap-list-view"
import { AddServiceForm } from "@/components/add-service-form"

export default function Home() {
  const [currentView, setCurrentView] = useState<"list" | "add">("list")

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64">
        {currentView === "list" ? (
          <ServiceRecapListView onAddNew={() => setCurrentView("add")} />
        ) : (
          <AddServiceForm onBack={() => setCurrentView("list")} />
        )}
      </main>
    </div>
  )
}
