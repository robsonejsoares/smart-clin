"use client"

import { Clock3, Info } from "lucide-react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

interface DialogClinicHoursProps {
    isOpen: boolean
    onClose: () => void
    selectedHours: string[]
    toggleHour: (hour: string) => void
    hours: string[]
}

export function DialogClinicHours({
    onClose,
    selectedHours,
    toggleHour,
    hours,
}: DialogClinicHoursProps) {
    return (
        <DialogContent className="group/modal flex h-[570px] max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-xl border-border/70 p-0 [&>div]:flex [&>div]:h-full [&>div]:min-h-0 [&>div]:flex-col sm:max-w-lg">
            <DialogHeader className="shrink-0 border-b border-border/60 bg-gradient-to-br from-background via-background to-[#252579]/[0.025] px-6 py-5">
                <DialogTitle className="flex items-center gap-3 bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-clip-text text-transparent">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover/modal:scale-105 group-hover/modal:border-[#252579]/20 group-hover/modal:bg-[#252579]/[0.09] group-hover/modal:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                        <Clock3 className="h-4 w-4 transition-transform duration-300 ease-out group-hover/modal:scale-110 group-hover/modal:-rotate-3" />
                    </div>
                    <span>Horários da Clínica</span>
                </DialogTitle>
            </DialogHeader>

            <section className="flex-1 overflow-visible space-y-4 px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-[#252579]/15 bg-[#252579]/[0.035] px-3 py-1 shadow-sm transition-colors duration-200">
                        <Info className="h-3 w-3 shrink-0 text-[#252579]" />
                        <p className="text-xs text-muted-foreground">
                            Selecione os horários de atendimento.
                        </p>
                    </div>

                    <div
                        className={cn(
                            "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200 shadow-2xs",
                            selectedHours.length === 0
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        )}
                    >
                        <span
                            className={cn(
                                "h-1.5 w-1.5 rounded-full transition-colors duration-200",
                                selectedHours.length === 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                            )}
                        />
                        <span className="whitespace-nowrap tabular-nums">
                            {selectedHours.length} selecionado{selectedHours.length === 1 ? "" : "s"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {hours.map(hour => {
                        const isSelected = selectedHours.includes(hour)

                        return (
                            <Button
                                key={hour}
                                type="button"
                                variant="outline"
                                className={cn(
                                    "group/hour h-10 cursor-pointer rounded-md border-border/70 bg-background font-medium tabular-nums transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:border-[#252579]/25 hover:bg-[#252579]/[0.035] hover:text-[#252579] active:scale-[0.97]",
                                    isSelected &&
                                    "border-emerald-500/40 bg-emerald-500/[0.09] text-emerald-700 shadow-sm shadow-emerald-500/[0.08] hover:border-emerald-500/50 hover:bg-emerald-500/[0.13] hover:text-emerald-700 dark:text-emerald-400"
                                )}
                                onClick={() => toggleHour(hour)}
                            >
                                {hour}
                            </Button>
                        )
                    })}
                </div>
            </section>

            <div className="shrink-0 border-t border-border/60 bg-muted/[0.16] px-6 pb-6 pt-4">
                <Button
                    type="button"
                    className="h-11 w-full rounded-md bg-[#252579] text-white shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 focus-visible:ring-2 focus-visible:ring-[#252579]/30 active:scale-[0.99]"
                    onClick={onClose}
                >
                    Fechar
                </Button>
            </div>
        </DialogContent>
    )
}