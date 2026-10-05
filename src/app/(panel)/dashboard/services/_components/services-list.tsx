"use client"

import {
    X,
    Plus,
    Pencil,
    Clock3,
    Stethoscope,
} from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
} from "@/components/ui/card"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DialogService } from "./dialogs/dialog-service"
import { DialogDeleteService } from "./dialogs/dialog-delete-service"
import { Service } from "@/generated/prisma/client"
import { formatCurrency } from "@/lib/formatCurrency"
import { deleteService } from "../_actions/delete-service"

interface ServicesListProps {
    services: Service[]
}

export function ServicesList({ services }: ServicesListProps) {
    const [isDialog, setIsDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const router = useRouter()
    const sortedServices = [...services].sort((firstService, secondService) =>
        firstService.duration - secondService.duration
    )

    async function handleDeleteService() {
        if (!serviceToDelete) {
            return
        }

        setLoadingDelete(true)

        try {
            const response = await deleteService({
                serviceId: serviceToDelete.id,
            })

            await new Promise(resolve => setTimeout(resolve, 1000))

            if (!response.success) {
                toast(response.message)
                return
            }

            toast.success(response.message)
            setServiceToDelete(null)
            router.refresh()
        } finally {
            setLoadingDelete(false)
        }
    }

    function handleEditService(service: Service) {
        setEditingService(service)
        setIsDialogOpen(true)
    }

    function handleOpenDeleteDialog(service: Service) {
        setServiceToDelete(service)
    }

    function handleCloseDeleteDialog() {
        if (loadingDelete) {
            return
        }

        setServiceToDelete(null)
    }

    return (
        <>
            <Dialog
                open={isDialog}
                onOpenChange={(open) => {
                    setIsDialogOpen(open)

                    if (!open) {
                        setEditingService(null)
                    }
                }}
            >
                <div className="mx-auto w-full max-w-5xl space-y-3">
                    <Card className="group relative overflow-hidden border-border/60 bg-background/95 shadow-lg shadow-black/[0.04]">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
                        >
                            <div className="smartclin-services-line-top h-full bg-gradient-to-r from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
                        </div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px"
                        >
                            <div className="smartclin-services-line-bottom ml-auto h-full bg-gradient-to-l from-emerald-400 via-[#252579] to-violet-500 blur-[0.5px]" />
                        </div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(16,185,129,0.075),transparent_30%),radial-gradient(circle_at_8%_100%,rgba(37,37,121,0.055),transparent_34%),linear-gradient(135deg,rgba(16,185,129,0.025),transparent_42%,rgba(37,37,121,0.025))]"
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/[0.055] blur-3xl"
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-32 left-1/3 h-48 w-48 rounded-full bg-[#252579]/[0.045] blur-3xl"
                        />

                        <CardHeader className="relative z-10 flex flex-row items-center justify-between gap-5 space-y-0 px-5 py-5 md:px-6">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2.5">
                                    <span
                                        aria-hidden="true"
                                        className="relative flex h-2.5 w-2.5 shrink-0"
                                    >
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.28)]" />
                                    </span>

                                    <span className="text-[11px] font-semibold tracking-[0.04em] text-emerald-700/80">
                                        Painel de
                                    </span>
                                </div>

                                <CardTitle className="relative mt-2 w-fit max-w-full overflow-hidden text-2xl font-bold tracking-tight sm:text-3xl">
                                    <span className="relative z-10 inline-block bg-gradient-to-r from-[#252579] via-[#10b981] to-[#252579] bg-[length:300%_100%] bg-[position:0%_50%] bg-clip-text text-transparent transition-[background-position] duration-1000 ease-out group-hover:bg-[position:100%_50%]">
                                        Serviços
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[1400ms] ease-out group-hover:left-[120%] group-hover:opacity-100"
                                    />
                                </CardTitle>
                            </div>

                            <DialogTrigger asChild>
                                <Button
                                    className="group/add relative h-10 shrink-0 cursor-pointer overflow-hidden rounded-md border border-[#252579]/40 bg-gradient-to-r from-[#252579] via-[#2d2d8f] to-[#252579] bg-[length:200%_100%] bg-[position:0%_50%] px-4 font-semibold text-white shadow-[0_4px_16px_rgba(37,37,121,0.20)] transition-[background-position,border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#2d2d8f]/60 hover:bg-[position:100%_50%] hover:shadow-[0_8px_22px_rgba(37,37,121,0.28)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#252579]/30 focus-visible:ring-offset-2"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-[800ms] ease-out group-hover/add:left-[120%] group-hover/add:opacity-100"
                                    />

                                    <Plus
                                        className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover/add:rotate-90"
                                        strokeWidth={2.5}
                                    />

                                    <span className="relative z-10">
                                        Adicionar
                                    </span>
                                </Button>
                            </DialogTrigger>

                            <DialogContent
                                onInteractOutside={(e) => {
                                    e.preventDefault()
                                    setIsDialogOpen(false)
                                    setEditingService(null)
                                }}
                                className="sm:max-w-lg h-[550px] flex flex-col overflow-hidden rounded-xl border-border/70 p-0 shadow-2xl"
                            >
                                <DialogService
                                    closeModal={() => {
                                        setIsDialogOpen(false)
                                        setEditingService(null)
                                    }}
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
                        </CardHeader>
                    </Card>

                    <Card className="overflow-hidden border-border/60 bg-background/95 shadow-lg shadow-black/[0.04]">
                        <CardContent className="p-3.5 md:p-4">
                            {sortedServices.length === 0 ? (
                                <div className="flex min-h-[220px] items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/[0.12] px-6">
                                    <div className="text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-[#252579]/[0.08] text-[#252579]">
                                            <Plus className="h-5 w-5" />
                                        </div>

                                        <p className="text-sm font-semibold text-foreground">
                                            Nenhum serviço cadastrado
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Adicione um serviço para começar.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <section className="space-y-2.5">
                                    {sortedServices.map(service => (
                                        <article
                                            key={service.id}
                                            className="group flex items-center justify-between gap-4 rounded-md border border-border/60 bg-background px-4 py-3.5 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-[#252579]/15 hover:bg-[#252579]/[0.018] hover:shadow-sm"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#252579]/10 bg-[#252579]/[0.06] text-[#252579] transition-[background-color,border-color,transform,box-shadow] duration-300 group-hover:scale-105 group-hover:border-[#252579]/20 group-hover:bg-[#252579]/[0.09] group-hover:shadow-[0_4px_12px_rgba(37,37,121,0.08)]">
                                                    <Stethoscope className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-foreground lg:text-[15px]">
                                                        {service.name}
                                                    </p>

                                                    <div className="mt-1 grid grid-cols-[96px_1fr] items-center gap-2">
                                                        <span className="truncate text-sm font-medium text-muted-foreground">
                                                            {formatCurrency(
                                                                service.price / 100
                                                            )}
                                                        </span>

                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock3 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />

                                                            <span className="tabular-nums">
                                                                {Math.floor(
                                                                    service.duration / 60
                                                                ) > 0 && (
                                                                        <>
                                                                            {Math.floor(
                                                                                service.duration / 60
                                                                            )}h{" "}
                                                                        </>
                                                                    )}

                                                                {service.duration % 60 > 0 && (
                                                                    <>
                                                                        {service.duration % 60}min
                                                                    </>
                                                                )}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                <TooltipProvider>
                                                    <div className="flex items-center gap-0.5">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="group/edit h-8 w-8 cursor-pointer rounded-md text-[#252579]/70 transition-[background-color,color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#252579]/[0.07] hover:text-[#252579] hover:shadow-[0_4px_10px_rgba(37,37,121,0.08)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-1"
                                                                    onClick={() =>
                                                                        handleEditService(
                                                                            service
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="h-4 w-4 origin-center text-[#252579]/70 transition-[transform,color,filter] duration-300 ease-out group-hover/edit:-translate-y-0.5 group-hover/edit:rotate-[-6deg] group-hover/edit:scale-110 group-hover/edit:text-[#252579] group-hover/edit:drop-shadow-[0_2px_4px_rgba(37,37,121,0.20)]" />
                                                                </Button>
                                                            </TooltipTrigger>

                                                            <TooltipContent
                                                                side="top"
                                                                className="text-xs font-medium"
                                                            >
                                                                Editar serviço
                                                            </TooltipContent>
                                                        </Tooltip>

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="group/delete h-8 w-8 cursor-pointer rounded-md text-red-500/75 transition-[background-color,color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-red-500/[0.07] hover:text-red-600 hover:shadow-[0_4px_10px_rgba(239,68,68,0.08)] active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500/25 focus-visible:ring-offset-1"
                                                                    onClick={() =>
                                                                        handleOpenDeleteDialog(
                                                                            service
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="h-4 w-4 origin-center text-red-500/75 transition-[transform,color,filter] duration-300 ease-out group-hover/delete:rotate-12 group-hover/delete:scale-110 group-active/delete:rotate-90 group-hover/delete:text-red-600 group-hover/delete:drop-shadow-[0_2px_4px_rgba(239,68,68,0.18)]" />
                                                                </Button>
                                                            </TooltipTrigger>

                                                            <TooltipContent
                                                                side="top"
                                                                className="text-xs font-medium"
                                                            >
                                                                Excluir serviço
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </TooltipProvider>
                                            </div>
                                        </article>
                                    ))}
                                </section>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Dialog>

            <DialogDeleteService
                service={serviceToDelete}
                isOpen={!!serviceToDelete}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteService}
                loading={loadingDelete}
            />

            <style>{`
    .smartclin-services-line-top,
    .smartclin-services-line-bottom {
        width: 59%;
        opacity: 0.6;
        animation-duration: 10s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-fill-mode: both;
    }

    .smartclin-services-line-top {
        animation-name: smartclin-services-line-top;
    }

    .smartclin-services-line-bottom {
        animation-name: smartclin-services-line-bottom;
    }

    @keyframes smartclin-services-line-top {
        0% {
            width: 59%;
        }

        50% {
            width: 92%;
        }

        100% {
            width: 59%;
        }
    }

    @keyframes smartclin-services-line-bottom {
        0% {
            width: 59%;
        }

        50% {
            width: 92%;
        }

        100% {
            width: 59%;
        }
    }
`}</style>
        </>
    )
}
