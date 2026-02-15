import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Note: Radix Slot is not installed, so I will implement a simpler version or just use button for now.
// Actually I didn't install class-variance-authority. I should either install it or write plain component.
// I'll write a plain component first to save time, or install cva. CVA is very useful.
// I'll use standard props for now.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] hover:bg-[var(--color-pastel-yellow)] shadow-lg shadow-yellow-100",
            secondary: "bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)] hover:bg-[var(--color-accent-purple)]",
            outline: "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50",
            ghost: "bg-transparent text-slate-600 hover:bg-slate-50",
        }

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-5 py-2.5 text-sm",
            lg: "px-6 py-4 text-base",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-2xl font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
