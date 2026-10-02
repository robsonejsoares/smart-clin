"use client"

import { DialogContent } from "@/components/ui/dialog"
import { DialogService } from "../dialog-service"
import { Service } from "@/generated/prisma/client"

interface ModalServiceFormProps {
    isOpen: boolean
    onClose: () => void
    editingService: Service | null
}

export function ModalServiceForm({
    isOpen,
    onClose,
    editingService,
}: ModalServiceFormProps) {
    if (!isOpen) return null

    return (
        <DialogContent className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-lg h-[520px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-0 shadow-2xl backdrop-blur-xl">
            <DialogService
                closeModal={onClose}
                serviceId={editingService ? editingService.id : undefined}
                initialValues={
                    editingService
                        ? {
                            name: editingService.name,
                            price: (editingService.price / 100).toFixed(2).replace(".", ","),
                            hours: Math.floor(editingService.duration / 60).toString(),
                            minutes: (editingService.duration % 60).toString(),
                        }
                        : undefined
                }
            />
        </DialogContent>
    )
}