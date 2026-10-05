"use client"

import {
    useDialogServiceForm,
    DialogServiceFormData,
} from "./dialog-service-form"

import {
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog"

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"

import { toast } from "sonner"
import { useState } from "react"
import { useWatch } from "react-hook-form"
import { Clock3, Info, Loader2, Plus, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateService } from "../../_actions/update-service"
import { convertRealToCents } from "@/lib/convertCurrency"
import { createNewService } from "../../_actions/create-service"

interface DialogServiceProps {
    closeModal: () => void
    serviceId?: string
    initialValues?: {
        name: string
        price: string
        hours: string
        minutes: string
    }
}

export function DialogService({ closeModal, initialValues, serviceId }: DialogServiceProps) {
    const form = useDialogServiceForm({ initialValues: initialValues })
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [name, price, hours, minutes] = useWatch({
        control: form.control,
        name: ["name", "price", "hours", "minutes"],
    })
    const durationInMinutes = (parseInt(hours || "0") || 0) * 60 + (parseInt(minutes || "0") || 0)

    async function onSubmit(values: DialogServiceFormData) {
        setLoading(true)
        const priceInCents = convertRealToCents(values.price)
        const hours = parseInt(values.hours) || 0
        const minutes = parseInt(values.minutes) || 0

        const duration = (hours * 60) + minutes

        if (duration < 30) {
            form.setError("minutes", {
                type: "validate",
                message: "A duração mínima do serviço é de 30 minutos",
            })
            setLoading(false)
            return
        }

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

        await new Promise(resolve => setTimeout(resolve, 600))

        setLoading(false)

        if (!response.success) {
            toast.error(response.message)
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
        duration,
    }: {
        serviceId: string
        name: string
        priceInCents: number
        duration: number
    }) {
        const response = await updateService({
            serviceId: serviceId,
            name: name,
            price: priceInCents,
            duration: duration,
        })

        await new Promise(resolve => setTimeout(resolve, 600))

        setLoading(false)

        if (!response.success) {
            toast.error(response.message)
            return
        }

        toast.success(response.message)
        handleCloseModal()
        router.refresh()
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
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }

        event.target.value = value
        form.setValue("price", value)
    }

    const isSubmitDisabled =
        loading ||
        !name ||
        !price ||
        durationInMinutes < 30

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="group/modal flex h-full flex-col justify-between w-full bg-background text-foreground">

                <DialogHeader className="shrink-0 border-b border-border/60 bg-gradient-to-br from-background via-background to-[#252579]/[0.025] px-6 py-5">
                    <DialogTitle className="flex items-center gap-3 text-lg font-bold">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover/modal:scale-105 group-hover/modal:border-[#252579]/20 group-hover/modal:bg-[#252579]/[0.09] group-hover/modal:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                            <Clock3 className="h-4 w-4 transition-transform duration-300 ease-out group-hover/modal:scale-110 group-hover/modal:-rotate-3" />
                        </div>
                        <span className="bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-clip-text text-lg font-bold tracking-tight text-transparent">
                            {serviceId ? "Editar Serviço" : "Novo Serviço"}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                    <div className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-[#252579]/15 bg-[#252579]/[0.035] px-3 py-1 shadow-sm transition-colors duration-200 group-hover/modal:border-[#252579]/25">
                        <Info className="h-3 w-3 shrink-0 text-[#252579] transition-transform duration-500 ease-out group-hover/modal:rotate-[18deg] group-hover/modal:scale-110" />
                        <p className="text-xs text-muted-foreground truncate min-w-0">
                            Os serviços cadastrados estarão disponíveis no seu agendamento.
                        </p>
                    </div>

                    <div className="space-y-4 pt-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium text-foreground">
                                        Nome do serviço
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ex: Limpeza dental"
                                            className="h-10 rounded-md border-border/70 bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 hover:border-[#252579]/25 focus-visible:border-[#252579]/40 focus-visible:ring-0"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs font-medium text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium text-foreground">
                                        Valor do serviço
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-muted-foreground select-none">
                                                R$
                                            </span>
                                            <Input
                                                {...field}
                                                placeholder="120,00"
                                                onChange={changeCurrency}
                                                className="h-10 rounded-md border-border/70 bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 hover:border-[#252579]/25 focus-visible:border-[#252579]/40 focus-visible:ring-0"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-medium text-rose-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="rounded-md border border-border/70 bg-muted/[0.12] p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover/modal:scale-105 group-hover/modal:border-[#252579]/20 group-hover/modal:bg-[#252579]/[0.09] group-hover/modal:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                                <Clock3 className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/modal:scale-110 group-hover/modal:-rotate-3" />
                            </div>
                            <span>Tempo de Duração</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="hours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium text-foreground">
                                            Horas
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="0"
                                                min="0"
                                                type="number"
                                                className="h-10 rounded-md border-border/70 bg-background p-3 text-sm text-foreground transition-[border-color,box-shadow] duration-200 hover:border-[#252579]/25 focus-visible:border-[#252579]/40 focus-visible:ring-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minutes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium text-foreground">
                                            Minutos
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="0"
                                                min="0"
                                                type="number"
                                                className="h-10 rounded-md border-border/70 bg-background p-3 text-sm text-foreground transition-[border-color,box-shadow] duration-200 hover:border-[#252579]/25 focus-visible:border-[#252579]/40 focus-visible:ring-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-border/60 bg-muted/[0.16] px-6 py-4 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseModal}
                        disabled={loading}
                        className="h-10 rounded-md border border-border/70 bg-background px-5 text-xs font-semibold text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-[#252579]/25"
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="h-10 rounded-md bg-[#252579] px-5 text-xs font-semibold text-white transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:ring-2 focus-visible:ring-[#252579]/30 disabled:opacity-50 active:scale-[0.99]"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                                <span>{serviceId ? "Atualizando..." : "Adicionando..."}</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {serviceId ? (
                                    <>
                                        <Save className="h-4 w-4 text-white" />
                                        <span>Atualizar Serviço</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 text-white" />
                                        <span>Adicionar Serviço</span>
                                    </>
                                )}
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
