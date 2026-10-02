import prisma from "@/lib/prisma"
import { AppointmentsList } from './appointments-list'
import { getTimesClinic } from '../../_data-access/get-times-clinic'

export async function Appointments({ userId }: { userId: string }) {
    
    const [{ times }, clinic] = await Promise.all([
        getTimesClinic({ userId: userId }),
        prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                subscription: true,
                services: true,
            },
        }),
    ])

    return (
        <AppointmentsList
            times={times}
            userId={userId}
            clinic={clinic ?? undefined}
        />
    )
}