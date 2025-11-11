"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { loginAPI } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LogIn } from "lucide-react"
import { DEMO_USERS } from "@/lib/mock-data"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const switchDemoUser = useAuthStore((s) => s.switchDemoUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await loginAPI(email, password)
      setAuth(response.access_token, response.role, response.userId)
      toast({
        title: "Success",
        description: "Login successful",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full bg-slate-800 border-slate-700">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <LogIn className="w-8 h-8 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-slate-50">ARCA HR</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">ARCA LTDA - Human Resources Management System</p>
          </div>
        </Card>

        <div>
          <p className="text-sm text-slate-400 text-center font-semibold mb-3">Demo Users - Click to Login</p>
          <div className="grid gap-3">
            {Object.entries(DEMO_USERS).map(([key, user]) => (
              <button
                key={key}
                onClick={() => {
                  switchDemoUser(key as keyof typeof DEMO_USERS)
                  router.push("/dashboard")
                }}
                className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 transition-colors text-left"
              >
                <div className="font-medium text-slate-50">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {user.role === "HR_ADMIN" ? "Administrador RH" : user.role === "MANAGER" ? "Gerente" : "Empleado"}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
