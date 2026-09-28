import Link from "next/link";
import { Calendar } from "lucide-react";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Reminders } from "./_components/reminder/reminders";
import { ButtonCopyLink } from "./_components/button-copy-link";
import { Appointments } from "./_components/appointments/appointments";

export default async function Dashboard() {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    return (
        <TooltipProvider>
            <main>
                <div className="flex items-center justify-end space-x-2">
                    <ButtonCopyLink userId={session.user.id} />

                    <Link
                        href={`/clinica/${session.user?.id}`}
                        target="_blank"
                    >
                        <Button className="bg-emerald-500 hover:bg-emerald-400 transition-colors">
                            <Calendar className="w-5 h-5" />
                            <span>Novo Agendamento</span>
                        </Button>
                    </Link>
                </div>
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
                    <Appointments userId={session.user.id} />

                    <Reminders userId={session.user.id} />
                </section>
            </main>
        </TooltipProvider>
    );
}