"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { usePeriod } from "@/hooks/use-period"
import { BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ReportsSection() {
  const { period, setPeriod } = usePeriod()
  const { data: kpis } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE}/reports/kpis?period=${period}`, fetcher)

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-50">Reports</h1>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-200 mb-2">Period (YYYY-MM)</label>
        <Input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-64 bg-slate-700 border-slate-600 text-slate-50"
          placeholder="2024-01"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-2">Absenteeism Rate</div>
          <div className="text-4xl font-bold text-slate-50">{kpis?.absenteeismPct || 0}%</div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-2">Estimated Payroll</div>
          <div className="text-3xl font-bold text-green-400">${kpis?.estimatedPayroll || 0}</div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-2">Total Units</div>
          <div className="text-3xl font-bold text-slate-50">{kpis?.headcountByUnit?.length || 0}</div>
        </Card>
      </div>

      {kpis?.headcountByUnit && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">Headcount by Unit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kpis.headcountByUnit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="unit" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
