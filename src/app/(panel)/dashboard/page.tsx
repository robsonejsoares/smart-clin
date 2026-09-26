import { ButtonCopyLink } from "./_components/button-copy-link";
import { Reminders } from "./_components/reminder/reminders";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import Link from "next/link";

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
                        <Button className="bg-emerald-500 hover:bg-emerald-400">
                            <Calendar className="w-5 h-5" />
                            <span>Novo Agendamento</span>
                        </Button>
                    </Link>
                </div>
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
                    <div>
                        Agenda
                    </div>

                    <Reminders userId={session.user.id} />
                </section>
            </main>
        </TooltipProvider>
    );
}