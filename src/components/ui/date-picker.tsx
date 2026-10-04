"use client"

import { useState, useEffect, useRef } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip"

export interface DatePickerProps {
    value?: Date
    onChange: (date: Date) => void
    openUpward?: boolean
    align?: "left" | "right"
    className?: string
    placeholder?: string // <-- Adicionado suporte a placeholder
}

export function DatePicker({
    value,
    onChange,
    openUpward = false,
    align = "left",
    className,
    placeholder = "Selecione a data...",
}: DatePickerProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Mês atual do calendário e controle de sincronização
    const [displayMonth, setDisplayMonth] = useState(value ?? new Date())
    const [prevValue, setPrevValue] = useState(value)
    const [isOpen, setIsOpen] = useState(false)

    // Sincroniza o mês de exibição quando a prop 'value' muda externamente
    if (value !== prevValue) {
        setPrevValue(value)
        if (value) {
            setDisplayMonth(value)
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    function handleChangeDate(date: Date | undefined) {
        if (!date) return
        onChange(date)
        setDisplayMonth(date)
        setIsOpen(false)
    }

    const alignmentClass = align === "right" ? "right-0" : "left-0"
    const verticalClass = openUpward ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"

    return (
        <div ref={containerRef} className={`relative ${className ?? "w-full"}`}>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(current => !current)}
                className="group h-10 w-full justify-between gap-3 rounded-md border-border/80 bg-background px-3.5 text-xs sm:text-sm font-medium shadow-sm hover:bg-muted/50"
            >
                <span className="flex min-w-0 items-center gap-2.5">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className={`truncate text-xs sm:text-sm ${!value ? "font-normal text-muted-foreground/80" : "font-medium text-foreground"}`}>
                        {value ? format(value, "dd/MM/yyyy") : placeholder}
                    </span>
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-[#252579]" : ""}`} />
            </Button>

            {isOpen && (
                <div
                    className={`absolute ${alignmentClass} ${verticalClass} z-[110] w-[318px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border/70 bg-background shadow-2xl`}
                >
                    <div className="border-b border-border/60 bg-gradient-to-r from-[#252579]/[0.045] via-background to-emerald-500/[0.045] px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#252579]/[0.09] text-[#252579] shadow-sm">
                                <CalendarDays className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight">Selecionar data</span>
                        </div>
                    </div>

                    <div className="px-3 py-3">
                        <div className="mb-2 flex h-10 items-center justify-between px-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => setDisplayMonth(m => subMonths(m, 1))}
                                        aria-label="Mês anterior"
                                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="text-xs font-medium"
                                >
                                    Mês anterior
                                </TooltipContent>
                            </Tooltip>

                            <span className="text-sm font-bold capitalize tracking-tight text-foreground">
                                {format(displayMonth, "MMMM yyyy", { locale: ptBR })}
                            </span>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => setDisplayMonth(m => addMonths(m, 1))}
                                        aria-label="Próximo mês"
                                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="text-xs font-medium"
                                >
                                    Próximo mês
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <DayPicker
                            mode="single"
                            month={displayMonth}
                            onMonthChange={setDisplayMonth}
                            selected={value}
                            onSelect={handleChangeDate}
                            locale={ptBR}
                            weekStartsOn={0}
                            showOutsideDays
                            fixedWeeks
                            hideNavigation
                            className="w-full"
                            classNames={{
                                root: "w-full",
                                months: "w-full",
                                month: "w-full",
                                month_caption: "hidden",
                                nav: "hidden",
                                caption_label: "hidden",
                                month_grid: "w-full border-collapse",
                                weekdays: "mb-2 grid grid-cols-7",
                                weekday: "flex h-8 items-center justify-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60",
                                weeks: "space-y-1",
                                week: "grid grid-cols-7",
                                day: "relative flex h-10 items-center justify-center p-0 text-center",
                                day_button: "relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-foreground transition-all hover:bg-[#252579]/[0.07] hover:text-[#252579]",
                                selected: "!rounded-full !bg-[#6b8ee8] !text-white !shadow-[0_2px_7px_rgba(107,142,232,0.20)] hover:!bg-[#7899ed] hover:!text-white",
                                today: "font-bold text-emerald-600 after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-emerald-500",
                                outside: "text-muted-foreground/25",
                                disabled: "pointer-events-none text-muted-foreground/20",
                            }}
                        />
                    </div>

                    <div className="border-t border-border/60 bg-muted/[0.16] px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.28)]" />
                                <span className="text-xs font-normal text-muted-foreground">Hoje</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#6b8ee8] shadow-[0_0_6px_rgba(107,142,232,0.28)]" />
                                <span className="text-xs font-normal tabular-nums text-muted-foreground">
                                    {value ? format(value, "d 'de' MMMM", { locale: ptBR }) : "Nenhuma data"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}