import { redirect } from "next/navigation"
import { withMinDelay } from "@/lib/min-delay"
import { getInfoSchedule } from "./_data-access/get-info-schedule"

export default async function SchedulePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const userId = (await params).id
    const user = await withMinDelay(getInfoSchedule({ userId: userId }))

    if (!user) {
        redirect("/")
    }

    return (
        <div>
            <h1>{user.name}</h1>
        </div>
    )
}