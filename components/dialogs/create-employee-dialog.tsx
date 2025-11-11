"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function CreateEmployeeDialog({ open, onOpenChange, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    docId: "",
    name: "",
    email: "",
    phone: "",
  })

  const handleSubmit = () => {
    if (!formData.docId || !formData.name || !formData.email || !formData.phone) {
      return
    }
    onSubmit(formData)
    setFormData({ docId: "", name: "", email: "", phone: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Create New Employee</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-slate-200">Document ID</Label>
            <Input
              value={formData.docId}
              onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="123456789"
            />
          </div>

          <div>
            <Label className="text-slate-200">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label className="text-slate-200">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label className="text-slate-200">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="+1 234 567 8900"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Create Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
