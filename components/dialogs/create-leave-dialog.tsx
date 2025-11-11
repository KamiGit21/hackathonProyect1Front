"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function CreateLeaveDialog({ open, onOpenChange, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    type: "",
    start: "",
    end: "",
    motive: "",
  })

  const handleSubmit = () => {
    if (!formData.type || !formData.start || !formData.end) {
      return
    }
    onSubmit({
      type: formData.type,
      startDate: formData.start,
      endDate: formData.end,
      motive: formData.motive,
    })
    setFormData({ type: "", start: "", end: "", motive: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Request Leave</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-200">Leave Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="VACATION" className="text-slate-200">
                  Vacation
                </SelectItem>
                <SelectItem value="SICK" className="text-slate-200">
                  Sick Leave
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-200">Start Date</Label>
              <Input
                type="date"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-50"
              />
            </div>
            <div>
              <Label className="text-slate-200">End Date</Label>
              <Input
                type="date"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-50"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-200">Reason (Optional)</Label>
            <Textarea
              value={formData.motive}
              onChange={(e) => setFormData({ ...formData, motive: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="Describe your reason for leave..."
            />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
