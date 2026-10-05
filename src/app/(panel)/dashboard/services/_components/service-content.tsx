import { ServicesList } from "./services-list";
import { getAllServices } from "../_data-access/get-all-services";

interface ServicesContentProps {
    userId: string;
}

export async function ServicesContent({ userId }: ServicesContentProps) {

    const services = await getAllServices({ userId: userId })

<<<<<<< HEAD
    console.log("SERVIÇOS: ", services)

    return (
        <ServicesList />
=======
    return (
        <ServicesList services={services.data || []}/>
>>>>>>> d21dfe2fc873b266a0a127c59f81f36621db9916
    )
}