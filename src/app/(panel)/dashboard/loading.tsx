'use client';

import React from "react";

interface SmartClinLoaderProps {
    message?: string;
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
                bg-white/80 backdrop-blur-sm
            `}
            role="status"
            aria-live="polite"
            aria-label={message}
        >

            <div className="relative flex items-center justify-center mb-5">
                <div
                    aria-hidden="true"
                    className="absolute -inset-8 rounded-full bg-gradient-to-r from-teal-400/20 via-emerald-400/15 to-indigo-500/20 blur-2xl animate-pulse [animation-duration:4s]"
                />

                <div
                    className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36"
                    aria-hidden="true"
                >
                    <div className="absolute inset-2 rounded-full bg-teal-400/10 blur-xl animate-pulse [animation-duration:4s]" />

                    <div className="absolute inset-0 rounded-full border border-dashed border-emerald-400/40 animate-spin [animation-duration:18s]" />

                    <div className="absolute inset-2 rounded-full border border-teal-500/40 border-b-transparent border-t-transparent animate-[spin_12s_linear_infinite_reverse]" />

                    <div className="absolute inset-5 rounded-full border border-indigo-500/50 border-l-transparent animate-[spin_5s_cubic-bezier(0.4,0,0.6,1)_infinite]" />

                    <div className="absolute inset-0 animate-spin [animation-duration:7s]">
                        <div className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                    </div>

                    <div className="absolute inset-0 animate-[spin_6s_linear_infinite_reverse]">
                        <div className="absolute bottom-1.5 right-3 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                    </div>

                    <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 opacity-20 animate-ping [animation-duration:3s]" />

                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-teal-200/80 bg-white shadow-lg shadow-teal-900/10 backdrop-blur-md overflow-hidden p-1 animate-pulse [animation-duration:3s]">
                        <img
                            src="/logo-smart-clin.png"
                            alt="Smart Clin Logo"
                            className="h-full w-full object-contain rounded-full scale-105"
                        />
                    </div>
                </div>
            </div>

            <div className="relative z-10 space-y-1 px-4 text-center">
                <p className="text-xs font-medium tracking-wide text-slate-600 animate-pulse [animation-duration:2.5s]">
                    {message}
                </p>
            </div>

            <div
                aria-hidden="true"
                className="relative z-10 mt-5 h-1 w-36 overflow-hidden rounded-full bg-slate-200/80 shadow-inner"
            >
                <div
                    className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                    style={{
                        animation: 'shimmerLoad 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                />
            </div>

            <div aria-hidden="true" className="relative z-10 mt-3 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                <span className="h-1 w-1 rounded-full bg-teal-500 animate-pulse [animation-delay:300ms]" />
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse [animation-delay:600ms]" />
            </div>

            <style jsx>{`
                @keyframes shimmerLoad {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }
            `}</style>
        </div>
    );
}