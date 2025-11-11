import { useAuthStore } from "./auth-store"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"

async function apiCall(endpoint: string, method = "GET", body?: any): Promise<any> {
  const token = useAuthStore.getState().token
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    useAuthStore.getState().clearAuth()
    window.location.href = "/login"
    return
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return response.json()
}

// AUTH
export const loginAPI = (email: string, password: string) => apiCall("/auth/login", "POST", { email, password })

export const getMeAPI = () => apiCall("/me")

// EMPLOYEES
export const getEmployeesAPI = () => apiCall("/employees")
export const createEmployeeAPI = (data: any) => apiCall("/employees", "POST", data)
export const assignContractAPI = (employeeId: string, data: any) =>
  apiCall(`/employees/${employeeId}/contract`, "POST", data)
export const getPositionsAPI = () => apiCall("/positions")

// ORG
export const getUnitsAPI = () => apiCall("/org/units")
export const createUnitAPI = (data: any) => apiCall("/org/units", "POST", data)
export const assignManagerAPI = (data: any) => apiCall("/org/assign-manager", "POST", data)

// TIME
export const punchAPI = (data: any) => apiCall("/punch", "POST", data)
export const getTimesheetAPI = (empId: string, from: string, to: string) =>
  apiCall(`/timesheet?empId=${empId}&from=${from}&to=${to}`)

// LEAVE
export const createLeaveRequestAPI = (data: any) => apiCall("/leave/requests", "POST", data)
export const approveLeaveRequestAPI = (requestId: string) => apiCall(`/leave/requests/${requestId}/approve`, "POST")
export const getLeaveBalanceAPI = (empId: string) => apiCall(`/leave/balance?empId=${empId}`)

// PAYROLL
export const runPayrollPreviewAPI = (period: string) => apiCall(`/payroll/run-preview?period=${period}`, "POST")
export const getPayrollSlipAPI = (empId: string, period: string) => apiCall(`/payroll/slip/${empId}?period=${period}`)
export const exportPayrollAPI = (period: string) => apiCall(`/payroll/export?period=${period}`)

// REPORTS
export const getReportKPIsAPI = (period: string) => apiCall(`/reports/kpis?period=${period}`)
