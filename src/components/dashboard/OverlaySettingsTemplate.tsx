"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Check, Copy, Sliders, Maximize2, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OverlaySettingsTemplateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: string;
  previewContent: React.ReactNode;
  settingsContent?: React.ReactNode;
  extraActions?: React.ReactNode;
  children?: React.ReactNode;
  layout?: "split" | "stacked";
}

export default function OverlaySettingsTemplate({
  title,
  description,
  icon,
  type,
  previewContent,
  settingsContent,
  extraActions,
  children,
  layout = "split",
}: OverlaySettingsTemplateProps) {
  const streamKey = "sk_live_123456789"; // Mock
  const overlayUrl =
    typeof window !== "undefined" ? `${window.location.origin}/overlay/${streamKey}/${type}` : "";
  const displayUrl =
    typeof window !== "undefined" ? `${window.location.origin}/overlay/****/${type}` : "";
  const [copied, setCopied] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isMiniClosed, setIsMiniClosed] = useState(false);
  const [miniWidth, setMiniWidth] = useState(300);
  const [miniHeight, setMiniHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [mainHeight, setMainHeight] = useState(400);
  const [isMainResizing, setIsMainResizing] = useState(false);
  const [scale, setScale] = useState(1);
  const mainResizeRef = useRef<{ y: number; h: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    // Default heights based on type for better fit
    const defaults: Record<string, number> = {
      goal: 180,
      milestone: 650,
      qr: 480,
      "running-text": 100,
      leaderboard: 500,
    };

    setMainHeight(defaults[type] || 400);

    // Auto-scale based on type
    if (type === "milestone") setScale(0.8);
    else if (type === "qr") setScale(1.1);
    else if (type === "goal") setScale(1.2);
    else setScale(1);
  }, [type]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPreviewVisible(entry.isIntersecting);
        if (entry.isIntersecting) setIsMiniClosed(false);
      },
      { threshold: 0.5 }
    );

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Combined Resize handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Mini Preview Resize
      if (isResizing && resizeRef.current) {
        const deltaX = resizeRef.current.x - e.clientX;
        const deltaY = resizeRef.current.y - e.clientY;
        const newWidth = Math.max(180, Math.min(600, resizeRef.current.w + deltaX));
        const newHeight = Math.max(120, Math.min(450, resizeRef.current.h + deltaY));
        setMiniWidth(newWidth);
        setMiniHeight(newHeight);
      }

      // Main Preview Height Resize
      if (isMainResizing && mainResizeRef.current) {
        const deltaY = e.clientY - mainResizeRef.current.y;
        const newHeight = Math.max(120, Math.min(1200, mainResizeRef.current.h + deltaY));
        setMainHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsMainResizing(false);
      document.body.style.cursor = "default";
    };

    if (isResizing || isMainResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      if (isResizing) document.body.style.cursor = "nw-resize";
      if (isMainResizing) document.body.style.cursor = "ns-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isMainResizing]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: miniWidth,
      h: miniHeight,
    };
  };

  const startMainResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMainResizing(true);
    mainResizeRef.current = {
      y: e.clientY,
      h: mainHeight,
    };
  };

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Mini Floating Preview */}
      <AnimatePresence>
        {!isPreviewVisible && !isMiniClosed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            style={{ width: miniWidth, height: miniHeight }}
            className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-2 border-[var(--color-primary)] overflow-hidden flex flex-col group transition-shadow hover:shadow-[0_25px_60px_rgba(0,0,0,0.3)]"
          >
            {/* Resize Handle - Top Left */}
            <div
              onMouseDown={startResizing}
              className="absolute top-0 left-0 w-8 h-8 cursor-nw-resize z-[60] flex items-center justify-center group/resize"
            >
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover/resize:scale-150 group-hover/resize:bg-[var(--color-primary)] transition-all" />
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-slate-200 rounded-tl-sm group-hover/resize:border-[var(--color-primary)]" />
            </div>

            <div className="px-3 py-2 border-b border-slate-50 flex justify-between items-center bg-white select-none relative z-50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={scrollToPreview}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
                  title="Show Main Preview"
                >
                  <Maximize2 size={12} />
                </button>
                <button
                  onClick={() => setIsMiniClosed(true)}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 relative flex items-center justify-center overflow-hidden">
              {/* Checkerboard Background */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                  backgroundSize: `10px 10px`,
                  backgroundPosition: `0 0, 0 5px, 5px -5px, -5px 0px`,
                }}
              />
              <div className="flex items-center justify-center p-2 w-full h-full pointer-events-none origin-center">
                <div
                  style={{
                    transform: `scale(${Math.min(miniWidth / 600, miniHeight / 400) * 1.5})`,
                  }}
                  className="transition-transform duration-200"
                >
                  {previewContent}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/overlay"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="text-[var(--color-deep-purple)]">{icon}</span>
            {title}
          </h2>
          <p className="text-slate-500 font-medium">{description}</p>
        </div>
      </div>

      <div
        className={cn(
          "gap-8",
          layout === "split" ? "grid grid-cols-1 lg:grid-cols-3" : "flex flex-col"
        )}
      >
        {/* Left Column: Preview & URL */}
        <div className={cn("space-y-6", layout === "split" ? "lg:col-span-2" : "w-full")}>
          {/* URL Section */}
          <Card className="p-6 border-none shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-[var(--color-accent-yellow)] rounded-full" /> Overlay URL
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 truncate relative group">
                {displayUrl}
              </div>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Use this URL as a Browser Source in OBS, Streamlabs, or other streaming software.
            </p>
          </Card>

          {/* Preview Section */}
          <div ref={previewRef}>
            <Card className="p-0 border-none shadow-sm overflow-hidden flex flex-col relative group/main">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-400 rounded-full" /> Preview
                  </h3>
                  <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Zoom
                    </span>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-deep-purple)]"
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-500 w-8 text-center">
                      {Math.round(scale * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[10px] font-mono font-bold uppercase">
                    <span>Flex</span>
                    <ArrowRight size={10} />
                    <span className="text-slate-900">{Math.round(mainHeight)}px</span>
                  </div>
                  {extraActions}
                </div>
              </div>
              <div
                className={cn(
                  "bg-[url('/img/transparent-grid.png')] bg-repeat relative flex items-center justify-center overflow-hidden",
                  type === "running-text" ? "items-end pb-8" : ""
                )}
                style={{ height: mainHeight }}
              >
                {/* Checkerboard Pattern CSS fallback */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                    backgroundSize: `20px 20px`,
                    backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`,
                  }}
                />

                <div
                  className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-200"
                  style={{ transform: `scale(${scale})` }}
                >
                  {previewContent}
                </div>

                {/* Vertical Resize Handle */}
                <div
                  onMouseDown={startMainResizing}
                  className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center hover:bg-blue-500/20 transition-all group/handle z-20"
                >
                  <div className="w-12 h-1 bg-slate-200 rounded-full group-hover/handle:bg-blue-500 group-hover/handle:w-24 transition-all" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className={cn("space-y-6", layout === "split" ? "" : "w-full")}>
          <Card
            className={cn(
              "p-6 border-none shadow-sm space-y-6",
              layout === "split" ? "h-fit sticky top-24" : ""
            )}
          >
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Sliders size={20} /> Settings
            </h3>

            {settingsContent ? (
              settingsContent
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="h-10 w-10 rounded-lg cursor-pointer border border-slate-200"
                      defaultValue="#6B21A8"
                    />
                    <span className="text-xs font-mono text-slate-500">#6B21A8</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="h-10 w-10 rounded-lg cursor-pointer border border-slate-200"
                      defaultValue="#FDE047"
                    />
                    <span className="text-xs font-mono text-slate-500">#FDE047</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Animation Duration (s)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      defaultValue="0.5"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium pr-8"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      s
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Duration for entry/exit animations.</p>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <Button className="w-full">Save Changes</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      {children}
    </div>
  );
}
