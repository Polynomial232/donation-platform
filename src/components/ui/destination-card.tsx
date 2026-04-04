import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag: string;
  stats: string;
  subtitle?: string;
  themeColor: string; // e.g., "150 50% 25%" for a deep green
  onClick?: () => void;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  (
    { className, imageUrl, location, flag, stats, subtitle, themeColor, onClick, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={
          {
            // @ts-ignore - CSS custom properties are valid
            "--theme-color": themeColor,
          } as React.CSSProperties
        }
        className={cn("group w-full h-full cursor-pointer", className)}
        onClick={onClick}
        {...props}
      >
        <div
          className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg 
                     transition-all duration-500 ease-in-out 
                     group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)] active:scale-[0.98]"
          aria-label={`Select ${location} as primary`}
          style={{
            boxShadow: `0 0 40px -15px hsl(var(--theme-color) / 0.5)`,
          }}
        >
          {/* Background Image with Parallax Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center 
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Themed Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 1) 0%, hsl(var(--theme-color) / 0.8) 35%, transparent 85%)`,
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-6 text-white">
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {location} <span className="text-xl ml-1 not-italic">{flag}</span>
              </h3>
              {subtitle && (
                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest leading-none truncate">
                  {subtitle}
                </p>
              )}
              <p className="text-[11px] text-white/80 font-black tracking-widest leading-none pt-1">
                {stats}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
