"use client"

import { useState, useEffect } from "react"
import { wait } from "@/lib/min-delay"

interface UseScheduleSlotsProps {
    clinicId: string
    date?: string
    serviceId?: string
}

export function useScheduleSlots({ clinicId, date, serviceId }: UseScheduleSlotsProps) {
    const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        // Como o estado inicial já é [], basta retornar sem chamar setSlots de forma síncrona
        if (!date || !clinicId) {
            return
        }

        let isMounted = true

        async function loadSlots() {
            setIsLoading(true)
            const minDelay = wait()
            try {
                const params = new URLSearchParams({
                    userId: clinicId,
                    date: date ?? "",
                })
                const response = await fetch(
                    `/api/schedule/get-appointments?${params.toString()}`,
                    { cache: "no-store" }
                )
                const json = await response.json()
                await minDelay
                
                const bookedTimes = Array.isArray(json)
                    ? json
                        .filter((time): time is string => typeof time === "string")
                        .map((time) => time.trim())
                    : []

                const defaultTimes = [
                    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
                    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
                    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
                ]

                const parsedDate = new Date(date + "T00:00:00")
                const dayOfWeek = parsedDate.getDay()
                const isSunday = dayOfWeek === 0
                const isSaturday = dayOfWeek === 6

                const finalSlots = defaultTimes.map(time => {
                    const [hours, minutes] = time.split(":").map(Number)
                    const saturdayUnavailable = isSaturday && (hours > 12 || (hours === 12 && minutes > 0))
                    const isBooked = bookedTimes.includes(time)

                    return {
                        time,
                        available: !isSunday && !saturdayUnavailable && !isBooked,
                    }
                })

                if (isMounted) {
                    setSlots(finalSlots)
                }
            } catch (error) {
                console.error("Erro ao carregar horários:", error)
                if (isMounted) {
                    setSlots([])
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadSlots()

        return () => {
            isMounted = false
        }
    }, [clinicId, date, serviceId])

    return {
        slots,
        isLoading,
    }
}