"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { createLeaveRequestAPI, approveLeaveRequestAPI } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { Calendar, Plus, Check } from "lucide-react"
import { CreateLeaveDialog } from "@/components/dialogs/create-leave-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LeaveSection() {
  const { toast } = useToast()
  const userId = useAuthStore((s) => s.userId)
  const role = useAuthStore((s) => s.role)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { data: balance } = useSWR(
    userId ? `${process.env.NEXT_PUBLIC_API_BASE}/leave/balance?empId=${userId}` : null,
    fetcher,
  )

  const { data: pendingRequests, mutate: mutatePendingRequests } = useSWR(
    role === "MANAGER" || role === "HR_ADMIN"
      ? `${process.env.NEXT_PUBLIC_API_BASE}/leave/requests?status=PENDING`
      : null,
    fetcher,
  )

  const handleCreateLeave = async (data: any) => {
    try {
      await createLeaveRequestAPI({
        employeeId: userId,
        ...data,
      })
      toast({ title: "Success", description: "Leave request created" })
      setShowCreateDialog(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleApproveLeave = async (requestId: string) => {
    try {
      await approveLeaveRequestAPI(requestId)
      await mutatePendingRequests()
      toast({ title: "Success", description: "Leave request approved" })
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
          <Calendar className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-50">Leave Management</h1>
        </div>
        {role === "EMPLOYEE" && (
          <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Request Leave
          </Button>
        )}
      </div>

      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-slate-400 text-sm mb-2">Vacation Days</div>
            <div className="text-2xl font-bold text-slate-50">{balance.vacationDays}</div>
            <div className="text-xs text-slate-500 mt-2">Used: {balance.usedVacation}</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="text-slate-400 text-sm mb-2">Sick Days</div>
            <div className="text-2xl font-bold text-slate-50">{balance.sickDays}</div>
            <div className="text-xs text-slate-500 mt-2">Used: {balance.usedSick}</div>
          </Card>
        </div>
      )}

      {(role === "MANAGER" || role === "HR_ADMIN") && pendingRequests && (
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-50">Pending Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-300">Employee</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Period</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                      No pending requests
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((req: any) => (
                    <TableRow key={req.id} className="border-slate-700 hover:bg-slate-700">
                      <TableCell className="text-slate-200">{req.employeeName}</TableCell>
                      <TableCell className="text-slate-200">{req.type}</TableCell>
                      <TableCell className="text-slate-200">
                        {req.startDate} to {req.endDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                          PENDING
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleApproveLeave(req.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
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

      <CreateLeaveDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSubmit={handleCreateLeave} />
    </div>
  )
}
