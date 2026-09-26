import { getReminders } from "./_data-access/get-reminders";

export async function Reminders({ userId }: { userId: string }) {

    const reminders = await getReminders({ userId: userId });

    return (
        <div>
            <h1>
                Lembrete
            </h1>
        </div>
    )
}