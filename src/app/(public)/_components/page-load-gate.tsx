'use client';

import { useEffect, useState } from "react";
import SmartClinLoader from "@/components/smart-clin-loader";
import { MIN_LOADING_MS } from "@/lib/min-delay";

export function PageLoadGate() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let minElapsed = false;
        let loaded = document.readyState === "complete";
        const check = () => {
            if (minElapsed && loaded) setReady(true);
        };
        const onLoad = () => {
            loaded = true;
            check();
        };
        const timer = setTimeout(() => {
            minElapsed = true;
            check();
        }, MIN_LOADING_MS);
        if (!loaded) window.addEventListener("load", onLoad);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("load", onLoad);
        };
    }, []);

    if (ready) return null;
    return <SmartClinLoader />;
}

