"use client"

import { useEffect, useSyncExternalStore } from "react"
import {
    AlertTriangle, BellOff, BellPlus, CalendarCheck, CalendarX, CheckCircle2, Lock,
    MailWarning, Stethoscope, Trash2, UserCheck, X, XCircle, type LucideIcon,
} from "lucide-react"
import { dismissNotice, getNotice, subscribeNotice, type NoticeIcon, type NoticeTone } from "@/lib/notify"

const ICONS: Record<NoticeIcon, LucideIcon> = {
    check: CheckCircle2, trash: Trash2, "calendar-check": CalendarCheck, "calendar-x": CalendarX,
    bell: BellPlus, "bell-off": BellOff, stethoscope: Stethoscope, "user-check": UserCheck,
    alert: AlertTriangle, "x-circle": XCircle, "mail-warning": MailWarning, lock: Lock,
}

const TONES: Record<NoticeTone, { btn: string; text: string; box: string; ping: string; border: string }> = {
    primary: { btn: "bg-[#252579] hover:bg-[#1f1f66] hover:shadow-[#252579]/20", text: "text-[#252579]", box: "border-[#252579]/15 bg-[#252579]/[0.07]", ping: "bg-[#252579]/15", border: "border-[#252579]/15" },
    danger: { btn: "bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/25", text: "text-red-600", box: "border-red-500/20 bg-red-500/[0.07]", ping: "bg-red-500/15", border: "border-red-500/20" },
    orange: { btn: "bg-amber-400 hover:bg-amber-500 hover:shadow-amber-400/30", text: "text-amber-500", box: "border-amber-400/30 bg-amber-400/[0.12]", ping: "bg-amber-400/20", border: "border-amber-400/30" },
    warning: { btn: "bg-amber-400 hover:bg-amber-500 hover:shadow-amber-400/30", text: "text-amber-500", box: "border-amber-400/30 bg-amber-400/[0.12]", ping: "bg-amber-400/20", border: "border-amber-400/30" },
}


export function NoticeCenter() {
    const notice = useSyncExternalStore(subscribeNotice, getNotice, () => null)

    useEffect(() => {
        if (!notice) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismissNotice()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [notice])

    if (!notice) return null
    const c = TONES[notice.tone]
    const Icon = ICONS[notice.icon]
    

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px] animate-in fade-in duration-300"
            onClick={dismissNotice}
        >
            <div
                key={notice.id}
                role="alert"
                aria-live="assertive"
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-sm overflow-hidden rounded-xl border ${c.border} bg-background px-6 pb-6 pt-9 text-center shadow-2xl animate-in zoom-in-95 fade-in duration-500`}
            >
                <button
                    type="button"
                    onClick={dismissNotice}
                    aria-label="Fechar"
                    className="absolute right-4 top-4 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25"
                >
                    <X className="h-4 w-4" />
                </button>
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
                    <span className={`absolute inset-0 animate-ping rounded-full ${c.ping} scale-90 [animation-duration:2.2s]`} />
                    <span className={`relative flex h-16 w-16 items-center justify-center rounded-full border ${c.box} ${c.text}`}>
                        <Icon className="h-7 w-7" />
                    </span>
                </span>
                <h2 className="mt-6 text-base font-semibold tracking-tight text-foreground">{notice.message || notice.title}</h2>
                <div className="mt-6 flex h-11 w-full justify-center">
                    {(
                    <button
                        type="button"
                        onClick={dismissNotice}
                        className={`h-11 w-full cursor-pointer rounded-md border-0 px-8 text-sm font-semibold text-white shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252579]/25 focus-visible:ring-offset-2 ${c.btn}`}
                    >
                        Fechar
                    </button>
                )}</div>
            </div>
        </div>
    )
}
