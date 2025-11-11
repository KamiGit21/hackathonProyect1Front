"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, LogOut } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

export function SettingsSection() {
  const router = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const role = useAuthStore((s) => s.role)

  const { data: user } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE}/me`, fetcher)

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Settings className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">User Profile</h2>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-sm">Name</p>
              <p className="text-slate-50 font-medium">{user?.name || "-"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-slate-50 font-medium">{user?.email || "-"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Role</p>
              <p className="text-slate-50 font-medium">
                {role === "HR_ADMIN" ? "HR Administrator" : role === "MANAGER" ? "Manager" : "Employee"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">System Info</h2>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-sm">API Base URL</p>
              <p className="text-slate-50 font-mono text-sm break-all">
                {process.env.NEXT_PUBLIC_API_BASE || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Application</p>
              <p className="text-slate-50 font-medium">ARCA HR Management System</p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">Session</h2>
          <p className="text-slate-400 text-sm mb-4">Click below to sign out from your account</p>
          <Button onClick={handleLogout} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </Card>
      </div>
    </div>
  )
}
