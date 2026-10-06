"use client"




import { Plus, Bell, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

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
    onSubmitReminder: (description: string) => void
}

export function ReminderContent({ closeDialog, onSubmitReminder }: ReminderContentProps) {
    const form = useReminderForm()



    const descriptionValue = form.watch("description") || ""
    const maxLength = 558
    const isSubmitDisabled = !descriptionValue.trim()

    function onSubmit(formData: ReminderFormData) {
        onSubmitReminder(formData.description)
        closeDialog()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="group/modal w-full bg-background text-foreground">

                <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-background via-background to-[#252579]/[0.025] px-6 py-5">
                    <DialogTitle className="flex items-center gap-3 text-lg font-bold">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover/modal:scale-105 group-hover/modal:border-[#252579]/20 group-hover/modal:bg-[#252579]/[0.09] group-hover/modal:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                            <Bell className="h-4 w-4 transition-transform duration-300 ease-out group-hover/modal:scale-110 group-hover/modal:-rotate-3" />
                        </div>
                        <span className="bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-clip-text text-lg font-bold tracking-tight text-transparent">Novo Lembrete</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => {
                            const currentLength = field.value?.length || 0

                            return (
                                <FormItem className="space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-[#252579]/15 bg-[#252579]/[0.035] px-3 py-1 shadow-sm transition-colors duration-200 group-hover/modal:border-[#252579]/25">
                                            <Info className="h-3 w-3 shrink-0 text-[#252579] transition-transform duration-500 ease-out group-hover/modal:rotate-[18deg] group-hover/modal:scale-110" />
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-semibold">Aviso importante:</span> Os lembretes cadastrados aqui ficam visíveis no seu painel principal.
                                            </p>
                                        </div>

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
                                            className="min-h-[160px] rounded-md border-border/70 bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 hover:border-[#252579]/25 focus-visible:border-[#252579]/40 focus-visible:ring-0"
                                        />
                                    </FormControl>

                                    <FormMessage className="text-xs font-medium text-rose-500" />
                                </FormItem>
                            )
                        }}
                    />
                </div>

                <div className="border-t border-border/60 bg-muted/[0.16] px-6 py-4 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeDialog}
                        className="h-10 rounded-md border border-border/70 bg-background px-5 text-xs font-semibold text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-[#252579]/25"
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="h-10 rounded-md bg-[#252579] px-5 text-xs font-semibold text-white transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:ring-2 focus-visible:ring-[#252579]/30 disabled:opacity-50 active:scale-[0.99]"
                    >
                        <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-white" />
                                <span>Cadastrar Lembrete</span>
                            </span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}