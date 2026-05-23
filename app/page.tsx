"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { ServiceRecapListView } from "@/components/service-recap-list-view"
import { AddServiceForm } from "@/components/add-service-form"

type ViewType = "dashboard" | "service-list" | "service-add"

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
