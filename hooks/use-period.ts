"use client"

import { useState, useMemo } from "react"

export function usePeriod(defaultPeriod?: string) {
  const [period, setPeriod] = useState(() => {
    if (defaultPeriod) return defaultPeriod
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  const dateRange = useMemo(() => {
    const [year, month] = period.split("-").map(Number)
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0)

    return {
      from: start.toISOString().split("T")[0],
      to: end.toISOString().split("T")[0],
    }
  }, [period])

  return { period, setPeriod, dateRange }
}
