"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Plus, Trash, Bell, AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Reminder } from "@/generated/prisma/client"
import { ReminderContent } from "./reminder-content"
import { ScrollArea } from "@/components/ui/scroll-area"
import { deleteReminder } from "../../_actions/delete-reminder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ReminderListProps {
    reminder: Reminder[]
}

export function ReminderList({ reminder }: ReminderListProps) {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [reminderToDelete, setReminderToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const selectedReminder = reminder.find((item) => item.id === reminderToDelete)

    async function handleDeleteReminder() {
        if (!reminderToDelete) return

        setIsDeleting(true)

        const response = await deleteReminder({ reminderId: reminderToDelete })

        setIsDeleting(false)

        if (response.error) {
            toast.error(response.error)
            return
        }

        toast.success(response.data)
        setReminderToDelete(null)
        router.refresh()
    }

    return (
        <div className="flex flex-col gap-3">
            <Card className="group overflow-hidden border-border/60 bg-background shadow-sm shadow-black/[0.035]">
                <CardHeader className="relative flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border/60 bg-gradient-to-r from-background via-background to-amber-500/[0.025] px-5 py-4 md:px-6">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/[0.10] text-amber-500 transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover:scale-105 group-hover:border-amber-400/30 group-hover:bg-amber-400/[0.14] group-hover:shadow-[0_4px_14px_rgba(245,158,11,0.12)]">
                            <Bell className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <CardTitle className="relative w-full overflow-hidden text-lg font-bold tracking-tight md:text-xl">
                                <span className="relative z-10 block truncate bg-gradient-to-r from-[#17172f] via-[#252579] to-[#17172f] bg-[length:250%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position] duration-[1400ms] ease-out group-hover:bg-[position:100%_50%]">
                                    Lembretes
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[1400ms] ease-out group-hover:left-[120%] group-hover:opacity-100"
                                />
                            </CardTitle>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label="Adicionar lembrete"
                                                className="h-9 w-9 cursor-pointer rounded-lg border-amber-400/25 bg-amber-400/[0.06] text-amber-500 shadow-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:scale-105 hover:border-amber-400/40 hover:bg-amber-400/[0.12] hover:text-amber-600 hover:shadow-md hover:shadow-amber-400/[0.10] focus-visible:ring-2 focus-visible:ring-amber-400/30"
                                            >
                                                <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                                            </Button>
                                        </DialogTrigger>
                                    </div>
                                </TooltipTrigger>

                                <TooltipContent side="left">
                                    Adicionar lembrete
                                </TooltipContent>
                            </Tooltip>
                            <DialogContent className="max-w-3xl w-full p-0 overflow-hidden border-none rounded-3xl bg-white shadow-2xl">
                                <ReminderContent closeDialog={() => setIsDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-20rem)] px-3 lg:h-[calc(100vh-15rem)] lg:px-5">
                        <div className="rounded-2xl bg-muted/[0.12] p-2.5 sm:p-3">
                            {reminder.length === 0 ? (
                                <div className="flex min-h-[calc(100vh-26rem)] items-center justify-center px-6">
                                    <div className="max-w-xs text-center">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.10] text-amber-500 shadow-sm">
                                            <Bell className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                                        </div>

                                        <p className="text-sm font-semibold text-foreground">
                                            Nenhum lembrete
                                        </p>

                                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                            Adicione um lembrete para manter informações importantes sempre por perto.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {reminder.map((item) => (
                                        <article
                                            key={item.id}
                                            className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-background px-3.5 py-3 shadow-sm shadow-black/[0.02] transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-amber-400/20 hover:bg-amber-400/[0.025] hover:shadow-sm"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_7px_rgba(245,158,11,0.28)] transition-transform duration-200 group-hover:scale-125" />

                                                <p className="truncate text-sm leading-6 text-foreground lg:text-[15px]">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Excluir lembrete"
                                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-lg text-muted-foreground transition-[background-color,color,box-shadow,transform] duration-200 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-red-500/30 dark:hover:text-red-400"
                                                        onClick={() => setReminderToDelete(item.id)}
                                                    >
                                                        <Trash className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-4deg]" />
                                                    </Button>
                                                </TooltipTrigger>

                                                <TooltipContent side="left">
                                                    Excluir lembrete
                                                </TooltipContent>
                                            </Tooltip>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Modal de confirmação para exclusão de lembrete */}
            <Dialog
                open={!!reminderToDelete}
                onOpenChange={(open) => {
                    if (!open) {
                        setReminderToDelete(null)
                    }
                }}
            >
                <DialogContent className="group/modal max-w-md overflow-hidden rounded-2xl border-border/70 p-0">
                    <style jsx>{`
                        @keyframes smartclin-alert-pulse {
                            0%, 100% {
                                transform: scale(1) rotate(0deg);
                            }
                            15% {
                                transform: scale(1.15) rotate(-8deg);
                            }
                            30% {
                                transform: scale(1.15) rotate(8deg);
                            }
                            45% {
                                transform: scale(1.08) rotate(-4deg);
                            }
                            60% {
                                transform: scale(1) rotate(0deg);
                            }
                        }

                        @media (prefers-reduced-motion: reduce) {
                            .smartclin-alert-icon {
                                animation: none !important;
                            }
                        }
                    `}</style>

                    <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-background via-background to-rose-500/[0.03] px-6 py-5">
                        <DialogTitle className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-300 group-hover/modal:scale-105 group-hover/modal:border-rose-500/30 group-hover/modal:bg-rose-500/15 group-hover/modal:shadow-[0_4px_12px_rgba(244,63,94,0.12)]">
                                <AlertTriangle
                                    className="smartclin-alert-icon h-4 w-4 text-rose-600"
                                    style={{
                                        animation: "smartclin-alert-pulse 3s ease-in-out infinite",
                                    }}
                                />
                            </div>
                            <span>Excluir Lembrete</span>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Corpo da modal reestilizado no mesmo padrão moderno de blocos */}
                    <div className="px-6 py-5 space-y-4">
                        <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/[0.04] via-white to-rose-500/[0.02] p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-rose-500/40 hover:shadow-xl">

                            {/* Detalhe de luz decorativa no fundo */}
                            <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

                            <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                                Tem certeza que deseja excluir permanentemente o lembrete abaixo?
                            </p>

                            {/* Card individual futurista para o conteúdo do lembrete */}
                            <div className="mt-3">
                                <div className="group/card relative flex items-start gap-3 rounded-xl border border-rose-500/15 bg-white/90 p-3 shadow-xs transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/30 hover:bg-white hover:shadow-md">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white shadow-md shadow-rose-600/25 transition-transform duration-300 group-hover/card:rotate-6 mt-0.5">
                                        <Bell className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-rose-600/80">Descrição do Lembrete</span>
                                        <span className="block truncate text-xs font-bold text-[#17172f] mt-0.5">
                                            {selectedReminder?.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs font-medium text-muted-foreground/80 px-1">
                            Esta ação não poderá ser desfeita.
                        </p>
                    </div>

                    <div className="border-t border-border/60 bg-muted/[0.16] px-6 py-4 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setReminderToDelete(null)}
                            disabled={isDeleting}
                            className="h-10 cursor-pointer rounded-lg border-border/70 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            onClick={handleDeleteReminder}
                            disabled={isDeleting}
                            className="h-10 cursor-pointer rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm transition-all"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                                    <span>Excluindo lembrete...</span>
                                </>
                            ) : (
                                "Confirmar Exclusão"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}