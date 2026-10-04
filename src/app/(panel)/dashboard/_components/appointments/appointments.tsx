import { AppointmentsList } from './appointments-list'
import { getClinicDashboardData } from '../../_data-access/get-clinic-dashboard-data'
import { getTimesClinic } from '../../_data-access/get-times-clinic'

export async function Appointments({ userId }: { userId: string }) {
    
    const [{ times }, clinic] = await Promise.all([
        getTimesClinic({ userId: userId }),
        getClinicDashboardData({ userId: userId }),
    ])

    return (
        <AppointmentsList
            times={times}
            userId={userId}
            clinic={clinic ?? undefined}
        />
    )
}