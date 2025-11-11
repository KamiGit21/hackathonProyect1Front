"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { createUnitAPI, assignManagerAPI } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Building2, Plus } from "lucide-react"
import { CreateUnitDialog } from "@/components/dialogs/create-unit-dialog"
import { AssignManagerDialog } from "@/components/dialogs/assign-manager-dialog"

export function OrgSection() {
  const { toast } = useToast()
  const [showCreateUnitDialog, setShowCreateUnitDialog] = useState(false)
  const [showAssignManagerDialog, setShowAssignManagerDialog] = useState(false)

  const { data: units, mutate: mutateUnits } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE}/org/units`, fetcher)

  const handleCreateUnit = async (data: any) => {
    try {
      await createUnitAPI(data)
      await mutateUnits()
      toast({ title: "Success", description: "Unit created" })
      setShowCreateUnitDialog(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleAssignManager = async (data: any) => {
    try {
      await assignManagerAPI(data)
      await mutateUnits()
      toast({ title: "Success", description: "Manager assigned" })
      setShowAssignManagerDialog(false)
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
        <Building2 className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-50">Organization</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">Create Unit</h2>
          <p className="text-slate-400 text-sm mb-4">Create a new organizational unit or department</p>
          <Button onClick={() => setShowCreateUnitDialog(true)} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Unit
          </Button>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">Assign Manager</h2>
          <p className="text-slate-400 text-sm mb-4">Assign a manager to a unit</p>
          <Button onClick={() => setShowAssignManagerDialog(true)} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Assign Manager
          </Button>
        </Card>
      </div>

      {units && (
        <Card className="bg-slate-800 border-slate-700 p-6 mt-8">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">Units</h2>
          <div className="space-y-2">
            {units.length === 0 ? (
              <p className="text-slate-400">No units created yet</p>
            ) : (
              units.map((unit: any) => (
                <div key={unit.id} className="bg-slate-700 rounded p-3 flex justify-between items-center">
                  <div>
                    <p className="text-slate-50 font-medium">{unit.name}</p>
                    {unit.parentId && <p className="text-xs text-slate-400">Sub-unit of: {unit.parentId}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      <CreateUnitDialog
        open={showCreateUnitDialog}
        onOpenChange={setShowCreateUnitDialog}
        units={units}
        onSubmit={handleCreateUnit}
      />

      <AssignManagerDialog
        open={showAssignManagerDialog}
        onOpenChange={setShowAssignManagerDialog}
        units={units}
        onSubmit={handleAssignManager}
      />
    </div>
  )
}
