"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { EmployeesSection } from "@/components/sections/employees-section"
import { TimeSection } from "@/components/sections/time-section"
import { LeaveSection } from "@/components/sections/leave-section"
import { PayrollSection } from "@/components/sections/payroll-section"
import { ReportsSection } from "@/components/sections/reports-section"
import { OrgSection } from "@/components/sections/org-section"
import { SettingsSection } from "@/components/sections/settings-section"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function DashboardContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "dashboard"
  const token = useAuthStore((s) => s.token)
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router])

  if (!token) {
    return null
  }

  const renderSection = () => {
    switch (tab) {
      case "employees":
        return <EmployeesSection />
      case "time":
        return <TimeSection />
      case "leave":
        return <LeaveSection />
      case "payroll":
        return <PayrollSection />
      case "reports":
        return <ReportsSection />
      case "org":
        return <OrgSection />
      case "settings":
        return <SettingsSection />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto bg-slate-900">
          <Suspense fallback={<div className="p-8">Cargando...</div>}>{renderSection()}</Suspense>
        </main>
      </div>
    </div>
  )
}

function DashboardOverview() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-50 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm mb-2">Total Employees</div>
          <div className="text-3xl font-bold text-slate-50">-</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm mb-2">Pending Requests</div>
          <div className="text-3xl font-bold text-slate-50">-</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm mb-2">Current Period Payroll</div>
          <div className="text-3xl font-bold text-slate-50">-</div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
