import type { Employee, LeaveRequest, PayrollSlip, Punch, Unit } from "@/types"

// Demo users for testing different roles
export const DEMO_USERS = {
  hr_admin: {
    id: "user-1",
    name: "Ana García",
    email: "ana.garcia@arca.com",
    role: "HR_ADMIN" as const,
  },
  manager: {
    id: "user-2",
    name: "Carlos López",
    email: "carlos.lopez@arca.com",
    role: "MANAGER" as const,
  },
  employee: {
    id: "user-3",
    name: "María Rodríguez",
    email: "maria.rodriguez@arca.com",
    role: "EMPLOYEE" as const,
  },
}

// Mock employees
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    docId: "1234567890",
    name: "Juan Pérez",
    email: "juan.perez@arca.com",
    phone: "+34 600 123 456",
    status: "ACTIVE",
  },
  {
    id: "emp-2",
    docId: "0987654321",
    name: "María Rodríguez",
    email: "maria.rodriguez@arca.com",
    phone: "+34 600 234 567",
    status: "ACTIVE",
  },
  {
    id: "emp-3",
    docId: "1122334455",
    name: "Carlos López",
    email: "carlos.lopez@arca.com",
    phone: "+34 600 345 678",
    status: "ACTIVE",
  },
  {
    id: "emp-4",
    docId: "5544332211",
    name: "Ana García",
    email: "ana.garcia@arca.com",
    phone: "+34 600 456 789",
    status: "ACTIVE",
  },
  {
    id: "emp-5",
    docId: "6677889900",
    name: "Pedro Martínez",
    email: "pedro.martinez@arca.com",
    phone: "+34 600 567 890",
    status: "ACTIVE",
  },
  {
    id: "emp-6",
    docId: "1133557799",
    name: "Laura Fernández",
    email: "laura.fernandez@arca.com",
    phone: "+34 600 678 901",
    status: "ACTIVE",
  },
]

// Mock organizational units
export const MOCK_UNITS: Unit[] = [
  { id: "unit-1", name: "Gerencia General" },
  { id: "unit-2", name: "Recursos Humanos", parentId: "unit-1" },
  { id: "unit-3", name: "Operaciones", parentId: "unit-1" },
  { id: "unit-4", name: "Finanzas", parentId: "unit-1" },
  { id: "unit-5", name: "Tecnología", parentId: "unit-1" },
]

// Mock leave requests with various statuses
export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeId: "emp-1",
    type: "VACATION",
    startDate: "2025-12-15",
    endDate: "2025-12-22",
    motive: "Vacaciones de fin de año",
    status: "PENDING",
    createdAt: "2025-11-10T10:30:00Z",
  },
  {
    id: "leave-2",
    employeeId: "emp-2",
    type: "SICK",
    startDate: "2025-11-12",
    endDate: "2025-11-13",
    motive: "Gripe",
    status: "APPROVED",
    createdAt: "2025-11-10T09:15:00Z",
  },
  {
    id: "leave-3",
    employeeId: "emp-3",
    type: "VACATION",
    startDate: "2025-11-24",
    endDate: "2025-11-28",
    motive: "Viaje familiar",
    status: "REJECTED",
    createdAt: "2025-11-08T14:45:00Z",
  },
  {
    id: "leave-4",
    employeeId: "emp-4",
    type: "VACATION",
    startDate: "2025-12-01",
    endDate: "2025-12-05",
    motive: "Eventos corporativos",
    status: "PENDING",
    createdAt: "2025-11-10T11:20:00Z",
  },
  {
    id: "leave-5",
    employeeId: "emp-5",
    type: "SICK",
    startDate: "2025-11-11",
    endDate: "2025-11-11",
    motive: "Cita médica",
    status: "APPROVED",
    createdAt: "2025-11-10T08:00:00Z",
  },
]

// Mock punch records for timesheet
export const MOCK_PUNCHES: Punch[] = [
  {
    id: "punch-1",
    employeeId: "emp-1",
    type: "IN",
    timestamp: new Date().toISOString().split("T")[0] + "T08:00:00Z",
  },
  {
    id: "punch-2",
    employeeId: "emp-1",
    type: "OUT",
    timestamp: new Date().toISOString().split("T")[0] + "T17:30:00Z",
  },
  {
    id: "punch-3",
    employeeId: "emp-2",
    type: "IN",
    timestamp: new Date().toISOString().split("T")[0] + "T07:45:00Z",
  },
  {
    id: "punch-4",
    employeeId: "emp-2",
    type: "OUT",
    timestamp: new Date().toISOString().split("T")[0] + "T17:15:00Z",
  },
]

// Mock payroll slips
export const MOCK_PAYROLL: PayrollSlip[] = [
  {
    id: "payroll-1",
    employeeId: "emp-1",
    period: "2025-11",
    baseSalary: 2500,
    workingDays: 22,
    vacationDays: 0,
    sickDays: 1,
    unjustifiedDays: 0,
    deductions: 250,
    netSalary: 2250,
  },
  {
    id: "payroll-2",
    employeeId: "emp-2",
    period: "2025-11",
    baseSalary: 2800,
    workingDays: 22,
    vacationDays: 0,
    sickDays: 0,
    unjustifiedDays: 0,
    deductions: 280,
    netSalary: 2520,
  },
  {
    id: "payroll-3",
    employeeId: "emp-3",
    period: "2025-11",
    baseSalary: 3200,
    workingDays: 22,
    vacationDays: 0,
    sickDays: 0,
    unjustifiedDays: 0,
    deductions: 320,
    netSalary: 2880,
  },
  {
    id: "payroll-4",
    employeeId: "emp-4",
    period: "2025-11",
    baseSalary: 2200,
    workingDays: 22,
    vacationDays: 2,
    sickDays: 0,
    unjustifiedDays: 0,
    deductions: 220,
    netSalary: 1980,
  },
  {
    id: "payroll-5",
    employeeId: "emp-5",
    period: "2025-11",
    baseSalary: 2600,
    workingDays: 22,
    vacationDays: 0,
    sickDays: 0,
    unjustifiedDays: 0,
    deductions: 260,
    netSalary: 2340,
  },
  {
    id: "payroll-6",
    employeeId: "emp-6",
    period: "2025-11",
    baseSalary: 2400,
    workingDays: 22,
    vacationDays: 0,
    sickDays: 0,
    unjustifiedDays: 0,
    deductions: 240,
    netSalary: 2160,
  },
]

// Helper to get mock data based on user role
export const getMockDataByRole = (role: "HR_ADMIN" | "MANAGER" | "EMPLOYEE") => {
  if (role === "EMPLOYEE") {
    return {
      employees: MOCK_EMPLOYEES.slice(0, 1),
      leaveRequests: MOCK_LEAVE_REQUESTS.filter((r) => r.employeeId === "emp-1"),
      punches: MOCK_PUNCHES.filter((p) => p.employeeId === "emp-1"),
      payroll: MOCK_PAYROLL.filter((p) => p.employeeId === "emp-1"),
    }
  }
  return {
    employees: MOCK_EMPLOYEES,
    leaveRequests: MOCK_LEAVE_REQUESTS,
    punches: MOCK_PUNCHES,
    payroll: MOCK_PAYROLL,
  }
}
