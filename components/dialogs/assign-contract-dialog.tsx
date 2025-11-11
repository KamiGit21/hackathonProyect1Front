"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: any
  onSubmit: (data: any) => void
}

export function AssignContractDialog({ open, onOpenChange, employee, onSubmit }: Props) {
  const { data: positions } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE}/positions`, fetcher)

  const [formData, setFormData] = useState({
    positionId: "",
    baseSalary: "",
    currency: "BOB",
    startDate: "",
    endDate: "",
  })

  const handleSubmit = () => {
    if (!formData.positionId || !formData.baseSalary || !formData.startDate) {
      return
    }
    onSubmit(formData)
    setFormData({
      positionId: "",
      baseSalary: "",
      currency: "BOB",
      startDate: "",
      endDate: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Assign Contract - {employee?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-200">Position</Label>
            <Select
              value={formData.positionId}
              onValueChange={(value) => setFormData({ ...formData, positionId: value })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {positions?.map((pos: any) => (
                  <SelectItem key={pos.id} value={pos.id} className="text-slate-200">
                    {pos.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-200">Base Salary</Label>
              <Input
                type="number"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-50"
                placeholder="0.00"
              />
            </div>
            <div>
              <Label className="text-slate-200">Currency</Label>
              <Select value={formData.currency} disabled>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                  <SelectValue />
                </SelectTrigger>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-200">Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-50"
              />
            </div>
            <div>
              <Label className="text-slate-200">End Date (Optional)</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-50"
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Assign Contract
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
