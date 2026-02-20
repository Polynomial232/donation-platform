"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Youtube, Music2, Mic, ImageIcon, Link as LinkIcon, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaType = "youtube" | "tiktok" | "reels" | "voice" | "gif";

export function MediaShareForm() {
  const [activeType, setActiveType] = useState<MediaType | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Card className="p-6 border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] space-y-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <PlayCircle size={18} className="text-[var(--color-deep-purple)]" />
          Media Share (Optional)
        </h3>
        {activeType && (
          <button
            onClick={() => setActiveType(null)}
            className="text-[10px] font-bold text-red-400 hover:text-red-500 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Media Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveType(activeType === "youtube" ? null : "youtube")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all whitespace-nowrap",
            activeType === "youtube"
              ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
          )}
        >
          <Youtube size={16} />
          <span className="text-xs font-bold">YouTube</span>
        </button>
        <button
          onClick={() => setActiveType(activeType === "tiktok" ? null : "tiktok")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all whitespace-nowrap",
            activeType === "tiktok"
              ? "bg-black/5 border-black/10 text-slate-900 shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
          )}
        >
          <Music2 size={16} />
          <span className="text-xs font-bold">TikTok</span>
        </button>
        <button
          onClick={() => setActiveType(activeType === "reels" ? null : "reels")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all whitespace-nowrap",
            activeType === "reels"
              ? "bg-pink-50 border-pink-200 text-pink-600 shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
          )}
        >
          <ImageIcon size={16} />
          <span className="text-xs font-bold">Reels</span>
        </button>
        <button
          onClick={() => setActiveType(activeType === "voice" ? null : "voice")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all whitespace-nowrap",
            activeType === "voice"
              ? "bg-purple-50 border-purple-200 text-purple-600 shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
          )}
        >
          <Mic size={16} />
          <span className="text-xs font-bold">Voice Note</span>
        </button>
        <button
          onClick={() => setActiveType(activeType === "gif" ? null : "gif")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all whitespace-nowrap",
            activeType === "gif"
              ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
          )}
        >
          <ImageIcon size={16} />
          <span className="text-xs font-bold">GIF</span>
        </button>
      </div>

      {/* Input Area */}
      {activeType === "youtube" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            YouTube URL
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="https://youtu.be/..."
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-red-100 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>
      )}

      {activeType === "tiktok" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            TikTok URL
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="https://tiktok.com/@..."
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>
      )}

      {activeType === "reels" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Instagram Reels URL
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="https://instagram.com/reel/..."
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-pink-100 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>
      )}

      {activeType === "voice" && (
        <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isRecording ? "bg-red-500 animate-pulse" : "bg-slate-300"
              )}
            ></div>
            <span className="text-xs font-bold text-slate-600">
              {isRecording ? "Listening... 0:12" : "Press to record"}
            </span>
          </div>
          <button
            onClick={toggleRecording}
            className={cn(
              "p-2 rounded-full transition-all",
              isRecording
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <Mic size={18} />
          </button>
        </div>
      )}

      {activeType === "gif" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Search GIF
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search GIPHY..."
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-slate-300"
            />
          </div>
          {/* Mock GIF Results */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="aspect-square bg-slate-100 rounded-lg animate-pulse"></div>
            <div className="aspect-square bg-slate-100 rounded-lg animate-pulse delay-75"></div>
            <div className="aspect-square bg-slate-100 rounded-lg animate-pulse delay-150"></div>
          </div>
        </div>
      )}

      {/* Start & End Time (Only for video types) */}
      {(activeType === "youtube" || activeType === "tiktok" || activeType === "reels") && (
        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Start (sec)
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-slate-100 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Duration (max 10s)
            </label>
            <input
              type="number"
              placeholder="10"
              max={10}
              className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-slate-100 outline-none"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
