"use client"

import { Clock3, Check, Info } from "lucide-react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

interface ModalClinicHoursProps {
    isOpen: boolean
    onClose: () => void
    selectedHours: string[]
    toggleHour: (hour: string) => void
    hours: string[]
}

export function ModalClinicHours({
    isOpen,
    onClose,
    selectedHours,
    toggleHour,
    hours,
}: ModalClinicHoursProps) {
    return (
        <DialogContent className="group/modal sm:max-w-lg h-[550px] flex flex-col overflow-hidden rounded-2xl border-border/70 p-0">
            <DialogHeader className="shrink-0 border-b border-border/60 bg-gradient-to-br from-background via-background to-[#252579]/[0.025] px-6 py-5">
                <DialogTitle className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 group-hover/modal:scale-105 group-hover/modal:border-[#252579]/20 group-hover/modal:bg-[#252579]/[0.09] group-hover/modal:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                        <Clock3 className="h-4 w-4 transition-transform duration-300 group-hover/modal:rotate-[-8deg]" />
                    </div>
                    <span>Horários da Clínica</span>
                </DialogTitle>
            </DialogHeader>

            <section className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 rounded-lg border border-[#252579]/15 bg-[#252579]/[0.035] px-3.5 py-2.5 shadow-sm transition-colors duration-200">
                        <Info className="h-4 w-4 shrink-0 text-[#252579]" />
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

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {hours.map(hour => {
                        const isSelected = selectedHours.includes(hour)

                        return (
                            <Button
                                key={hour}
                                type="button"
                                variant="outline"
                                className={cn(
                                    "group/hour h-10 cursor-pointer rounded-lg border-border/70 bg-background font-medium tabular-nums transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:border-[#252579]/25 hover:bg-[#252579]/[0.035] hover:text-[#252579] active:scale-[0.97]",
                                    isSelected &&
                                    "border-emerald-500/40 bg-emerald-500/[0.09] text-emerald-700 shadow-sm shadow-emerald-500/[0.08] hover:border-emerald-500/50 hover:bg-emerald-500/[0.13] hover:text-emerald-700 dark:text-emerald-400"
                                )}
                                onClick={() => toggleHour(hour)}
                            >
                                <span className="flex items-center justify-center gap-1.5">
                                    {isSelected && (
                                        <Check className="h-3.5 w-3.5 transition-transform duration-200 group-hover/hour:scale-110" />
                                    )}
                                    {hour}
                                </span>
                            </Button>
                        )
                    })}
                </div>
            </section>

            <div className="shrink-0 border-t border-border/60 bg-muted/[0.16] px-6 py-4">
                <Button
                    type="button"
                    className="h-11 w-full rounded-lg bg-[#252579] text-white shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 active:scale-[0.99]"
                    onClick={onClose}
                >
                    Fechar Modal
                </Button>
            </div>
        </DialogContent>
    )
}