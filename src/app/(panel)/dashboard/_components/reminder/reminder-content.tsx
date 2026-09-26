"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { createReminder } from "../../_actions/create-reminder"
import { useReminderForm, ReminderFormData } from "./reminder-form"

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"

interface ReminderContentProps {
    closeDialog: () => void
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {
    const form = useReminderForm()
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(formData: ReminderFormData) {

        setLoading(true);

        const [response] = await Promise.all([
            createReminder({ description: formData.description }),
            new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        if (response.error) {
            toast.error(response.error);
            setLoading(false);
            return;
        }

        toast.success(response.data);
        router.refresh();
        closeDialog();
    }

    return (
        <div className="grid gap-4 py-4">
            <Form {...form}>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="font-semibold">Descrição:</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Descreva o lembrete..."
                                        className="max-h-52"
                                        maxLength={558}
                                    />
                                </FormControl>
                                <div className="text-right text-xs text-gray-500">
                                    {field.value.length}/558
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={loading || !form.watch("description")}
                        className="bg-sky-500 text-white hover:bg-sky-600 disabled:hover:bg-sky-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Cadastrando lembrete..."
                            : "Cadastrar Lembrete"
                        }
                    </Button>
                </form>
            </Form>
        </div>
    )
}