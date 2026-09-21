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
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
} from "@/components/ui/form"

import { toast } from "sonner"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { convertRealToCents } from "@/utils/convertCurrency"
import { createNewService } from "../_actions/create-service"


interface DialogServiceProps {
    closeModal: () => void;
}

export function DialogService({ closeModal }: DialogServiceProps) {

    const form = useDialogServiceForm()
    const [loading, setLoading] = useState(false);

    async function onSubmit(values: DialogServiceFormData) {
        setLoading(true)
        const priceInCents = convertRealToCents(values.price)
        const hours = parseInt(values.hours) || 0;
        const minutes = parseInt(values.minutes) || 0;

        // Converter as horas e minutos para duração total em minutos
        const duration = (hours * 60) + minutes;

        const response = await createNewService({
            name: values.name,
            price: priceInCents,
            duration: duration,
        })

        setLoading(false)

        if (response.error) {
            toast.error(response.error)
            return
        }

        toast.success("Serviço cadastrado com sucesso!")
        handleCloseModal()
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
            <DialogHeader>
                <DialogTitle>
                    <DialogDescription>
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
                        className="w-full font-semibold text-white"
                        disabled={loading}
                    >
                        {loading ? "Cadastrando..." : "Cadastrar Serviço"}
                    </Button>
                </form>
            </Form >
        </>
    )

}