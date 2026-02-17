import { motion } from "framer-motion";
import QRCode from "react-qr-code"; // Ensure this package is installed, or rely on img URL if not. I'll use a placeholder URL if not available, but for now assuming we can fetch a QR image or just use an img tag API.
// To avoid deps issues if not installed, I'll use a public QR code API for simplicity in this demo.

interface QRProps {
  data: string;
  label?: string;
  size?: number;
}

export function QRCodeOverlay({ data, label = "Scan to Donate", size = 120 }: QRProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=000000&bgcolor=ffffff`;

  return (
    <motion.div
      className="bg-white p-3 rounded-xl shadow-lg flex flex-col items-center gap-2 w-fit border-2 border-slate-200"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="bg-white rounded-lg overflow-hidden">
        <img src={qrUrl} alt="QR Code" width={size} height={size} className="mix-blend-multiply" />
      </div>
      {label && (
        <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{label}</span>
      )}
    </motion.div>
  );
}
