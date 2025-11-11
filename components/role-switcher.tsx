"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth-store"
import { DEMO_USERS } from "@/lib/mock-data"
import { ChevronDown, LogOut } from "lucide-react"

export function RoleSwitcher() {
  const role = useAuthStore((s) => s.role)
  const userName = useAuthStore((s) => s.userName)
  const switchDemoUser = useAuthStore((s) => s.switchDemoUser)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const getRoleLabel = () => {
    switch (role) {
      case "HR_ADMIN":
        return "Administrador RH"
      case "MANAGER":
        return "Gerente"
      case "EMPLOYEE":
        return "Empleado"
      default:
        return "Usuario"
    }
  }

  const getRoleColor = () => {
    switch (role) {
      case "HR_ADMIN":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      case "MANAGER":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "EMPLOYEE":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/10 text-slate-400"
    }
  }

  return (
    <DropdownMenu>
      <button
        className={`px-3 py-2 rounded-md text-sm font-medium border flex items-center gap-2 hover:opacity-80 transition-opacity ${getRoleColor()}`}
      >
        <span>{userName || getRoleLabel()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-slate-50">Cambiar Usuario Demo</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        {Object.entries(DEMO_USERS).map(([key, user]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => switchDemoUser(key as keyof typeof DEMO_USERS)}
            className={`cursor-pointer text-slate-50 hover:bg-slate-700 focus:bg-slate-700 ${
              role === user.role ? "bg-slate-700" : ""
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-slate-400">{user.email}</div>
              <div className="text-xs text-slate-500">{getRoleLabel()}</div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem
          onClick={() => clearAuth()}
          className="cursor-pointer text-slate-50 hover:bg-slate-700 focus:bg-slate-700 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
