import { ServicesList } from "./services-list";
import { getAllServices } from "../_data-access/get-all-services";

interface ServicesContentProps {
    userId: string;
}

export async function ServicesContent({ userId }: ServicesContentProps) {

    const services = await getAllServices({ userId: userId })

    console.log(services)

    return (
        <ServicesList services={services.data || []}/>
    )
}