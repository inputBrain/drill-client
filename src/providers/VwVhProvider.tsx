"use client";

import { useEffect } from "react";

export default function VwVhProvider() {
    useEffect(() => {
        const set = () => {
            document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`);
            document.documentElement.style.setProperty("--vw", `${window.innerWidth / 100}px`);
        };
        set();
        window.addEventListener("resize", set);
        return () => window.removeEventListener("resize", set);
    }, []);
    return null;
}
