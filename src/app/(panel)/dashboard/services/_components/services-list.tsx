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
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
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

    // Serviço que será excluído
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    // Estado de carregamento da exclusão
    const [loadingDelete, setLoadingDelete] = useState(false);

    async function handleDeleteService() {

        if (!serviceToDelete) {
            return;
        }

        setLoadingDelete(true);

        try {
            const response = await deleteService({
                serviceId: serviceToDelete.id
            });

            // Mesmo tempo do botão "Adicionando serviço..."
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (response.error) {
                toast(response.error);
                return;
            }

            toast.success(response.data);

            // Fecha a modal depois de excluir
            setServiceToDelete(null);

        } finally {
            setLoadingDelete(false);
        }
    }

    function handleEditService(service: Service) {
        setEditingService(service);
        setIsDialogOpen(true);
    }

    function handleOpenDeleteDialog(service: Service) {
        setServiceToDelete(service);
    }

    function handleCloseDeleteDialog() {
        if (loadingDelete) {
            return;
        }

        setServiceToDelete(null);
    }

    return (
        <>
            {/* Dialog de adicionar/editar serviço */}
            <Dialog
                open={isDialog}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);

                    if (!open) {
                        setEditingService(null);
                    }
                }}
            >
                <section className="mx-auto">
                    <Card>

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                            <CardTitle>
                                Serviços
                            </CardTitle>

                            {/* Botão Adicionar */}
                            <DialogTrigger asChild>
                                <Button
                                    className="bg-sky-500 text-white hover:bg-sky-600 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Plus
                                        className="h-4 w-4 shrink-0"
                                        strokeWidth={3.20}
                                    />

                                    <span>
                                        Adicionar
                                    </span>
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
                                        setIsDialogOpen(false);
                                        setEditingService(null);
                                    }}
                                    serviceId={
                                        editingService
                                            ? editingService.id
                                            : undefined
                                    }
                                    initialValues={
                                        editingService
                                            ? {
                                                name: editingService.name,
                                                price: (
                                                    editingService.price / 100
                                                )
                                                    .toFixed(2)
                                                    .replace(".", ","),
                                                hours: Math.floor(
                                                    editingService.duration / 60
                                                ).toString(),
                                                minutes: (
                                                    editingService.duration % 60
                                                ).toString(),
                                            }
                                            : undefined
                                    }
                                />
                            </DialogContent>

                        </CardHeader>

                        <CardContent>

                            <section className="space-y-4 mt-5">

                                {services.map(service => (

                                    <article
                                        key={service.id}
                                        className="flex items-center justify-between"
                                    >

                                        <div className="flex items-center space-x-2">

                                            <span className="font-medium">
                                                {service.name}
                                            </span>

                                            <span className="text-gray-500">
                                                -
                                            </span>

                                            <span className="text-gray-500">
                                                {formatCurrency(
                                                    service.price / 100
                                                )}
                                            </span>

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
                                                                onClick={() =>
                                                                    handleEditService(
                                                                        service
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>

                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            Editar serviço
                                                        </TooltipContent>

                                                    </Tooltip>


                                                    {/* Botão Excluir */}
                                                    <Tooltip>

                                                        <TooltipTrigger asChild>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 bg-red-100 hover:bg-red-200 hover:text-red-600"
                                                                onClick={() =>
                                                                    handleOpenDeleteDialog(
                                                                        service
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>

                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            Excluir serviço
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


            {/* Modal de confirmação de exclusão */}
            <Dialog
                open={!!serviceToDelete}
                onOpenChange={(open) => {
                    if (!open && !loadingDelete) {
                        setServiceToDelete(null);
                    }
                }}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Excluir serviço
                        </DialogTitle>

                        <DialogDescription>
                            Tem certeza que deseja excluir o serviço{" "}
                            <span className="font-semibold text-gray-900">
                                {serviceToDelete?.name}
                            </span>
                            ?
                            <br />
                            Essa ação não poderá ser desfeita.
                        </DialogDescription>

                    </DialogHeader>


                    <DialogFooter>

                        {/* Cancelar */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseDeleteDialog}
                            disabled={loadingDelete}
                        >
                            Cancelar
                        </Button>


                        {/* Confirmar exclusão */}
                        <Button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white disabled:hover:bg-red-400"
                            onClick={handleDeleteService}
                            disabled={loadingDelete}
                        >
                            {loadingDelete
                                ? "Excluindo serviço..."
                                : "Excluir serviço"}
                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>

        </>
    )
}