"use client"

import {
    useDialogServiceForm,
    DialogServiceFormData,
} from "./dialog-service-form"

import {
    DialogTitle,
    DialogHeader,
    DialogDescription,
} from "@/components/ui/dialog"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
} from "@/components/ui/form"

import { toast } from "sonner"
import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateService } from "../_actions/update-service"
import { convertRealToCents } from "@/utils/convertCurrency"
import { createNewService } from "../_actions/create-service"


interface DialogServiceProps {
    closeModal: () => void;
    serviceId?: string;
    initialValues?: {
        name: string;
        price: string;
        hours: string;
        minutes: string;
    };
}

export function DialogService({ closeModal, initialValues, serviceId }: DialogServiceProps) {
    const form = useDialogServiceForm({ initialValues: initialValues });
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    async function onSubmit(values: DialogServiceFormData) {
        setLoading(true)
        const priceInCents = convertRealToCents(values.price)
        const hours = parseInt(values.hours) || 0;
        const minutes = parseInt(values.minutes) || 0;

        // Converter as horas e minutos para duração total em minutos
        const duration = (hours * 60) + minutes;

        if (serviceId) {
            await editServiceById({
                serviceId: serviceId,
                name: values.name,
                priceInCents: priceInCents,
                duration: duration,
            })

            return
        }

        const response = await createNewService({
            name: values.name,
            price: priceInCents,
            duration: duration,
        })

        await new Promise(resolve => setTimeout(resolve, 1000))

        setLoading(false)

        if (response.error) {
            toast.error(response.error)
            return
        }

        toast.success("Serviço cadastrado com sucesso!")
        handleCloseModal()
        router.refresh()
    }

    async function editServiceById({
        serviceId,
        name,
        priceInCents,
        duration }: {
            serviceId: string,
            name: string,
            priceInCents: number,
            duration: number
        }) {

        const response = await updateService({
            serviceIde: serviceId,
            name: name,
            price: priceInCents,
            duration: duration,
        })

        await new Promise(resolve => setTimeout(resolve, 1000))

        setLoading(false)

        if (response.error) {
            toast.error(response.error)
            return
        }

        toast(response.data);
        handleCloseModal();
    }

    function handleCloseModal() {
        form.reset()
        closeModal()
    }

    function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
        let { value } = event.target
        value = value.replace(/\D/g, "")

        if (value) {
            value = (parseInt(value, 10) / 100).toFixed(2)
            value = value.replace(".", ",")
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        event.target.value = value
        form.setValue("price", value)
    }

    return (
        <>
            <div tabIndex={0} className="sr-only" />

            {/* Botão Fechar */}
            <div className="absolute right-4 top-4 z-50">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md"
                                onClick={handleCloseModal}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Fechar
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <DialogHeader>
                <DialogTitle>
                    <DialogDescription className="text-lg text-center font-semibold">
                        Adicione um novo serviço
                    </DialogDescription>
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form
                    className="space-y-2"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Nome do Serviço:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Digite o nome do serviço..."
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Valor do Serviço R$:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ex: 120,00"
                                            onChange={changeCurrency}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className="font-semibold">
                        Tempo de duração do serviço:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="hours"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Horas:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="1"
                                            min="0"
                                            type="number"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minutes"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Minutos:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="0"
                                            min="0"
                                            type="number"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-sky-500 text-white hover:bg-sky-600 disabled:hover:bg-sky-500 transition-colors text-sm py-2.5"
                        disabled={
                            loading ||
                            !form.watch("name") ||
                            !form.watch("price") ||
                            !form.watch("hours") ||
                            !form.watch("minutes")
                        }
                    >
                        {loading
                            ? "Adicionando serviço..."
                            : `${serviceId ? "Atualizar Serviço" : "Adicionar Serviço"}`
                        }
                    </Button>
                </form>
            </Form >
        </>
    )

}