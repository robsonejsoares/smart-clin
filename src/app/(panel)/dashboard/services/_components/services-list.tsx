"use client"

import {
    X,
    Plus,
    Pencil,
} from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogService } from "./dialog-service";
import { Service } from "@/generated/prisma/client";
import { formatCurrency } from "@/utils/formatCurrency";
import { deleteService } from "../_actions/delete-service";

interface ServicesListProps {
    services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
    const [isDialog, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    async function handleDeleteService(serviceId: string) {
        const response = await deleteService({ serviceId: serviceId });

        if (response.error) {
            toast(response.error)
            return
        }

        toast.success(response.data)
    }

    function handleEditService(service: Service) {
        setEditingService(service);
        setIsDialogOpen(true);
    }

    return (
        <Dialog open={isDialog} onOpenChange={setIsDialogOpen}>
            <section className="mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>
                            Serviços
                        </CardTitle>

                        {/* Botão Adicionar*/}
                        <DialogTrigger asChild>
                            <Button
                                className="bg-sky-500 text-white hover:bg-sky-600 transition-colors flex items-center gap-2 text-sm font-semibold"
                            >
                                <Plus className="h-4 w-4 shrink-0" strokeWidth={3.20} />
                                <span>Adicionar</span>
                            </Button>
                        </DialogTrigger>

                        <DialogContent
                            onInteractOutside={(e) => {
                                e.preventDefault();
                                setIsDialogOpen(false);
                                setEditingService(null);
                            }}
                        >
                            <DialogService
                                closeModal={() => {
                                    setIsDialogOpen(false)
                                    setEditingService(null)
                                }}
                                serviceId={editingService ? editingService.id : undefined}
                                initialValues={editingService ? {
                                    name: editingService.name,
                                    price: (editingService.price / 100).toFixed(2).replace(".", ","),
                                    hours: Math.floor(editingService.duration / 60).toString(),
                                    minutes: (editingService.duration % 60).toString(),
                                } : undefined}
                            />
                        </DialogContent>
                    </CardHeader>
                    <CardContent>
                        <section className="space-y-4 mt-5">
                            {services.map(service => (
                                <article
                                    key={service.id}
                                    className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{service.name}</span>
                                        <span className="text-gray-500">-</span>
                                        <span className="text-gray-500">{formatCurrency((service.price / 100))}</span>
                                    </div>
                                    <div>
                                        <TooltipProvider>
                                            <div className="flex items-center gap-2">

                                                {/* Botão Editar */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900"
                                                            onClick={() => handleEditService(service)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Editar
                                                    </TooltipContent>
                                                </Tooltip>

                                                {/* Botão Excluir */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600"
                                                            onClick={() => handleDeleteService(service.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Excluir
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TooltipProvider>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </CardContent>
                </Card>
            </section>
        </Dialog>
    )
}