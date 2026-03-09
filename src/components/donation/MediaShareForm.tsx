"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Youtube, Music2, Mic, ImageIcon, Link as LinkIcon, PlayCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import config from "@/lib/config";

import { CreatorSettings } from "@/types/discovery";

type MediaType = "youtube" | "tiktok" | "reels" | "voice" | "gif";

interface MediaShareFormProps {
  settings: CreatorSettings;
  amount: number;
}

export function MediaShareForm({ settings, amount }: MediaShareFormProps) {
  const [activeType, setActiveType] = useState<MediaType | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // GIPHY States
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);
  const [isSearchingGif, setIsSearchingGif] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  useEffect(() => {
    if (activeType !== "gif") return;

    const fetchGifs = async () => {
      setIsSearchingGif(true);
      try {
        const apiKey = config.GIPHY_API_KEY;
        const endpoint = gifSearchQuery.trim()
          ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(gifSearchQuery)}&limit=9`
          : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=9`;

        const res = await fetch(endpoint);
        const data = await res.json();
        if (data && data.data) {
          setGifs(data.data);
        }
      } catch (error) {
        console.error("Gagal memuat GIF", error);
      } finally {
        setIsSearchingGif(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchGifs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [gifSearchQuery, activeType]);

  const getPlatformMax = () => {
    if (!settings.media_share_settings) return 60;
    switch (activeType) {
      case "youtube":
        return settings.media_share_settings.youtube.max_duration_seconds;
      case "tiktok":
        return settings.media_share_settings.tiktok.max_duration_seconds;
      case "reels":
        return settings.media_share_settings.reels.max_duration_seconds;
      case "voice":
        return settings.media_share_settings.voice.max_duration_seconds;
      default:
        return 60;
    }
  };

  const getPricePerSecond = () => {
    if (!settings.media_share_settings) return 500;
    switch (activeType) {
      case "youtube":
        return settings.media_share_settings.youtube.price_per_second || 500;
      case "tiktok":
        return settings.media_share_settings.tiktok.price_per_second || 500;
      case "reels":
        return settings.media_share_settings.reels.price_per_second || 500;
      case "voice":
        return settings.media_share_settings.voice.price_per_second || 500;
      default:
        return 500;
    }
  };

  const platformMax = getPlatformMax();
  const pricePerSecond = getPricePerSecond();
  const budgetSeconds = Math.floor((amount || 0) / pricePerSecond);
  const maxDuration = activeType === "gif" ? 0 : Math.min(budgetSeconds, platformMax);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Card className="p-6 border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] space-y-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
          <PlayCircle size={18} className="text-(--color-deep-purple)" />
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
        {settings.media_share_settings?.youtube.is_enabled && (
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
        )}
        {settings.media_share_settings?.tiktok.is_enabled && (
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
        )}
        {settings.media_share_settings?.reels.is_enabled && (
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
        )}
        {settings.media_share_settings?.voice.is_enabled && (
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
        )}
        {settings.media_share_settings?.gif.is_enabled && (
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
        )}
      </div>

      {activeType && activeType !== "gif" && (
        <div className="bg-amber-50/80 px-4 py-3 rounded-2xl border border-amber-100 flex items-start gap-3">
          <div className="text-amber-500 mt-0.5">💡</div>
          <div className="text-[11px] leading-relaxed font-medium text-amber-800/80">
            Biaya media: <strong>Rp {pricePerSecond.toLocaleString("id-ID")}</strong> / detik.
            <br />
            Dengan donasi <strong>Rp {(amount || 0).toLocaleString("id-ID")}</strong>, kamu bisa
            memutar hingga <strong>{budgetSeconds} detik</strong>.<br />
            Namun kreator membatasi maksimal untuk {activeType.toUpperCase()} adalah{" "}
            <strong>{platformMax} detik</strong>. Jadi batas akhirmu saat ini:{" "}
            <strong>{maxDuration} detik</strong>.
          </div>
        </div>
      )}

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
              {isRecording ? "Listening... 0:12" : `Press to record (max ${maxDuration}s)`}
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
            Cari GIF
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari GIPHY..."
              value={gifSearchQuery}
              onChange={(e) => setGifSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-slate-300"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 max-h-[320px] overflow-y-auto pr-1">
            {isSearchingGif ? (
              <>
                <div className="aspect-square bg-slate-100 rounded-lg animate-pulse"></div>
                <div className="aspect-square bg-slate-100 rounded-lg animate-pulse delay-75"></div>
                <div className="aspect-square bg-slate-100 rounded-lg animate-pulse delay-150"></div>
              </>
            ) : gifs.length > 0 ? (
              gifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => setSelectedGif(gif.images.original.url)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-all relative group",
                    selectedGif === gif.images.original.url
                      ? "border-blue-500 scale-95"
                      : "border-transparent hover:scale-[1.02]"
                  )}
                >
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedGif === gif.images.original.url && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="bg-white p-1 rounded-full shadow-sm">
                        <Check size={14} className="text-blue-500" />
                      </div>
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-xs font-medium text-slate-400">
                Tidak ada GIF yang ditemukan.
              </div>
            )}
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
              Duration (max {maxDuration}s)
            </label>
            <input
              type="number"
              placeholder={maxDuration.toString()}
              max={maxDuration}
              className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-slate-100 outline-none"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
