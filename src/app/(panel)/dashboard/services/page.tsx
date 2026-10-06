import getSession from "@/lib/getSession";
import { withMinDelay } from "@/lib/min-delay";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/service-content";

export default async function Services() {
    const session = await withMinDelay(getSession());

    if (!session) {
        redirect("/");
    }

    if (!session.user?.id) {
        redirect("/");
    }

    return (
        <ServicesContent userId={session.user.id} />
    )
}