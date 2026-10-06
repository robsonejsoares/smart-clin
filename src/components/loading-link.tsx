"use client"

import Link, { type LinkProps } from "next/link"
import { createPortal } from "react-dom"
import SmartClinLoader from "@/components/smart-clin-loader"
import { useState, type MouseEvent, type ReactNode, type AnchorHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

interface LoadingLinkProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
    children: ReactNode
    className?: string

}

export function LoadingLink({
    children,
    className,
    onClick,
    ...props
}: LoadingLinkProps) {
    const [loading, setLoading] = useState(false)

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
        onClick?.(event)

        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return
        }

        setLoading(true)
    }

    return (<>
<Link
            {...props}
            onClick={handleClick}
            aria-busy={loading}
            aria-disabled={loading}
            tabIndex={loading ? -1 : undefined}
            className={cn(
                "inline-flex items-center justify-center gap-2",
                loading && "pointer-events-none",
                className
            )}
        >
            {children}
        </Link>
{loading && typeof document !== "undefined" &&
 createPortal(<div className="fixed inset-0 z-[90] animate-in fade-in duration-300"><SmartClinLoader /></div>, document.body)}
</>)
}