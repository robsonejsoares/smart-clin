"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Reminder } from "@/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"

interface ReminderListProps {

    reminder: Reminder[]

}

export function ReminderList({ reminder }: ReminderListProps) {

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl md:text-2xl font-semibold">
                        Lembretes
                    </CardTitle>

                    <Button variant="ghost" className="w-9 h-9">
                        <Plus className="w-5 h-5" />
                    </Button>
                </CardHeader>
                <CardContent>
                    {reminder.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Nenhum lembrete encontrado...
                        </p>
                    )}

                    {reminder.map((item) => (
                        <article
                            key={item.id}
                            className="flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-100 mb-2 px-2"
                        >
                            <p className="text-sm lg:text-base">{item.description}</p>

                            <Button
                                className="bg-red-500 hover:bg-red-400 shadow-none rounded-full w-7 h-7"
                                size="sm"
                            >
                                <Trash className="w-4 h-4 text-white" />
                            </Button>
                        </article>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}