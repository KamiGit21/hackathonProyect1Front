"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { punchAPI } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { usePeriod } from "@/hooks/use-period"
import { useAuthStore } from "@/lib/auth-store"
import { Clock, LogIn, LogOut } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TimeSection() {
  const { toast } = useToast()
  const userId = useAuthStore((s) => s.userId)
  const { period, dateRange } = usePeriod()
  const [lastPunch, setLastPunch] = useState<any>(null)

  const { data: timesheet, mutate } = useSWR(
    userId
      ? `${process.env.NEXT_PUBLIC_API_BASE}/timesheet?empId=${userId}&from=${dateRange.from}&to=${dateRange.to}`
      : null,
    fetcher,
  )

  const handlePunch = async (type: "IN" | "OUT") => {
    try {
      const response = await punchAPI({
        employeeId: userId,
        type,
        ts: new Date().toISOString(),
      })
      setLastPunch(response)
      await mutate()
      toast({
        title: "Success",
        description: `Punch ${type} registered`,
      })
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
        <Clock className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-50">Time Tracking</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-4">Mark Attendance</div>
          <div className="flex gap-3">
            <Button onClick={() => handlePunch("IN")} className="flex-1 bg-green-600 hover:bg-green-700">
              <LogIn className="w-4 h-4 mr-2" />
              IN
            </Button>
            <Button onClick={() => handlePunch("OUT")} className="flex-1 bg-red-600 hover:bg-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              OUT
            </Button>
          </div>
          {lastPunch && (
            <div className="mt-4 p-3 bg-slate-700 rounded text-sm text-slate-200">
              <div className="text-xs text-slate-400 mb-1">Last: {lastPunch.type}</div>
              <div>{new Date(lastPunch.timestamp).toLocaleString()}</div>
            </div>
          )}
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-50">Timesheet</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!timesheet?.entries || timesheet.entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-400 py-8">
                    No timesheet entries
                  </TableCell>
                </TableRow>
              ) : (
                timesheet.entries.map((entry: any, idx: number) => (
                  <TableRow key={idx} className="border-slate-700 hover:bg-slate-700">
                    <TableCell className="text-slate-200">{new Date(entry.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell className="text-slate-200">{entry.type}</TableCell>
                    <TableCell className="text-slate-200">{new Date(entry.timestamp).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
