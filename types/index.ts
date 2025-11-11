// Core domain types
export interface User {
  id: string
  name: string
  email: string
  role: "HR_ADMIN" | "MANAGER" | "EMPLOYEE"
}

export interface AuthResponse {
  access_token: string
  role: "HR_ADMIN" | "MANAGER" | "EMPLOYEE"
  userId: string
}

export interface Employee {
  id: string
  docId: string
  name: string
  email: string
  phone: string
  status: "ACTIVE" | "INACTIVE"
}

export interface Contract {
  id: string
  employeeId: string
  positionId: string
  baseSalary: number
  currency: string
  startDate: string
  endDate?: string
}

export interface Position {
  id: string
  name: string
  description?: string
}

export interface Unit {
  id: string
  name: string
  parentId?: string
}

export interface Punch {
  id: string
  employeeId: string
  type: "IN" | "OUT"
  timestamp: string
}

export interface TimesheetEntry {
  date: string
  entries: Punch[]
  totalHours?: number
}

export interface LeaveRequest {
  id: string
  employeeId: string
  type: "VACATION" | "SICK"
  startDate: string
  endDate: string
  motive?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

export interface LeaveBalance {
  employeeId: string
  vacationDays: number
  sickDays: number
  usedVacation: number
  usedSick: number
}

export interface PayrollSlip {
  id: string
  employeeId: string
  period: string
  baseSalary: number
  workingDays: number
  vacationDays: number
  sickDays: number
  unjustifiedDays: number
  deductions: number
  netSalary: number
}

export interface KPIs {
  headcountByUnit: Array<{ unit: string; count: number }>
  absenteeismPct: number
  estimatedPayroll: number
}
