"use client"

import { useState } from "react"
import { runPayrollPreviewAPI, getPayrollSlipAPI } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { usePeriod } from "@/hooks/use-period"
import { DollarSign, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuthStore } from "@/lib/auth-store"

export function PayrollSection() {
  const { toast } = useToast()
  const { period, setPeriod } = usePeriod()
  const [payrollData, setPayrollData] = useState<any>(null)
  const [selectedSlip, setSelectedSlip] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const token = useAuthStore((s) => s.token)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"
  // Si quieres probar con cookies httpOnly en backend (cookie que no lee JS),
  // define NEXT_PUBLIC_USE_COOKIES=true en .env.local y el export usará credentials: 'include'
  const useCookies = (process.env.NEXT_PUBLIC_USE_COOKIES || "").toLowerCase() === "true"

  const handleRunPreview = async () => {
    if (!period) {
      toast({ title: "Error", description: "Selecciona un periodo (YYYY-MM)", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const data = await runPayrollPreviewAPI(period)
      // data expected { slips: [...] } pero ponemos fallback por si viene distinto shape
      setPayrollData(data ?? { slips: [] })
      toast({ title: "Success", description: "Payroll preview generated" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Error ejecutando preview",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewSlip = async (empId: string) => {
    if (!period) {
      toast({ title: "Error", description: "Selecciona un periodo antes de ver el slip", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const slip = await getPayrollSlipAPI(empId, period)
      setSelectedSlip(slip)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "No se pudo obtener el slip",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!period) {
      toast({ title: "Error", description: "Selecciona un periodo antes de exportar", variant: "destructive" })
      return
    }

    setExporting(true)
    try {
      const url = `${apiBase}/payroll/export?period=${encodeURIComponent(period)}`
      const headers: HeadersInit = {}

      // Si el backend usa Authorization Bearer token:
      if (!useCookies && token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const fetchOptions: RequestInit = {
        method: "GET",
        headers,
      }
      if (useCookies) {
        // si tu backend deja el token en cookie httpOnly, debes enviar credentials
        fetchOptions.credentials = "include"
      }

      const res = await fetch(url, fetchOptions)
      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(txt || `Export failed: ${res.status}`)
      }

      const blob = await res.blob()
      const filename = `payroll_${period}.csv`
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast({ title: "Success", description: "CSV descargado" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Error exportando CSV",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  // Helper para soportar distintos nombres de campo que venga del backend
  const getField = (slip: any, keys: string[], fallback = "-") => {
    for (const k of keys) {
      if (slip[k] !== undefined && slip[k] !== null) return slip[k]
    }
    return fallback
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <DollarSign className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-50">Payroll</h1>
      </div>

      <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-200 mb-2">Period (YYYY-MM)</label>
            <Input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="2024-01"
            />
          </div>

          <Button onClick={handleRunPreview} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Cargando..." : "Run Preview"}
          </Button>

          <Button
            onClick={handleExport}
            variant="outline"
            className="border-slate-600 text-slate-300 bg-transparent"
            disabled={exporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? "Exportando..." : "Export CSV"}
          </Button>
        </div>
      </Card>

      {payrollData && (
        <Card className="bg-slate-800 border-slate-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-300">Employee</TableHead>
                  <TableHead className="text-slate-300">Base Salary</TableHead>
                  <TableHead className="text-slate-300">Working Days</TableHead>
                  <TableHead className="text-slate-300">Vacation Days</TableHead>
                  <TableHead className="text-slate-300">Unjustified</TableHead>
                  <TableHead className="text-slate-300">Deductions</TableHead>
                  <TableHead className="text-slate-300">Net</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.slips?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                      No payroll data
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollData.slips?.map((slip: any) => {
                    const empKey = getField(slip, ["id", "employeeId", "employee_uid", "employee_id"], JSON.stringify(slip).slice(0, 8))
                    const employeeName = getField(slip, ["employeeName", "employee_name", "name", "employee_uid", "employeeId"], "Unknown")
                    const baseSalary = getField(slip, ["baseSalary", "base_salary", "gross", "salary"], "-")
                    const workingDays = getField(slip, ["workingDays", "working_days", "days_worked"], "-")
                    const vacationDays = getField(slip, ["vacationDays", "vacation_days", "vacation"], "-")
                    const unjustified = getField(slip, ["unjustifiedDays", "unjustified_days", "unjustified"], "-")
                    const deductions = getField(slip, ["deductions"], "-")
                    const netSalary = getField(slip, ["netSalary", "net", "net_salary"], "-")

                    return (
                      <TableRow key={empKey} className="border-slate-700 hover:bg-slate-700">
                        <TableCell className="text-slate-200">{employeeName}</TableCell>
                        <TableCell className="text-slate-200">{baseSalary}</TableCell>
                        <TableCell className="text-slate-200">{workingDays}</TableCell>
                        <TableCell className="text-slate-200">{vacationDays}</TableCell>
                        <TableCell className="text-slate-200">{unjustified}</TableCell>
                        <TableCell className="text-slate-200">{deductions}</TableCell>
                        <TableCell className="font-semibold text-green-400">{netSalary}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSlip(getField(slip, ["employeeId", "employee_uid", "employee_id", "id"]))}
                            className="border-slate-600 text-slate-300"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={!!selectedSlip} onOpenChange={() => setSelectedSlip(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-50">Payroll Slip</DialogTitle>
          </DialogHeader>
          <div className="bg-slate-700 rounded p-4 max-h-96 overflow-auto">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap">{JSON.stringify(selectedSlip, null, 2)}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
