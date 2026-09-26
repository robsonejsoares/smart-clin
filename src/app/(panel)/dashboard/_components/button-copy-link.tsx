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

        toast.success("Link copiado com sucesso!")
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                Copiar link
            </TooltipContent>
        </Tooltip>
    )
}