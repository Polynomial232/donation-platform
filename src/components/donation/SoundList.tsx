"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Play, Pause, Music, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

import { SoundBoardItem } from "@/types/discovery";

interface SoundListProps {
  data?: SoundBoardItem[];
  selectedAmount: number;
  onSelectAmount: (amount: number) => void;
}

export function SoundList({ data, selectedAmount, onSelectAmount }: SoundListProps) {
  const sounds = data || [];
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Effect to update parent amount when selection or quantity changes
  useEffect(() => {
    if (selectedId !== null) {
      const sound = sounds.find((s) => s.id === selectedId);
      if (sound) {
        onSelectAmount(sound.price * quantity);
      }
    }
  }, [selectedId, quantity, onSelectAmount, sounds]);

  const togglePlay = (id: string, audioUrl?: string) => {
    if (playingId === id) {
      setPlayingId(null);
      // In a real app, logic to stop audio would go here
    } else {
      setPlayingId(id);

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch((err) => console.error("Audio play failed:", err));
        audio.onended = () => setPlayingId(null);
      } else {
        // Simulate audio play
        setTimeout(() => setPlayingId(null), 2000);
      }
    }
  };

  const handleSelect = (id: string) => {
    if (selectedId === id) return;
    setSelectedId(id);
    setQuantity(1);
  };

  const updateQuantity = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setQuantity((prev) => {
      const newQty = prev + delta;
      return newQty < 1 ? 1 : newQty;
    });
  };

  return (
    <Card className="p-4 border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl space-y-3">
      <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 mb-2">
        <Music size={18} className="text-[var(--color-deep-purple)]" />
        Pilih Sound Effect
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {sounds.map((sound) => {
          const isSelected = selectedId === sound.id;
          const isPlaying = playingId === sound.id;

          return (
            <div
              key={sound.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group hover:shadow-md",
                isSelected
                  ? "bg-[var(--color-pastel-purple)] border-[var(--color-deep-purple)]/20"
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
              onClick={() => handleSelect(sound.id)}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay(sound.id, sound.audioUrl);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0",
                    isPlaying
                      ? "bg-[var(--color-deep-purple)] text-white"
                      : "bg-white border border-slate-100 text-slate-500 group-hover:border-[var(--color-deep-purple)] group-hover:text-[var(--color-deep-purple)]"
                  )}
                >
                  {isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  )}
                </button>

                <div>
                  <p
                    className={cn(
                      "text-xs font-bold leading-tight",
                      isSelected ? "text-[var(--color-deep-purple)]" : "text-slate-700"
                    )}
                  >
                    {sound.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Durasi: {sound.duration} • IDR {sound.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {isSelected ? (
                  <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-100">
                    <button
                      onClick={(e) => updateQuantity(e, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="text-xs font-black text-slate-800 w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={(e) => updateQuantity(e, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-[var(--color-deep-purple)] transition-colors"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-black px-2 py-1 rounded-lg bg-slate-50 text-slate-600">
                    IDR {sound.price.toLocaleString("id-ID")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400 font-medium text-center pt-2">
        *Total donasi dikalikan jumlah play sound
      </p>
    </Card>
  );
}
