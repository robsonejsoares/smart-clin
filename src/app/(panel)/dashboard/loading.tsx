'use client';

import React from "react";

interface SmartClinLoaderProps {
    /** Mensagem customizável opcional (padrão: "Carregando...") */
    message?: string;
    /** Se verdadeiro, ocupa o ecrã inteiro (fixed). Se falso, preenche o contentor pai (absolute/relative). */
    fullScreen?: boolean;
}

export default function SmartClinLoader({
    message = "Carregando...",
    fullScreen = true,
}: SmartClinLoaderProps) {
    return (
        <div
            className={`
                ${fullScreen ? "fixed inset-0 z-50" : "absolute inset-0"}
                flex flex-col items-center justify-center
                overflow-hidden select-none
                bg-gradient-to-br from-slate-50 via-teal-50/20 to-indigo-50/20
                backdrop-blur-sm
            `}
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            {/* ================================================================
            1. ATMOSFERA DE FUNDO (Suave e Discreta)
            ================================================================ */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-400/10 blur-[90px] animate-pulse [animation-duration:5s]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-400/10 blur-[90px] animate-pulse [animation-duration:6s]"
            />

            {/* ================================================================
            2. PARTÍCULAS DE LUZ SUAVES
            ================================================================ */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute left-[22%] top-[28%] h-1 w-1 rounded-full bg-teal-400/40 shadow-[0_0_8px_rgba(45,212,191,0.4)] animate-pulse" />
                <span className="absolute left-[78%] top-[32%] h-1 w-1 rounded-full bg-indigo-400/40 shadow-[0_0_8px_rgba(129,140,248,0.4)] animate-pulse [animation-delay:800ms]" />
                <span className="absolute left-[25%] top-[72%] h-1 w-1 rounded-full bg-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.4)] animate-pulse [animation-delay:1200ms]" />
            </div>

            {/* ================================================================
            3. NÚCLEO TECNOLÓGICO ORBITAL COM A LOGO AMPLIADA
            ================================================================ */}
            <div
                className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36 mb-5"
                aria-hidden="true"
            >
                {/* Atmosfera do núcleo */}
                <div className="absolute inset-2 rounded-full bg-teal-400/5 blur-xl animate-pulse [animation-duration:4s]" />

                {/* Anel externo — Esmeralda Suave */}
                <div className="absolute inset-0 rounded-full border border-dashed border-emerald-400/30 animate-spin [animation-duration:18s]" />

                {/* Anel intermediário — Teal */}
                <div className="absolute inset-2 rounded-full border border-teal-500/30 border-b-transparent border-t-transparent animate-[spin_12s_linear_infinite_reverse]" />

                {/* Anel interno — Indigo */}
                <div className="absolute inset-5 rounded-full border border-indigo-500/40 border-l-transparent animate-[spin_5s_cubic-bezier(0.4,0,0.6,1)_infinite]" />

                {/* Satélite 1 */}
                <div className="absolute inset-0 animate-spin [animation-duration:7s]">
                    <div className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                </div>

                {/* Satélite 2 */}
                <div className="absolute inset-0 animate-[spin_6s_linear_infinite_reverse]">
                    <div className="absolute bottom-1.5 right-3 h-2 w-2 rounded-full bg-indigo-500/80 shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
                </div>

                {/* Pulso Central */}
                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 opacity-15 animate-ping [animation-duration:3s]" />

                {/* NÚCLEO CENTRAL: Logo maior preenchendo o círculo sem borda quadrada */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-teal-200/80 bg-white/95 shadow-lg shadow-teal-900/10 backdrop-blur-md overflow-hidden p-1 animate-pulse [animation-duration:3s]">
                    <img
                        src="/logo-smart-clin.png"
                        alt="Smart Clin Logo"
                        className="h-full w-full object-contain rounded-full scale-105"
                    />
                </div>
            </div>

            {/* ================================================================
            4. MENSAGEM
            ================================================================ */}
            <div className="relative z-10 space-y-1 px-4 text-center">
                <p className="text-xs font-medium tracking-wide text-slate-500 animate-pulse [animation-duration:2.5s]">
                    {message}
                </p>
            </div>

            {/* ================================================================
            5. INDICADOR DE PROGRESSO DISCRETO
            ================================================================ */}
            <div
                aria-hidden="true"
                className="relative z-10 mt-5 h-1 w-36 overflow-hidden rounded-full bg-slate-200/60 shadow-inner"
            >
                <div
                    className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 shadow-[0_0_8px_rgba(20,184,166,0.25)]"
                    style={{
                        animation: 'shimmerLoad 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                />
            </div>

            {/* ================================================================
            6. MICRO INDICADORES
            ================================================================ */}
            <div aria-hidden="true" className="relative z-10 mt-3 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-indigo-400/80 animate-pulse" />
                <span className="h-1 w-1 rounded-full bg-teal-400/80 animate-pulse [animation-delay:300ms]" />
                <span className="h-1 w-1 rounded-full bg-emerald-400/80 animate-pulse [animation-delay:600ms]" />
            </div>

            {/* Estilo local para animação da barra */}
            <style jsx>{`
                @keyframes shimmerLoad {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }
            `}</style>
        </div>
    );
}