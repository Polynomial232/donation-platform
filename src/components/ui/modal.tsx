"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className={cn("bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200", className)}>
                {title ? (
                    <div className="bg-[var(--color-pastel-purple)] p-5 text-center relative">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-1.5 rounded-full text-[var(--color-deep-purple)] transition-colors"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                        <h3 className="font-extrabold text-[var(--color-deep-purple)] text-lg">{title}</h3>
                    </div>
                ) : (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-20 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full text-slate-500 transition-colors"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>
                )}
                <div className={cn("p-6", title ? "" : "pt-12")}>
                    {children}
                </div>
            </div>
        </div>
    );
}
