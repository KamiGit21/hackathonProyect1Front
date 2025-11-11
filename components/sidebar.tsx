"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Clock, Calendar, DollarSign, BarChart3, Building2, Settings, LogOut } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home, roles: ["HR_ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/dashboard?tab=employees", label: "Employees", icon: Users, roles: ["HR_ADMIN", "MANAGER"] },
  { href: "/dashboard?tab=time", label: "Time", icon: Clock, roles: ["HR_ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/dashboard?tab=leave", label: "Leave", icon: Calendar, roles: ["HR_ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/dashboard?tab=payroll", label: "Payroll", icon: DollarSign, roles: ["HR_ADMIN", "MANAGER"] },
  { href: "/dashboard?tab=reports", label: "Reports", icon: BarChart3, roles: ["HR_ADMIN"] },
  { href: "/dashboard?tab=org", label: "Organization", icon: Building2, roles: ["HR_ADMIN"] },
  { href: "/dashboard?tab=settings", label: "Settings", icon: Settings, roles: ["HR_ADMIN", "MANAGER", "EMPLOYEE"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const role = useAuthStore((s) => s.role)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const filteredItems = MENU_ITEMS.filter((item) => item.roles.includes(role || ""))

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 h-screen flex flex-col p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-50">ARCA HR</h2>
        <p className="text-xs text-slate-400 mt-1">Human Resources</p>
      </div>

      <nav className="flex-1 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.includes(item.href.split("?")[0])
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <Button onClick={handleLogout} variant="ghost" className="w-full text-slate-300 hover:bg-slate-700">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  )
}
