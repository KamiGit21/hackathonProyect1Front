"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  units: any[]
  onSubmit: (data: any) => void
}

export function AssignManagerDialog({ open, onOpenChange, units, onSubmit }: Props) {
  const { data: employees } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE}/employees`, fetcher)

  const [formData, setFormData] = useState({
    unitId: "",
    managerEmployeeId: "",
  })

  const handleSubmit = () => {
    if (!formData.unitId || !formData.managerEmployeeId) return
    onSubmit(formData)
    setFormData({ unitId: "", managerEmployeeId: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Assign Manager</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-200">Unit</Label>
            <Select value={formData.unitId} onValueChange={(value) => setFormData({ ...formData, unitId: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {units?.map((unit: any) => (
                  <SelectItem key={unit.id} value={unit.id} className="text-slate-200">
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-200">Manager Employee</Label>
            <Select
              value={formData.managerEmployeeId}
              onValueChange={(value) => setFormData({ ...formData, managerEmployeeId: value })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {employees?.map((emp: any) => (
                  <SelectItem key={emp.id} value={emp.id} className="text-slate-200">
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Assign Manager
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
