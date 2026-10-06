"use client"

import { AlertTriangle, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Service } from "@/generated/prisma/client"
import { formatCurrency } from "@/lib/formatCurrency"

interface DialogDeleteServiceProps {
    service: Service | null
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export function DialogDeleteService({
    service,
    isOpen,
    onClose,
    onConfirm,
    loading,
}: DialogDeleteServiceProps) {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open && !loading) {
                    onClose()
                }
            }}
        >
            {/* Teste com rounded-md para dar um arredondamento bem visível e moderno */}
            <DialogContent className="group/modal max-w-md overflow-hidden rounded-xl border-border/70 p-0">
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
                    <DialogTitle className="flex items-center gap-3 text-foreground">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-300 ease-out group-hover/modal:scale-105 group-hover/modal:border-rose-500/30 group-hover/modal:bg-rose-500/15 group-hover/modal:shadow-[0_4px_12px_rgba(244,63,94,0.12)]">
                            <AlertTriangle
                                className="smartclin-alert-icon h-4 w-4 text-rose-600 transition-transform duration-300 ease-out group-hover/modal:scale-110 group-hover/modal:-rotate-3"
                                style={{
                                    animation: "smartclin-alert-pulse 3s ease-in-out infinite",
                                }}
                            />
                        </div>
                        <span>Excluir Serviço</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    <div className="relative overflow-hidden rounded-md border border-rose-500/20 bg-gradient-to-br from-rose-500/[0.04] via-white to-rose-500/[0.02] p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-rose-500/40 hover:shadow-xl">
                        <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

                        <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                            Tem certeza que deseja excluir permanentemente o serviço abaixo?
                        </p>

                        {service && (
                            <div className="mt-3">
                                <div className="group/card relative flex items-center gap-3 rounded-md border border-rose-500/15 bg-white/90 p-3 shadow-xs transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/30 hover:bg-white hover:shadow-md">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-rose-500/25 bg-rose-500/10 text-rose-600 shadow-sm transition-transform duration-300 group-hover/card:rotate-6">
                                        <Trash2 className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-rose-600/80">Detalhes do Serviço</span>
                                        <div className="flex items-center justify-between gap-2 mt-0.5">
                                            <span className="truncate text-xs font-bold text-[#17172f]">
                                                {service.name}
                                            </span>
                                            <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                                                {formatCurrency(service.price / 100)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-xs font-medium text-muted-foreground/80 px-1">
                        Esta ação não poderá ser desfeita.
                    </p>
                </div>

                <div className="border-t border-border/60 bg-muted/[0.16] px-6 py-4 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="h-10 cursor-pointer rounded-md border-border/70 bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all focus-visible:ring-2 focus-visible:ring-[#252579]/25"
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="h-10 cursor-pointer rounded-md bg-rose-600 px-4 text-xs font-semibold text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-rose-500/30"
                    >
                        Confirmar Exclusão
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
