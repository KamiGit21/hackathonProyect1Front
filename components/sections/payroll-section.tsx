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

export function PayrollSection() {
  const { toast } = useToast()
  const { period, setPeriod } = usePeriod()
  const [payrollData, setPayrollData] = useState<any>(null)
  const [selectedSlip, setSelectedSlip] = useState<any>(null)

  const handleRunPreview = async () => {
    try {
      const data = await runPayrollPreviewAPI(period)
      setPayrollData(data)
      toast({ title: "Success", description: "Payroll preview generated" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleViewSlip = async (empId: string) => {
    try {
      const slip = await getPayrollSlipAPI(empId, period)
      setSelectedSlip(slip)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    try {
      const link = document.createElement("a")
      link.href = `${process.env.NEXT_PUBLIC_API_BASE}/payroll/export?period=${period}`
      link.download = `payroll_${period}.csv`
      link.click()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
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
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="2024-01"
            />
          </div>
          <Button onClick={handleRunPreview} className="bg-blue-600 hover:bg-blue-700">
            Run Preview
          </Button>
          <Button onClick={handleExport} variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
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
                  payrollData.slips?.map((slip: any) => (
                    <TableRow key={slip.id} className="border-slate-700 hover:bg-slate-700">
                      <TableCell className="text-slate-200">{slip.employeeName}</TableCell>
                      <TableCell className="text-slate-200">{slip.baseSalary}</TableCell>
                      <TableCell className="text-slate-200">{slip.workingDays}</TableCell>
                      <TableCell className="text-slate-200">{slip.vacationDays}</TableCell>
                      <TableCell className="text-slate-200">{slip.unjustifiedDays}</TableCell>
                      <TableCell className="text-slate-200">{slip.deductions}</TableCell>
                      <TableCell className="font-semibold text-green-400">{slip.netSalary}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSlip(slip.employeeId)}
                          className="border-slate-600 text-slate-300"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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
