"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  units: any[]
  onSubmit: (data: any) => void
}

export function CreateUnitDialog({ open, onOpenChange, units, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    parentId: "",
  })

  const handleSubmit = () => {
    if (!formData.name) return
    onSubmit({
      name: formData.name,
      parentId: formData.parentId || undefined,
    })
    setFormData({ name: "", parentId: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Create New Unit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-200">Unit Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="e.g., Operations, IT, Sales"
            />
          </div>

          <div>
            <Label className="text-slate-200">Parent Unit (Optional)</Label>
            <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue placeholder="Select parent unit" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="" className="text-slate-200">
                  None
                </SelectItem>
                {units?.map((unit: any) => (
                  <SelectItem key={unit.id} value={unit.id} className="text-slate-200">
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Create Unit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
