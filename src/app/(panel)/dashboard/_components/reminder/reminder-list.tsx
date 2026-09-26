"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Reminder } from "@/generated/prisma/client"
import { ReminderContent } from "./reminder-content"
import { ScrollArea } from "@/components/ui/scroll-area"
import { deleteReminder } from "../../_actions/delete-reminder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ReminderListProps {

    reminder: Reminder[]

}

export function ReminderList({ reminder }: ReminderListProps) {

    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    async function handleDeleteReminder(id: string) {

        const response = await deleteReminder({ reminderId: id });

        if (response.error) {
            toast.error(response.error);

            return;
        }

        toast.success(response.data);
        router.refresh();
    }

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl md:text-2xl font-semibold">
                        Lembretes
                    </CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger>
                            <Button variant="ghost" className="w-9 h-9">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Novo Lembrete
                                </DialogTitle>
                                <DialogDescription>
                                    Preencha o formulário abaixo para criar um novo lembrete.
                                </DialogDescription>
                            </DialogHeader>
                            <ReminderContent
                                closeDialog={() => setIsDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {reminder.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Nenhum lembrete encontrado...
                        </p>
                    )}
                    <ScrollArea className="h-[340px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1">
                        {reminder.map((item) => (
                            <article
                                key={item.id}
                                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2 bg-yellow-100 mb-2 px-2 rounded-md"
                            >
                                <p className="min-w-0 truncate text-sm lg:text-base">
                                    {item.description}
                                </p>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="bg-red-500 hover:bg-red-400 shadow-none rounded-full w-7 h-7 shrink-0"
                                            size="sm"
                                            onClick={() => handleDeleteReminder(item.id)}
                                        >
                                            <Trash className="w-4 h-4 text-white" />
                                        </Button>
                                    </TooltipTrigger>

                                    {/* Botão Excluir lembrete */}
                                    <TooltipContent>
                                        Excluir lembrete
                                    </TooltipContent>
                                </Tooltip>
                            </article>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}