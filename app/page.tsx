"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { MasterDataPage } from "@/components/master-data-page"
import { ServiceRecapListView } from "@/components/service-recap-list-view"
import { AddServiceForm } from "@/components/add-service-form"

type ViewType = "dashboard" | "master-data" | "service-list" | "service-add"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar onNavigate={handleNavigate} currentView={currentView} />
      <main className="ml-64">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "master-data" && <MasterDataPage />}
        {currentView === "service-list" && (
          <ServiceRecapListView onAddNew={() => setCurrentView("service-add")} />
        )}
        {currentView === "service-add" && (
          <AddServiceForm onBack={() => setCurrentView("service-list")} />
        )}
      </main>
    </div>
  )
}
