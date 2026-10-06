import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { AppointmentsList } from './appointments-list'
import { getClinicDashboardData } from '../../_data-access/get-clinic-dashboard-data'
import { getTimesClinic } from '../../_data-access/get-times-clinic'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export async function Appointments({ userId, date }: { userId: string; date?: string }) {
    const initialDate = date && DATE_PATTERN.test(date) ? date : format(new Date(), "yyyy-MM-dd")
    const [year, month, day] = initialDate.split("-").map(Number)

    const [{ times }, clinic, initialAppointments] = await Promise.all([
        getTimesClinic({ userId: userId }),
        getClinicDashboardData({ userId: userId }),
        prisma.appointment.findMany({
            where: {
                userId,
                appointmentDate: {
                    gte: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)),
                    lte: new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)),
                },
            },
            include: { Service: true },
        }),
    ])

    return (
        <AppointmentsList
            times={times}
            userId={userId}
            clinic={clinic ?? undefined}
            initialDate={initialDate}
            initialAppointments={initialAppointments}
        />
    )
}