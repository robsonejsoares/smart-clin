"use client"

import { toast } from "sonner"
import { LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function ButtonCopyLink({ userId }: { userId: string }) {
    async function handleCopyLink() {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/clinica/${userId}`
        )
        toast.success("Link copiado com sucesso!", {
            closeButton: false,
        })
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyLink}
                    aria-label="Copiar link da clínica"
                    className="group relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg !border !border-emerald-500/40 !bg-gradient-to-r !from-emerald-800 !to-[#252579] !text-white shadow-[0_4px_14px_rgba(16,185,129,0.25)] transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:!border-emerald-400 hover:!from-emerald-700 hover:!to-[#2f2f8e] hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)] active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:ring-offset-2"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 blur-[2px] transition-[left,opacity] duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100"
                    />

                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-lg border border-white/0 transition-[border-color,box-shadow] duration-300 ease-out group-hover:border-white/20 group-hover:shadow-[inset_0_0_12px_rgba(255,255,255,0.08)]"
                    />

                    <LinkIcon className="relative z-10 h-4 w-4 text-white/95 transition-[transform,filter] duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:drop-shadow-[0_2px_5px_rgba(255,255,255,0.20)]" />
                </Button>
            </TooltipTrigger>

            <TooltipContent
                side="bottom"
                className="rounded-lg border border-border/60 bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
            >
                Copiar link
            </TooltipContent>
        </Tooltip>
    )
}