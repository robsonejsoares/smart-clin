import Link from "next/link";
import { Calendar } from "lucide-react";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Reminders } from "./components/reminders";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ButtonCopyLink } from "./components/button-copy-link";

export default async function Dashboard() {
    const session = await getSession();

    if (!session) {
        redirect("/");
    }

    return (
        <main>
            <div className="flex items-center justify-end space-x-2">
                <TooltipProvider>
                    <ButtonCopyLink userId={session.user.id} />

                    <Link
                        href={`/clinica/${session.user?.id}`}
                        target="_blank"
                    >
                        <Button className="bg-emerald-500 hover:bg-emerald-400 font-semibold">
                            <Calendar className="w-5 h-5" />
                            <span>Novo Agendamento</span>
                        </Button>
                    </Link>
                </TooltipProvider>
            </div>
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
                <div>
                    Agenda
                </div>

                <Reminders userId={session.user.id}/>
            </section>
        </main>
    );
}