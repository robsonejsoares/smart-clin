import { AppointmentsList } from './appointments-list'
import { getTimesClinic } from '../../_data-access/get-times-clinic'

export async function Appointments({ userId }: { userId: string }) {

    const { times } = await getTimesClinic({ userId: userId })

    return (
        <AppointmentsList times={times} />
    )
}