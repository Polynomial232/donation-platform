import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

interface QRProps {
  data: string;
  headerLabel?: string;
  footerLabel?: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  logoSrc?: string;
  logoPadding?: number;
  gradientStart?: string;
  gradientEnd?: string;
}

export function QRCodeOverlay({
  data,
  headerLabel = "SUPPORT STREAM",
  footerLabel = "Scan to Donate",
  size = 180,
  fgColor = "#1e1b4b",
  bgColor = "#ffffff",
  logoSrc,
  logoPadding = 2,
  gradientStart,
  gradientEnd,
}: QRProps) {
  const hasGradient = gradientStart && gradientEnd;
  const qrFgColor = hasGradient ? "#000000" : fgColor;

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-md p-5 rounded-[2.5rem] flex flex-col items-center gap-5 w-fit border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5"
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Header Label */}
      {headerLabel && (
        <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-[0.25em] -mb-1">
          {headerLabel}
        </p>
      )}

      {/* QR Code Container */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-100 relative overflow-hidden group shadow-inner">
        <QRCodeCanvas
          value={data}
          size={size}
          fgColor={qrFgColor}
          bgColor={bgColor}
          imageSettings={
            logoSrc
              ? {
                  src: logoSrc,
                  x: undefined,
                  y: undefined,
                  height: size * 0.22,
                  width: size * 0.22,
                  excavate: true,
                }
              : undefined
          }
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />

        {/* Gradient Overlay */}
        {hasGradient && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-lighten"
            style={{
              background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
            }}
          />
        )}
      </div>

      {/* Footer Label */}
      {footerLabel && (
        <div className="text-center px-2">
          <p className="text-[15px] font-semibold text-slate-800 tracking-tight leading-none italic uppercase">
            {footerLabel}
          </p>
        </div>
      )}
    </motion.div>
  );
}
