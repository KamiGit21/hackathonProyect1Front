"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { createEmployeeAPI, assignContractAPI } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, Plus } from "lucide-react"
import { CreateEmployeeDialog } from "@/components/dialogs/create-employee-dialog"
import { AssignContractDialog } from "@/components/dialogs/assign-contract-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function EmployeesSection() {
  const { toast } = useToast()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showContractDialog, setShowContractDialog] = useState(false)

  const { data: employees, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE}/employees`, fetcher)

  const handleCreateEmployee = async (data: any) => {
    try {
      await createEmployeeAPI(data)
      await mutate()
      toast({ title: "Success", description: "Employee created" })
      setShowCreateDialog(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleAssignContract = async (contractData: any) => {
    try {
      await assignContractAPI(selectedEmployee.id, contractData)
      await mutate()
      toast({ title: "Success", description: "Contract assigned" })
      setShowContractDialog(false)
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-50">Employees</h1>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Employee
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-300">DocID</TableHead>
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Phone</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : employees?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees?.map((emp: any) => (
                  <TableRow key={emp.id} className="border-slate-700 hover:bg-slate-700">
                    <TableCell className="text-slate-200">{emp.docId}</TableCell>
                    <TableCell className="text-slate-200">{emp.name}</TableCell>
                    <TableCell className="text-slate-200">{emp.email}</TableCell>
                    <TableCell className="text-slate-200">{emp.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.status === "ACTIVE" ? "default" : "secondary"}
                        className={emp.status === "ACTIVE" ? "bg-green-600" : "bg-slate-600"}
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(emp)
                          setShowContractDialog(true)
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Assign Contract
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CreateEmployeeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateEmployee}
      />

      <AssignContractDialog
        open={showContractDialog}
        onOpenChange={setShowContractDialog}
        employee={selectedEmployee}
        onSubmit={handleAssignContract}
      />
    </div>
  )
}
