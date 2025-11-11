"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleSwitcher } from "./role-switcher"

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState("")

  return (
    <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-slate-50"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <RoleSwitcher />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-slate-300 hover:bg-slate-700"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
