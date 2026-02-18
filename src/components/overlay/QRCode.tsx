import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

interface QRProps {
  data: string;
  label?: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  logoSrc?: string;
  logoPadding?: number; // White space around logo
  gradientStart?: string;
  gradientEnd?: string;
}

export function QRCodeOverlay({
  data,
  label = "Scan to Donate",
  size = 180,
  fgColor = "#1e1b4b", // Default dark purple/indigo
  bgColor = "#ffffff",
  logoSrc = "https://placehold.co/100x100/png?text=💸", // Default placeholder
  logoPadding = 2,
  gradientStart,
  gradientEnd
}: QRProps) {

  const hasGradient = gradientStart && gradientEnd;
  const qrFgColor = hasGradient ? "#000000" : fgColor; // Base must be black for lighten blend to work

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md p-4 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center gap-4 w-fit border border-white/40 ring-1 ring-black/5"
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* QR Code Container with nice padding */}
      <div className="bg-white p-2 rounded-xl shadow-inner border border-slate-100 relative overflow-hidden group">
        <QRCodeCanvas
          value={data}
          size={size}
          fgColor={qrFgColor}
          bgColor={bgColor}
          imageSettings={logoSrc ? {
            src: logoSrc,
            x: undefined,
            y: undefined,
            height: size * 0.25,
            width: size * 0.25,
            excavate: true, // Dig out the QR modules behind the logo
          } : undefined}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />

        {/* Gradient Overlay for "Two-Tone" Effect */}
        {hasGradient && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-lighten"
            style={{
              background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`
            }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <div className="text-center pb-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-0.5">SUPPORT STREAM</p>
          <p className="text-sm font-extrabold text-slate-800 tracking-tight">{label}</p>
        </div>
      )}
    </motion.div>
  );
}
