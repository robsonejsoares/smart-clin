'use client';

interface SmartClinLoaderProps {
    message?: string;
    fullScreen?: boolean;
}

const PARTICLES = [
    { left: "12%", size: 6, delay: "0s", duration: "7s", color: "#10b981" },
    { left: "26%", size: 4, delay: "1.4s", duration: "6s", color: "#8b5cf6" },
    { left: "41%", size: 7, delay: "0.6s", duration: "8s", color: "#252579" },
    { left: "58%", size: 5, delay: "2.2s", duration: "6.5s", color: "#10b981" },
    { left: "73%", size: 6, delay: "1s", duration: "7.5s", color: "#8b5cf6" },
    { left: "88%", size: 4, delay: "2.8s", duration: "6s", color: "#252579" },
];

export default function SmartClinLoader({
    message = "Carregando...",
    fullScreen = true,
}: SmartClinLoaderProps) {
    return (
        <div
            className={`
                ${fullScreen ? "fixed inset-0 z-50 bg-white" : "absolute inset-0 bg-white/80 backdrop-blur-sm"}
                flex flex-col items-center justify-center overflow-hidden select-none
            `}
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="sc-blob-a absolute left-1/2 top-1/2 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="sc-blob-b absolute left-1/2 top-1/2 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
                {PARTICLES.map((p, i) => (
                    <span
                        key={i}
                        className="sc-particle absolute bottom-0 rounded-full"
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            background: p.color,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                        }}
                    />
                ))}
            </div>

            <div className="relative flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40" aria-hidden="true">
                <div className="sc-pulse absolute inset-6 rounded-full bg-gradient-to-tr from-emerald-400/40 to-violet-500/40" />

                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    <defs>
                        <linearGradient id="sc-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="55%" stopColor="#252579" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                    <circle
                        className="sc-dashed"
                        cx="50" cy="50" r="44"
                        fill="none" stroke="#10b981" strokeOpacity="0.5" strokeWidth="0.7" strokeDasharray="1.5 3.5"
                    />
                    <g className="sc-draw-wrap">
                        <circle
                            className="sc-draw"
                            cx="50" cy="50" r="48"
                            fill="none" stroke="url(#sc-grad)" strokeWidth="2.6" strokeLinecap="round" pathLength={100}
                        />
                    </g>
                </svg>

                <div className="sc-orbit-a absolute inset-0">
                    <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                </div>
                <div className="sc-orbit-b absolute inset-3">
                    <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
                </div>

                <div className="relative z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-white p-2 shadow-xl shadow-[#252579]/15 sm:h-28 sm:w-28">
                    <img src="/logo-smart-clin.png" alt="Smart Clin" className="sc-logo h-full w-full rounded-full object-contain" />
                </div>
            </div>

            <p className="sc-text relative mt-7 text-sm font-bold tracking-[0.3em]">
                {message.replace(/\.+$/, "").toUpperCase()}
            </p>

            <div aria-hidden="true" className="relative mt-4 h-1 w-44 overflow-hidden rounded-full bg-slate-200/80">
                <div className="sc-bar absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-emerald-400 via-[#252579] to-violet-500" />
            </div>

            <div aria-hidden="true" className="relative mt-3 flex items-center gap-1.5">
                <span className="sc-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="sc-dot h-1.5 w-1.5 rounded-full bg-[#252579]" style={{ animationDelay: "0.15s" }} />
                <span className="sc-dot h-1.5 w-1.5 rounded-full bg-violet-500" style={{ animationDelay: "0.3s" }} />
            </div>

            <style jsx>{`
                .sc-blob-a { animation: scBlobA 7s ease-in-out infinite; }
                .sc-blob-b { animation: scBlobB 9s ease-in-out infinite; }
                .sc-particle { opacity: 0; animation: scRise linear infinite; }
                .sc-pulse { animation: scPulse 2.4s ease-in-out infinite; filter: blur(14px); }
                .sc-dashed { transform-origin: 50% 50%; animation: scSpin 20s linear infinite; }
                .sc-draw-wrap { transform-origin: 50% 50%; transform: rotate(-90deg); }
                .sc-draw { stroke-dasharray: 100; stroke-dashoffset: 100; animation: scDraw 2.6s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
                .sc-orbit-a { animation: scSpin 3.2s linear infinite; }
                .sc-orbit-b { animation: scSpin 4.6s linear infinite reverse; }
                .sc-logo { animation: scLogo 2.6s ease-in-out infinite; }
                .sc-text {
                    background-image: linear-gradient(90deg, #10b981, #252579, #8b5cf6, #10b981);
                    background-size: 250% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: scFlow 3s linear infinite;
                }
                .sc-bar { animation: scBar 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .sc-dot { animation: scDot 1s ease-in-out infinite; }

                @keyframes scBlobA { 0%, 100% { transform: translate(-90%, -60%) scale(1); } 50% { transform: translate(-20%, -40%) scale(1.2); } }
                @keyframes scBlobB { 0%, 100% { transform: translate(-10%, -40%) scale(1.1); } 50% { transform: translate(-80%, -70%) scale(0.9); } }
                @keyframes scRise { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 0.5; } 100% { transform: translateY(-100vh); opacity: 0; } }
                @keyframes scPulse { 0%, 100% { transform: scale(0.85); opacity: 0.5; } 50% { transform: scale(1.15); opacity: 1; } }
                @keyframes scSpin { to { transform: rotate(360deg); } }
                @keyframes scDraw {
                    0% { stroke-dashoffset: 100; opacity: 1; }
                    70% { stroke-dashoffset: 0; opacity: 1; }
                    90% { stroke-dashoffset: 0; opacity: 0; }
                    100% { stroke-dashoffset: 100; opacity: 0; }
                }
                @keyframes scLogo { 0%, 100% { transform: scale(0.96); } 50% { transform: scale(1.04); } }
                @keyframes scFlow { to { background-position: 250% 0; } }
                @keyframes scBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
                @keyframes scDot { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-4px); opacity: 1; } }
            `}</style>
        </div>
    );
}
