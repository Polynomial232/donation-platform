"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "error" | "warning";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
}

interface ToasterProps {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  position?: Position;
  actions?: ActionButton;
  onDismiss?: () => void;
  highlightTitle?: boolean;
}

export interface ToasterRef {
  show: (props: ToasterProps) => void;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-white border-slate-100 text-slate-900",
  success: "bg-white border-green-600/50",
  error: "bg-white border-red-600/50",
  warning: "bg-white border-amber-600/50",
};

const titleColor: Record<Variant, string> = {
  default: "text-slate-900",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600",
  warning: "text-amber-600 dark:text-amber-400",
};

const iconColor: Record<Variant, string> = {
  default: "text-slate-400",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600",
  warning: "text-amber-600 dark:text-amber-400",
};

const variantIcons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

const Toaster = forwardRef<ToasterRef, { defaultPosition?: Position }>(
  ({ defaultPosition = "bottom-right" }, ref) => {
    const toastReference = useRef<ReturnType<typeof sonnerToast.custom> | null>(null);

    useImperativeHandle(ref, () => ({
      show({
        title,
        message,
        variant = "default",
        duration = 4000,
        position = defaultPosition,
        actions,
        onDismiss,
        highlightTitle,
      }) {
        const Icon = variantIcons[variant];

        toastReference.current = sonnerToast.custom(
          (toastId) => (
            <motion.div
              variants={toastAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "flex items-center justify-between w-full max-w-xs p-3 rounded-2xl border shadow-lg backdrop-blur-md",
                variantStyles[variant]
              )}
            >
              <div className="flex items-start gap-2">
                <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", iconColor[variant])} />
                <div className="space-y-0.5">
                  {title && (
                    <h3
                      className={cn(
                        "text-xs font-bold leading-none",
                        titleColor[variant],
                        highlightTitle && titleColor["success"] // override for meeting case
                      )}
                    >
                      {title}
                    </h3>
                  )}
                  <p className="text-xs text-slate-500 font-medium">{message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {actions?.label && (
                  <Button
                    variant={actions.variant === "ghost" ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => {
                      actions.onClick();
                      sonnerToast.dismiss(toastId);
                    }}
                    className={cn(
                      "cursor-pointer h-7 text-[10px] px-2 rounded-lg",
                      variant === "success"
                        ? "text-green-600 border-green-600 hover:bg-green-600/10"
                        : variant === "error"
                          ? "text-red-500 border-red-500 hover:bg-red-500/10"
                          : variant === "warning"
                            ? "text-amber-600 border-amber-600 hover:bg-amber-600/10"
                            : "text-slate-900 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {actions.label}
                  </Button>
                )}

                <button
                  onClick={() => {
                    sonnerToast.dismiss(toastId);
                    onDismiss?.();
                  }}
                  className="rounded-full p-1 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3 w-3 text-slate-400" />
                </button>
              </div>
            </motion.div>
          ),
          { duration, position }
        );
      },
    }));

    return (
      <SonnerToaster
        position={defaultPosition}
        toastOptions={{ unstyled: true, className: "flex justify-end" }}
      />
    );
  }
);

Toaster.displayName = "Toaster";

export default Toaster;
