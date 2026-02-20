import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";

interface GoalProps {
  title: string;
  current: number;
  target: number;
  currency?: string;
  color?: string;
  iconUrl?: string;
  showAmounts?: boolean;
}

export function Goal({
  title,
  current,
  target,
  currency = "IDR",
  iconUrl,
  showAmounts = true,
}: GoalProps) {
  const percentage = Math.max(0, (current / target) * 100);

  const formatCurrency = (val: number) => {
    return currency + " " + val.toLocaleString("id-ID");
  };

  return (
    <div className="flex flex-col items-end w-fit font-sans select-none">
      <div className="relative flex items-center h-[52px] bg-[#f3e8ff] rounded-full pr-6 pl-16 shadow-lg shadow-purple-500/5 overflow-hidden min-w-[460px]">
        {/* Progress Fill Background */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="absolute left-0 top-0 bottom-0 bg-[#7c3aed]/15 z-0"
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Left Icon Section */}
        <div className="absolute left-0 w-[64px] h-[64px] bg-white rounded-full flex items-center justify-center -ml-2 border-[4px] border-[#f3e8ff] shadow-md z-30 overflow-hidden">
          <div className="text-[#7c3aed] w-full h-full flex items-center justify-center p-2">
            {iconUrl ? (
              <img src={iconUrl} alt="icon" className="w-full h-full object-contain" />
            ) : (
              <Flower2 size={32} fill="currentColor" />
            )}
          </div>
        </div>

        {/* Title Section (Yellow) */}
        <div className="absolute left-10 h-full bg-[#fde047] pl-8 pr-4 flex items-center z-20 rounded-l-none rounded-r-2xl min-w-[140px]">
          <span className="text-[#5b21b6] font-extrabold text-xs uppercase leading-tight tracking-tighter truncate max-w-[120px]">
            {title}
          </span>
        </div>

        {/* Amount Progress Area */}
        <div className="relative flex items-center gap-1.5 ml-[140px] z-10">
          {showAmounts && (
            <>
              <span className="text-[#7c3aed] font-extrabold text-sm whitespace-nowrap">
                {formatCurrency(current)}
              </span>
              <span className="text-[#d8b4fe] font-bold text-sm">/</span>
              <span className="text-[#7c3aed] font-extrabold text-sm whitespace-nowrap">
                {formatCurrency(target)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Percentage Text Underneath */}
      <div className="mt-2 mr-6 text-[#d1d5db] font-extrabold text-[10px] tracking-[0.2em] uppercase">
        {Math.round(percentage)}% COMPLETED
      </div>
    </div>
  );
}
