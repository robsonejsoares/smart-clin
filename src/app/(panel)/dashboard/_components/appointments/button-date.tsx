"use client"

import { useEffect, useRef, useState } from "react"
import { addMonths, format, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { DayPicker } from "react-day-picker"
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ButtonPickerAppointment() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [displayMonth, setDisplayMonth] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [isOpen])

  function handleChangeDate(date: Date | undefined) {
    if (!date) return

    setSelectedDate(date)
    setDisplayMonth(date)
    setIsOpen(false)

    const url = new URL(window.location.href)

    url.searchParams.set(
      "date",
      format(date, "yyyy-MM-dd")
    )

    router.push(url.toString())

  }

  function handlePreviousMonth() {
    setDisplayMonth((month) => subMonths(month, 1))
  }

  function handleNextMonth() {
    setDisplayMonth((month) => addMonths(month, 1))
  }

  return (
    <div ref={containerRef} className="relative" >
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="group h-10 min-w-[190px] justify-between gap-3 rounded-xl border-border/70 bg-background px-3.5 font-medium shadow-sm shadow-black/[0.025] transition-[border-color,background-color,box-shadow,transform] duration-200 hover:border-[#252579]/25 hover:bg-[#252579]/[0.025] hover hover:shadow-[#252579]/[0.05] active:scale-[0.98] focus-visible focus-visible:ring-[#252579]/25"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#252579]/[0.08] text-[#252579] transition-[background-color,transform] duration-200 group-hover:scale-105 group-hover:bg-[#252579]/[0.12]">
            <CalendarDays className="h-3.5 w-3.5" />
          </span>

          <span className="truncate text-sm font-semibold">
            {format(selectedDate, "dd/MM/yyyy")}
          </span>
        </span>

        <ChevronDown
          className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-[#252579]" : ""
            }`}
        />
      </Button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Selecionar data"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[318px] overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl shadow-black/[0.10] animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="border-b border-border/60 bg-gradient-to-r from-[#252579]/[0.045] via-background to-emerald-500/[0.045] px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#252579]/[0.09] text-[#252579] shadow-sm">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight">
                  Selecionar data
                </p>
              </div>
            </div>
          </div>

          <div className="px-3 py-3">
            <div className="mb-2 flex h-10 items-center justify-between px-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handlePreviousMonth}
                    aria-label="Mês anterior"
                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="top"
                  className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                >
                  Mês anterior
                </TooltipContent>
              </Tooltip>

              <span className="text-sm font-bold capitalize tracking-tight text-foreground">
                {format(
                  displayMonth,
                  "MMMM yyyy",
                  { locale: ptBR }
                )}
              </span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Próximo mês"
                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-[#252579]/20 hover:bg-[#252579]/[0.06] hover:text-[#252579] hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="top"
                  className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                >
                  Próximo mês
                </TooltipContent>
              </Tooltip>
            </div>

            <DayPicker
              mode="single"
              month={displayMonth}
              onMonthChange={setDisplayMonth}
              selected={selectedDate}
              onSelect={handleChangeDate}
              locale={ptBR}
              weekStartsOn={1}
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
                weekday:
                  "flex h-8 items-center justify-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60",
                weeks: "space-y-1",
                week: "grid grid-cols-7",
                day:
                  "relative flex h-10 items-center justify-center p-0 text-center",
                day_button:
                  "relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-foreground transition-[background-color,color,box-shadow,transform] duration-150 hover:bg-[#252579]/[0.07] hover:text-[#252579] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1",
                selected:
                  "!rounded-full !bg-[#6b8ee8] !text-white !shadow-[0_2px_7px_rgba(107,142,232,0.20)] hover:!bg-[#7899ed] hover:!text-white",
                today:
                  "font-bold text-emerald-600 after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-emerald-500",
                outside:
                  "text-muted-foreground/25",
                disabled:
                  "pointer-events-none text-muted-foreground/20",
              }}
            />
          </div>

          <div className="border-t border-border/60 bg-muted/[0.16] px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.28)]" />

                <span className="text-xs font-normal text-muted-foreground">
                  Hoje
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#6b8ee8] shadow-[0_0_6px_rgba(107,142,232,0.28)]" />

                <span className="text-xs font-normal tabular-nums text-muted-foreground">
                  {format(
                    selectedDate,
                    "dd 'de' MMMM",
                    { locale: ptBR }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}