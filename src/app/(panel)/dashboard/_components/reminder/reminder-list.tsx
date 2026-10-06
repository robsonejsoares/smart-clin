"use client"

import { toast } from "@/lib/notify"
import { useState, useTransition , useEffect } from "react"
import { Plus, Trash, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AgendaLoader from "@/components/agenda-loader"
import { wait } from "@/lib/min-delay"
import { createReminder } from "../../_actions/create-reminder"
import { Reminder } from "@/generated/prisma/client"
import { ReminderContent } from "./reminder-content"
import { ScrollArea } from "@/components/ui/scroll-area"
import { deleteReminder } from "../../_actions/delete-reminder"
import { DialogDeleteReminder } from "../dialogs/dialog-delete-reminder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ReminderListProps {
    reminder: Reminder[]
}

export function ReminderList({ reminder }: ReminderListProps) {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [reminderToDelete, setReminderToDelete] = useState<string | null>(null)
    const [busyMessage, setBusyMessage] = useState<string | null>(null)
    const [lastMessage, setLastMessage] = useState("Atualizando lembretes...")
    const [busyTone, setBusyTone] = useState<"warning" | "danger">("warning")
    const [isRefreshing, startRefresh] = useTransition()
    const [pendingSuccess, setPendingSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (pendingSuccess && !busyMessage && !isRefreshing) {
            const timer = setTimeout(() => {
                toast.success(pendingSuccess)
                setPendingSuccess(null)
            }, 600)
            return () => clearTimeout(timer)
        }
    }, [pendingSuccess, busyMessage, isRefreshing])

    const selectedReminder = reminder.find((item) => item.id === reminderToDelete)

    async function runAction(message: string, tone: "warning" | "danger", action: () => Promise<{ success: boolean; message?: string }>) {
        setBusyTone(tone)
        setLastMessage(message)
        setBusyMessage(message)
        const [response] = await Promise.all([action(), wait()])

        if (!response.success) {
            setBusyMessage(null)
            toast.error(response.message ?? "Erro ao executar a ação")
            return
        }

        startRefresh(() => router.refresh())
        setBusyMessage(null)
        if (response.message) setPendingSuccess(response.message)
    }

    function handleDeleteReminder() {
        if (!reminderToDelete) return
        const reminderId = reminderToDelete
        setReminderToDelete(null)
        runAction("Excluindo lembrete...", "danger", () => deleteReminder({ reminderId }))
    }

    function handleCreateReminder(description: string) {
        runAction("Cadastrando lembrete...", "warning", () => createReminder({ description }))
    }

    return (
        <div className="flex flex-col gap-3">
            <Card className="group overflow-hidden border-border/60 bg-background shadow-sm shadow-black/[0.035]">
                <CardHeader className="relative flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border/60 bg-gradient-to-r from-background via-background to-[#252579]/[0.025] px-5 py-4 md:px-6">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-400/20 bg-amber-400/[0.10] text-amber-500 transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out group-hover:scale-105 group-hover:border-amber-400/30 group-hover:bg-amber-400/[0.14] group-hover:shadow-[0_4px_14px_rgba(245,158,11,0.12)]">
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
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    aria-label="Adicionar lembrete"
                                    className="h-9 cursor-pointer rounded-md border-amber-400/25 bg-amber-400/[0.06] px-3 text-amber-500 shadow-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-amber-400/40 hover:bg-amber-400/[0.12] hover:text-amber-600 hover:shadow-md hover:shadow-amber-400/[0.10] focus-visible:ring-2 focus-visible:ring-amber-400/30"
                                >
                                    <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                                    Adicionar lembrete
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl w-full p-0 overflow-hidden border-none rounded-xl bg-white shadow-2xl">
                                <ReminderContent closeDialog={() => setIsDialogOpen(false)} onSubmitReminder={handleCreateReminder} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-20rem)] px-3 lg:h-[calc(100vh-15rem)] lg:px-5">
                        <div className="rounded-md bg-muted/[0.12] p-2.5 sm:p-3">
                            {busyMessage || isRefreshing ? (
                                <AgendaLoader message={busyMessage ?? lastMessage} tone={busyTone} rows={4} />
                            ) : reminder.length === 0 ? (
                                <div className="flex min-h-[calc(100vh-26rem)] items-center justify-center px-6">
                                    <div className="max-w-xs text-center">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-amber-400/20 bg-amber-400/[0.10] text-amber-500 shadow-sm">
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
                                            className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border/60 bg-background px-3.5 py-3 shadow-sm shadow-black/[0.02] transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-amber-400/20 hover:bg-amber-400/[0.025] hover:shadow-sm"
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
                                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-md text-muted-foreground transition-[background-color,color,box-shadow,transform] duration-200 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-red-500/30 dark:hover:text-red-400"
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

            <DialogDeleteReminder
                reminder={selectedReminder}
                onClose={() => setReminderToDelete(null)}
                onConfirm={handleDeleteReminder}
                isDeleting={false}
            />
        </div>
    )
}
