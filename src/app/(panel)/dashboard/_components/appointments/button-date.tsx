"use client"

import { useMemo } from "react"
import { parseISO, format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { DatePicker } from "@/components/ui/date-picker"

export function ButtonPickerAppointment() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const dateParam = searchParams.get("date")

    const selectedDate = useMemo(() => {
        if (!dateParam) return new Date()
        const parsed = parseISO(dateParam)
        return isNaN(parsed.getTime()) ? new Date() : parsed
    }, [dateParam])

    function handleDateChange(newDate: Date) {
        const formattedDate = format(newDate, "yyyy-MM-dd")
        const params = new URLSearchParams(searchParams.toString())
        params.set("date", formattedDate)

        router.push(`?${params.toString()}`)
    }

    return (
        <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            openUpward={false}
            align="right"
            className="w-auto min-w-[150px]"
        />
    )
}