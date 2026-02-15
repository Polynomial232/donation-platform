"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // Need to install framer-motion or use CSS animations. I'll use CSS for now to avoid extra deps if not requested, but Framer Motion is standard for React animations.
// Actually, simple CSS animations are better for performance in OBS if possible, but React Transition Group or similar is good.
// I'll stick to simple conditional rendering with CSS classes for now to keep it lightweight, or install framer-motion if I want to impress.
// The user asked for "modern, beautiful". I will use standard CSS animations for now.

export default function OverlayPage() {
    const [alert, setAlert] = useState<{
        name: string;
        amount: number;
        message: string;
        mediaUrl?: string;
        type: "donation" | "mediashare";
    } | null>({
        name: "Budi01",
        amount: 20000,
        message: "Bang sapa gw dong...",
        type: "donation",
    });

    // Simulator for demo purposes
    useEffect(() => {
        const timer = setInterval(() => {
            // Toggle alert visibility for demo
            setAlert((prev) => prev ? null : {
                name: "Siti_G",
                amount: 50000,
                message: "Request lagu galau",
                type: "donation"
            });
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (!alert) return null;

    return (
        <div className="w-screen h-screen overflow-hidden bg-transparent flex flex-col items-center justify-center p-10">
            {/* Container for the alert */}
            <div className={cn(
                "relative bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center max-w-md w-full animate-in slide-in-from-bottom-10 fade-in duration-500 border-4 border-[var(--color-accent-yellow)]"
            )}>
                {/* Image / GIF */}
                <div className="w-full h-48 bg-slate-100 rounded-2xl overflow-hidden relative">
                    <img
                        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2J5cnZ5eG15Y2J5cnZ5eG15Y2J5cnZ5eG15Y2J5cnZ5eGwzMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlHFRbmaZtBRhXG/giphy.gif"
                        alt="Alert GIF"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-[var(--color-deep-purple)]">
                        <span className="text-slate-800">{alert.name}</span> donated <span className="text-[var(--color-accent-purple)]">Rp {alert.amount.toLocaleString()}</span>!
                    </h1>
                    <p className="text-lg font-bold text-slate-600 font-sans">"{alert.message}"</p>
                </div>
            </div>
        </div>
    );
}
