export default function Loading() {
    return (<div className="flex min-h-[calc(100vh-7rem)] items-center justify-center"> <div className="flex flex-col items-center gap-4"> <div className="relative flex h-12 w-12 items-center justify-center"> <span className="absolute inset-0 rounded-full border-2 border-[#252579]/10" />


        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#252579] border-r-emerald-500" />

        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.35)]" />
    </div>

        <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-foreground">
                Carregando...
            </span>

            <span className="text-xs text-muted-foreground">
                Por favor, aguarde um momento.
            </span>
        </div>
    </div>
    </div>
    )
}
