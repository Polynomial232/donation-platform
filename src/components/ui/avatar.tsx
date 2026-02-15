"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const AvatarContext = React.createContext<{
    status: "loading" | "loaded" | "error"
    setStatus: (status: "loading" | "loaded" | "error") => void
} | null>(null)

const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("error")
    // Default to error to show fallback immediately until image loads? 
    // Or default to loading? 
    // If loading, and fallback shows on loading, then it flickers.
    // Radix usually shows fallback for delayMs.
    // Let's default to "loading", and fallback shows if status != "loaded".

    return (
        <AvatarContext.Provider value={{ status, setStatus }}>
            <div
                ref={ref}
                className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            />
        </AvatarContext.Provider>
    )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt, ...props }, ref) => {
    const context = React.useContext(AvatarContext)
    const setStatus = context?.setStatus

    React.useLayoutEffect(() => {
        if (setStatus) setStatus("loading")
    }, [src, setStatus])

    return (
        <img
            ref={ref}
            src={src}
            alt={alt}
            onLoad={() => setStatus?.("loaded")}
            onError={() => setStatus?.("error")}
            className={cn("aspect-square h-full w-full", className, context?.status !== "loaded" && "hidden")}
            {...props}
        />
    )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const context = React.useContext(AvatarContext)

    if (context?.status === "loaded") {
        return null
    }

    return (
        <div
            ref={ref}
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800",
                className
            )}
            {...props}
        />
    )
})
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
