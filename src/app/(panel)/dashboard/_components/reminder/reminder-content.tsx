"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Bell, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createReminder } from "../../_actions/create-reminder"
import { useReminderForm, ReminderFormData } from "./reminder-form"
import { cn } from "@/lib/utils"

import {
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormItem,
    FormField,
    FormControl,
    FormMessage,
} from "@/components/ui/form"

interface ReminderContentProps {
    closeDialog: () => void
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {
    const form = useReminderForm()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const descriptionValue = form.watch("description") || ""
    const maxLength = 558
    const isSubmitDisabled = loading || !descriptionValue.trim()

    async function onSubmit(formData: ReminderFormData) {
        setLoading(true)

        const [response] = await Promise.all([
            createReminder({ description: formData.description }),
            new Promise((resolve) => setTimeout(resolve, 600)),
        ])

        if (response.error) {
            toast.error(response.error)
            setLoading(false)
            return
        }

        toast.success(response.data)
        router.refresh()
        closeDialog()
    }

    return (
        <Form {...form}>
            {/* Adicionado group/modal para disparar as animações nos ícones ao passar o mouse */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="group/modal w-full bg-background text-foreground">
                
                {/* 1. Header: Ícone idêntico ao de Horários da Clínica */}
                <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-background via-background to-[#252579]/[0.025] px-6 py-5">
                    <DialogTitle className="flex items-center gap-3 text-lg font-bold">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 group-hover/modal:scale-105 group-hover/modal:border-[#252579]/20 group-hover/modal:bg-[#252579]/[0.09] group-hover/modal:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                            <Bell className="h-4 w-4 transition-transform duration-300 group-hover/modal:-rotate-12 group-hover/modal:scale-110" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">Novo Lembrete</span>
                    </DialogTitle>
                </DialogHeader>

                {/* 2. Corpo */}
                <div className="p-6 space-y-4">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => {
                            const currentLength = field.value?.length || 0

                            return (
                                <FormItem className="space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        {/* Box de Aviso: w-fit (vai só até o final do texto) + animação de rotação no ícone Info */}
                                        <div className="flex w-fit max-w-full items-center gap-2.5 rounded-lg border border-[#252579]/15 bg-[#252579]/[0.035] px-3.5 py-2.5 shadow-sm transition-colors duration-200 group-hover/modal:border-[#252579]/25">
                                            <Info className="h-4 w-4 shrink-0 text-[#252579] transition-transform duration-500 ease-out group-hover/modal:rotate-[18deg] group-hover/modal:scale-110" />
                                            <p className="text-xs text-muted-foreground">
                                                <strong className="font-semibold text-foreground">Aviso importante:</strong> Os lembretes cadastrados aqui ficam visíveis no seu painel principal.
                                            </p>
                                        </div>

                                        {/* Contador do tamanho e padding exatos do badge de seleção */}
                                        <div
                                            className={cn(
                                                "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200 shadow-2xs",
                                                currentLength === 0
                                                    ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                    : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "h-1.5 w-1.5 rounded-full transition-colors duration-200",
                                                    currentLength === 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                                                )}
                                            />
                                            <span className="whitespace-nowrap tabular-nums">
                                                {currentLength}/{maxLength}
                                            </span>
                                        </div>
                                    </div>

                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Descreva aqui as informações importantes do seu lembrete..."
                                            maxLength={maxLength}
                                            className="min-h-[160px] rounded-xl border-border/70 bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 hover:border-[#252579]/25 focus-visible:border-[#252579]/40 focus-visible:ring-0"
                                        />
                                    </FormControl>

                                    <FormMessage className="text-xs font-medium text-rose-500" />
                                </FormItem>
                            )
                        }}
                    />
                </div>

                {/* 3. Rodapé */}
                <div className="border-t border-border/60 bg-muted/[0.16] px-6 py-4 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeDialog}
                        disabled={loading}
                        className="h-10 rounded-lg border border-border/70 bg-background px-5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="h-10 rounded-lg bg-[#252579] px-5 text-xs font-semibold text-white transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 disabled:opacity-50 active:scale-[0.99]"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                                <span>Cadastrando...</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-white" />
                                <span>Cadastrar Lembrete</span>
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}